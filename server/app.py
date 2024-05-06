# Imports
import time
from flask import Flask, request, jsonify
from flask_cors import CORS

import numpy as np
import cv2
import keras
import base64

# Initialize Flask app
app = Flask(__name__, static_url_path='', static_folder='../client/build', template_folder='../client/build')
# Enable CORS for all routes
CORS(app)  

# Load the model during initialization
model = keras.models.load_model("./bt-model.h5")

# Error handler for 404
@app.errorhandler(404)
def not_found(e):
    # Check if the request is for the API
    if request.path.startswith('/api/'):
        return jsonify(error='Not found'), 404
    # Otherwise, serve the static file
    return app.send_static_file('index.html')


# Route for serving index.html for root endpoint
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Function to highlight tumor in the image
def highlight_tumor(image):
    def auto_canny(image, sigma=0.33):
        v = np.median(image)
        lower = int(max(0, (1.0 - sigma) * v))
        upper = int(min(255, (1.0 + sigma) * v))
        edged = cv2.Canny(image, lower, upper)
        return edged

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY)  # Adjust threshold parameters
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))  # Adjust kernel size
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    closed = cv2.erode(closed, None, iterations=6)  # Adjust erosion iterations
    closed = cv2.dilate(closed, None, iterations=6)  # Adjust dilation iterations
    canny = auto_canny(closed)
    
    cnts, _ = cv2.findContours(canny.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    print("Number of contours found:", len(cnts))  # Check number of contours found
    image_with_contours = image.copy()
    cv2.drawContours(image_with_contours, cnts, -1, (0, 0, 255), 2)

    return image_with_contours


# Route for handling image classification
@app.route('/api/classify', methods=['POST'])
def classify_image():
    classification_results = []
    try:
        for image_file in request.files.getlist('image'):
            img_name = image_file.filename
            img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
            img = cv2.resize(img, (150, 150))
        
            # Highlight tumor area
            img_with_tumor_highlighted = highlight_tumor(img)
            
            # Classify image
            img_array = np.array(img)
            img_array = img_array.reshape(1, 150, 150, 3)
            predictions = model.predict(img_array)
            classification_index = np.argmax(predictions)
            classes = ["Glioma Tumor", "Meningioma Tumor", "No Tumor", "Pituitary Tumor"]
            classification_result = classes[classification_index]
            
            # Convert highlighted image to base64 for sending to frontend
            _, img_encoded = cv2.imencode('.png', img_with_tumor_highlighted)
            img_base64 = base64.b64encode(img_encoded).decode('utf-8')

            classification_results.append({'imageName': img_name, 'result': classification_result, 'highlighted_image': img_base64})
    except Exception as e:
        return jsonify(error=str(e)), 500  # Return error response with status code 500

    return jsonify(classification_results)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
