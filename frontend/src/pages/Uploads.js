import { useState } from 'react';
import '../styles/Uploads.css';

function Uploads() {
  const [filename, setFilename] = useState('');
  const [fileData, setFileData] = useState(null);

  const handleInputChange = (event) => {
    setFilename(event.target.value);
  };

  const handleFileRetrieval = () => {
    // Make an HTTP GET request to your server API endpoint
    fetch('/api/contact-data/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('File not found');
        }
        return response.blob();
      })
      .then((data) => {
        setFileData(data);
      })
      .catch((error) => {
        console.error('Error retrieving file:', error);
      });
  };

  return (
    <div className='content-container'>
      <div className='contact-container'>
        <div className='contact_us-wrapper'>
          <div className='left-box'>
            <div className='margin-box'>
              <div className='form-wrapper'>
                <div className='left-Header mb-60'>
                <h3>Uploads</h3>
                  </div>
                
                  <div className='form-inputs-box'>
                    <div className='form-input'>
                      <input 
                      className='input-field'
                      type="text" 
                      value={filename} 
                      onChange={handleInputChange} 
                      placeholder='Filename'
                      />
                      </div>

                  </div>
                  <button onClick={handleFileRetrieval}>Retrieve File</button>
                
            

              </div>
                {fileData && (
                  <div>
                    <p>File retrieved successfully!</p>
                    <a
                      href={URL.createObjectURL(fileData)}
                      download={filename}
                    >
                      Download File
                    </a>
                  </div>
                )}
                </div>
                
            </div>
          </div>        
        </div>
    </div>
  );
}

export default Uploads;
