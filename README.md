# Brain Tumor Image Classification Web Application

This web application is designed to classify brain tumor images in MRI scans. It utilizes a machine learning model, created and trained in google colab, to predict whether a given image contains a glioma tumor, meningioma tumor, pituitary tumor, or no tumor. Furthermore, it hightlights the tumor by displaying a red border around the identified tumor.

## Features

- Upload multiple MRI images for classification.
- View uploaded images.
- View the classification results for each uploaded image.
- View highlighed tumor areas in each of the uploaded images.

## Technologies Used

- **Frontend:**
  - React.js for building the user interface.

- **Backend:**
  - Flask for building the API endpoints.
  - TensorFlow and Keras for image classification.
  - OpenCV for image processing.
  - Flask-CORS for enabling cross-origin resource sharing.

## Getting Started

To run this project locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies for both the frontend and backend:
    - frontend
      - cd client
      - npm install
    - backend 
      - cd server
      - pip install -r requirements.txt
4. Start the Application:
    - python app.py

5. Open your browser and visit http://localhost:3000 to view the application.

## File Structure

- **client:** Contains frontend code written in React.js.
- **server:** Contains backend code written in Flask.

## Authors

- [Your Name](https://github.com/yourusername)

## License

This project is licensed under the [MIT License](LICENSE).

---
Made by NaBo-00 | Copyright (c) NaBo-00

<!--Made by Na-Bo00 ![Na-Bo00-Logo.jpg](Na-Bo00-Logo.jpg "Na-Bo00-Logo")--!>
<div><img alt="NaBo-00-logo" src="./readme_img/NaBo-00-logo.png" width="100" height="60" /></div>