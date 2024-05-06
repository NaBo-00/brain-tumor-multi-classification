import React, { useState } from 'react';
import './App.css';
import Header from "./Header"
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  // State variables for managing images, errors, loading state, and classification results
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultsAndImages, setResultsAndImages] = useState([]);

  // Function to handle image selection
  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    const selectedImagesValid = selectedImages.filter(image => image && (image.type === 'image/png' || image.type === 'image/jpeg' || image.type === 'image/jpg'));
    
    setImages(selectedImagesValid);
    setErrors(selectedImages.map((image, index) => !selectedImagesValid.includes(image) ? `Please select a PNG or JPG file for image ${index + 1}.` : ''));
  };

  // Function to handle image classification
  const handleClassify = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("image", image);
      });
  
      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      setResultsAndImages(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render component
  return (
    <Router>
      <Header/>   
      <div className="App">
        <body className="App-body">       
          <h1>Brain Tumor Image Classification</h1>
          <div className='description'>
            <p>This web application is able to classify Brain Tumors in MRI scans.</p>
          </div> 
          <div className='labels'>
            <p>Labels:</p>
            <p>Glioma Tumor | Meningioma Tumor | Pituitary Tumor | No Tumor</p>
          </div>
          <div className='select-image'>
            <input id="files" className="uploadImages" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} multiple />
          </div>
          <div className="result">
            {errors.map((error, index) => error && <p key={index} style={{ color: 'red' }}>{error}</p>)}
            {images.length > 0 && (
              <div>
                <h3>Selected Images:</h3>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={URL.createObjectURL(image)} alt={`Selected ${image.name}`} width="250" height="250" />
                  </div>
                ))}
                <br></br>
                <button className='submitClassification' onClick={handleClassify} disabled={loading}>{loading ? 'Classifying...' : 'Classify'}</button>                            
                <br></br>
                <span>scroll to see results</span>
              </div>
            )}
            {Array.isArray(resultsAndImages) && resultsAndImages.map((data, index) => (
              <div key={index} className="result-and-image">
                <h3>Classification Result:</h3>
                <p>Image {data.imageName}: {data.result}</p>
                {data.result !== "No Tumor" && data.highlighted_image && (
                  <img
                    src={`data:image/png;base64,${data.highlighted_image}`}
                    alt={`Highlighted ${data.imageName}`}
                    width="250"
                    height="250"
                  />
                )}
              </div>
            ))}
          </div>         
        </body>
      </div>
    </Router>
  );
}

export default App;
