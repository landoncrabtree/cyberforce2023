import '../styles/Home.css';

/* For contact us logic */
import '../styles/ContactUs.css';
import RoomIcon from '@mui/icons-material/Room';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';

import React, { useRef, useState } from 'react';
import ContactUsRequest from '../functions/ContactUsRequest';
// import { showAlert } from '../components/Alerts';

function Home() {

  const [userData, setUserData] = useState({
    fullname: '',
    email: '',
    phonenumber: '',
    message: '',
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);


  const onChangeHandler = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onFileChangeHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    ContactUsRequest(userData, file);
    // Reset the state of input fields
    setUserData({
      fullname: '',
      email: '',
      phonenumber: '',
      message: '',
    });
    setFile(null);
    fileInputRef.current.value = null;
  };





  return (
    <div className='content-container-home'>

      {/* Header */}
      <div className='about-container'>
        <div className='home-header'>
          <h1>Welcome to DER8.9</h1>
          <p>Part of JakaaGen Inc</p>
        </div>
      </div>
      {/* Header */}

      {/* Description */}
      <div className='description'>
        <p>DER8.9 is a leading utility company specializing in Distributed Energy Resources (DER). We are dedicated to revolutionizing the energy landscape by harnessing the power of renewable energy and advanced technology.</p>
      </div>
      {/* Description */}

      {/* DER Data */}
      <div className='der-data'>
        <h2>DER Data Display</h2>
        <p>
          Access real-time data on our distributed energy resources and monitor
          their performance. Stay informed about energy production, consumption,
          and savings.
        </p>
        <a href='/der-data'>View DER Data</a>
      </div>
      {/* DER Data */}

      {/* About Us */}
      <div className='services-heading' id='about'>
        <h2>About Us</h2>
      </div>
      <div className='services'>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Solar Power Solutions</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/solarpanel.jpg')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <span>
              We design, install, and maintain state-of-the-art solar photovoltaic systems for residential, commercial, and industrial applications.
            </span>
          </div>
        </div>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Energy Storage Solutions</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/energystorage.jpeg')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <span>
              We offer cutting-edge energy storage solutions, utilizing advanced battery technologies, to store excess energy generated from renewable sources.
            </span>
          </div>
        </div>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Microgrid Development</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/energy-management-system-for-microgrids.png')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <span>
              DER8.9 specializes in developing and implementing customized microgrid solutions that integrate various energy resources.
            </span>
          </div>
        </div>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Demand Response Programs</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/IEC–DRP_IMAGE1.jpg')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <span>
              We assist our customers in participating in demand response programs to actively manage their energy consumption during high-demand periods.
            </span>
          </div>
        </div>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Energy Management and Monitoring</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/shutterstock_1504979759-1-scaled.jpg')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <span>
              Our innovative energy management software enables customers to track, analyze, and optimize their energy usage in real-time.
            </span>
          </div>
        </div>
        <div className='service-card'>
          <div className='service-card-header'>
            <div className='card-heading'>
              <h3>Smart Grid Integration</h3>
            </div>
          </div>
          <div className='card-img-wrap'>
            <img
              src={require('../assets/img/smart-grid.jpg')}
              className='card-image'
              alt='solar panel instalation'
              height='100px'
            />
          </div>
          <div className='service-card-details'>
            <div>
              <span>
                Seamlessly integrate energy systems with smart grid tech for reliable, efficient management using advanced analytics and real-time monitoring.
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* About Us */}


      {/* Social Proof */}
      <div className='social-proof'>
        <h2>Testimonies</h2>
        <div className='testimonial'>
          <img
            src={require('../assets/img/testimony/johndoe.jpg')}
            alt='Customer 1'
          />
          <p>
            "DER8.9's renewable energy solutions have helped us reduce our
            energy costs and minimize our environmental impact. Highly
            recommended!"
          </p>
          <span>- John Doe, CEO of ABC Corporation</span>
        </div>
        <div className='testimonial'>
          <img
            src={require('../assets/img/testimony/janedoe.jpg')}
            alt='Customer 2'
          />
          <p>
            "We are thrilled with the microgrid solution implemented by
            DER8.9. It has significantly improved our energy resiliency and
            reduced downtime during grid outages."
          </p>
          <span>- Jane Smith, Facilities Manager at XYZ Hospital</span>
        </div>
      </div>
      {/* Social Proof */}

      <div className='contact-container' id='contact'>
        <div className='home-header'>
          <h1>Contact Us Today!</h1>
        </div>
        <button className='contact-btn' onClick={() => window.location.href = '/contact-us'}>Contact Us</button>
      </div>


      





    </div>
  );
}

export default Home;
