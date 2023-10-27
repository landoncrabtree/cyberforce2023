import { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import { AuthContext } from '../context/AuthContext';

function NavBar() {
  const { logoutUserAction, token, role } = useContext(AuthContext);

  return (
    <div className='navbar'>
      <header>
        <a href='/'>
          <img
            className='logo'
            src={require('../assets/img/DER8-9.png')}
            alt='logo'
          />
        </a>

        <nav>
          <ul className='nav__links'>
            <li>
              <a href="/#about">About Us</a>
            </li>
            <li>
            <a href="/der-data">DER Data</a>
            </li>
            <li>
              {role === 'admin' ? (
                <a href="/admin">Admin Panel</a>
              ) : (
                <a href="/#contact">Contact Us</a>
              )}
            </li>
          </ul>
        </nav>

        {!token && (
          <a href="/log-in" className='cta'>
            <button>Log In</button>
          </a>
        )}
        {token && (
          <button onClick={logoutUserAction} className='cta'>
            Logout
          </button>
        )}
      </header>
    </div>
  );
}

export default NavBar;
