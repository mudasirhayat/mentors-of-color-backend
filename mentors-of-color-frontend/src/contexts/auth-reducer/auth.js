// action - state management
import { REGISTER, LOGIN, LOGOUT, UPDATE, UPDATE_USER } from './actions';

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload;
      return {
        ...state,
        user
      };
    }
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null
      };
    }
    case UPDATE: {
      const { updatedProfile } = action.payload;
      return {
        ...state,
        user: {
          ...state.user, user_profile: updatedProfile
        }
      }
    }
    case UPDATE_USER: {
      const { user } = action.payload;
      return {
        ...state,
        user: {
          ...user
        }
      }
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
