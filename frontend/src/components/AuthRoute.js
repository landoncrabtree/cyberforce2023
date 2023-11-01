import '../styles/AuthRoute.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import unauthorized from '../assets/img/error_401.jpg';
import base64 from 'base-64';

const AuthRoute = ({ children } = {}) => {
  const { userAuth } = useContext(AuthContext);

  const auth = JSON.parse(localStorage.getItem('userAuth')).user;
  // base64 decode
  const decoded = base64.decode(auth);
  // xor with key
  const key = 'meow_meow';
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  // parse json
  const user = JSON.parse(result);



  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  return (
    <div className='content-container authroute'>
      <div className='unauth-txt'>
        <span>You must be an Admin to view this page! </span>
      </div>
      <div className='unauth-img'>
        <img src={unauthorized} alt='unathorized-img' />
      </div>
    </div>
  );
};

export default AuthRoute;
