import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT, UPDATE, UPDATE_USER } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios, { axiosServices1 } from 'utils/axios';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken, refreshToken, user, userType, accountID) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    axiosServices1.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete axiosServices1.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          const user = JSON.parse(window.localStorage.getItem('user'));
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          logout()
        }
      } catch (err) {
        console.error(err);
        logout()
      }
    };

    init();
  }, []);

  const login = async (email, password) => {
    const response = await axiosServices1.post('/auth/login/', { email, password });

    const { access_token, refresh_token, account_id, user, user_type, associated_user_id } = response.data;
    user.account_id = account_id
    user.user_type = user_type
    user.associated_user_id = associated_user_id
    setSession(access_token, refresh_token, user);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const updateProfile = async (userID, data) => {
    try {
      const response = await axiosServices1.put(`api/users/${userID}/profile/`, data);
      const updatedData = response.data
      const user = JSON.parse(window.localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...user, user_profile: updatedData }));

      dispatch({
        type: UPDATE,
        payload: {
          updatedProfile: updatedData
        }
      });
    } catch (err) {
      console.log("error occurred updating profile", err)
      throw new Error("Some error occurred while sending reset instructions ");
    }
  };

  const register = async (email, password, firstName, lastName) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post('/api/account/register', {
      id,
      email,
      password,
      firstName,
      lastName
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          name: `${firstName} ${lastName}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  const updateUser = (userParam) => {
    const { account_id, user, user_type, associated_user_id } = userParam;
    user.account_id = account_id
    user.user_type = user_type
    user.associated_user_id = associated_user_id
    localStorage.setItem('user', JSON.stringify(user));

    dispatch({
      type: UPDATE_USER,
      payload: {
        user: user
      }
    });
  }

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => { };


  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile, updateUser }}>{children}</JWTContext.Provider>;
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
