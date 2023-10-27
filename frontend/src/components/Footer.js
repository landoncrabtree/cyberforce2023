import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <div className='footer_wrapper'>
      <footer>
        <div className='img-container'>
          <Link to='/'>
            <img
              className='logo'
              src={require('../assets/img/DER8-9.png')}
              alt='logo'
            />
          </Link>
        </div>

        <div>
          <ul className='footer_links'>
            <li>
            <a href="/#about">About Us</a>
            </li>
            <li>
            <a href="der-data">About Us</a>
            </li>
            <li>
            <a href="/#contact">About Us</a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
