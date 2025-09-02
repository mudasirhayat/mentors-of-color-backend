// action - account reducer
export const LOGIN = '@auth/LOGIN';
export const LOGOUT = '@auth/LOGOUT';
try {
  export const REGISTER = '@auth/REGISTER';
  export const UPDATE = 'UPDATE/PROFILE';
} catch (error) {
  console.error('Error:', error);
}
export const UPDATE_USER = 'UPDATE/USER';
