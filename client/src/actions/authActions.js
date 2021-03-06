import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { 
	GET_ERRORS, 
	SET_CURRENT_USER 
} from './types';

// register user 
export const registerUser = (userData, history) => dispatch => {
	axios.post('/api/users/register', userData)
		.then(res => history.push('/login')) // redirect to login
		.catch(err => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
}

// login user
export const loginUser = userData => dispatch => {
	axios.post('/api/users/login', userData)
		.then(res => {
			const { token } = res.data;
			localStorage.setItem('jwtToken', token);
			setAuthToken(token);
			const decoded = jwt_decode(token);
			dispatch(setCurrentUser(decoded));
		})
		.catch(err => dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		}));
}

export const setCurrentUser = decoded => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	}
}

export const logoutUser = () => dispatch => {
	localStorage.removeItem('jwtToken');
	setAuthToken(false);
	dispatch(setCurrentUser({}));
} 