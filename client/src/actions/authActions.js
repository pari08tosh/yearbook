import axios from 'axios';
import { USER_LOGIN, USER_LOGOUT, USER_ERROR } from '../actions/types';

export const login = (user) => dispatch => {
  return axios.post('/users/login', user)
    .then(res => {
      
      localStorage.setItem('user', JSON.stringify(res.data));

      dispatch({
        type: USER_LOGIN,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: USER_ERROR,
      });
      return handleError(err);
    });
};

export const logout = () => {

  localStorage.removeItem('user');

  return {
    type: USER_LOGOUT
  };
};

function handleError(err) {
  return err.response.data.message || `Error Connecting to Server. Check your network connection.`;
}
