import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import { showAlert } from '../components/Alerts';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  SIGNUP_SUCCESS,
} from './authActionTypes';
import base64 from 'base-64';

export const AuthContext = createContext();

const INITIAL_STATE = {
  userAuth: JSON.parse(localStorage.getItem('userAuth')),
  error: null,
  loading: false,
  profile: null,
};

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('userAuth', JSON.stringify(payload));
      return {
        ...state,
        loading: false,
        profile: null,
        error: null,
        userAuth: payload,
      };
    case LOGIN_FAILED:
      return {
        ...state,
        loading: false,
        profile: null,
        error: null,
        userAuth: payload,
      };
    case SIGNUP_SUCCESS:
      localStorage.setItem('userAuth', JSON.stringify(payload));
      return {
        ...state,
        error: null,
        loading: false,
        profile: null,
        userAuth: payload,
      };
    case LOGOUT:
      localStorage.removeItem('userAuth');
      return {
        ...state,
        loading: false,
        profile: null,
        error: null,
        userAuth: null,
      };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  //login action
  const SignInRequest = (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // "Authorization":
      },
    };
    axios
      .post('/api/users/login', formData, config)
      .then((res) => {
        //const user = res.data.data;
        const resp = res.data.data.user;
        // base64 decode
        const b64 = base64.decode(resp);
        // xor with key
        const key = 'meow_meow';
        let result = '';
        for (let i = 0; i < b64.length; i++) {
          result += String.fromCharCode(b64.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        // parse json
        const user = JSON.parse(result);
    
        if (res?.data?.status === 'success') {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: res.data.data,
          });
          showAlert('success', `Logged in successfully as ${user.fullname}`);
          (() =>
            setTimeout(() => {
              if (user.role === 'admin') {
                window.location.href = `/admin`;
              } else {
                window.location.href = '/'
              }
            }, 1000))();
          //redirect
          // window.location.href = '/'
        }
      })
      .catch((err) => {
        showAlert('error', 'Login failed');
        dispatch({
          type: 'LOGIN_FAILED',
          // payload: err?.response?.data?.message
        });
      });
  };

  const SignUpRequest = (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // "Authorization":
      },
    };
    axios
      .post('/api/users/signup', formData, config)
      .then((res) => {
        const role = res.data.data.user.role;
        if (res?.data?.status === 'success') {
          dispatch({
            type: 'SIGNUP_SUCCESS',
            payload: null,
          });
          showAlert('success', 'Account created successfully');
          (() =>
            setTimeout(() => {
              window.location.href = `/log-in`; //redirecting to sign in due to userauth stored incorrectly
              // window.location.href = `/${role}`;
            }, 1000))();
          //redirect
          // window.location.href = '/'
        }
      })
      .catch((err) => {
        showAlert('error', err.response.data.message);
        dispatch({
          type: 'LOGIN_FAILED',
          // payload: err?.response?.data?.message
        });
      });
  };

  const logoutUserAction = () => {
    dispatch({
      type: LOGOUT,
      payload: null,
    });
    window.location.href = '/log-in';
  };

  var user = state?.userAuth?.user;

  if (!user) {
    return (
      <AuthContext.Provider
        value={{
          SignInRequest,
          SignUpRequest,
          userAuth: state?.userAuth,
          token: null,
          role: null,
          logoutUserAction,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }


  // base64 decode
  var b64 = base64.decode(user);
  // xor with key
  var key = 'meow_meow';
  var result = '';
  for (let i = 0; i < b64.length; i++) {
    result += String.fromCharCode(b64.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }

  // parse json
  user = JSON.parse(result);



  return (
    <AuthContext.Provider
      value={{
        SignInRequest,
        SignUpRequest,
        userAuth: state?.userAuth,
        token: state?.userAuth?.token,
        role: user?.role,
        logoutUserAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
