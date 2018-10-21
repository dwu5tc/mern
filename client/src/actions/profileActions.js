import axios from 'axios';

import { 
	GET_PROFILE, 
	PROFILE_LOADING, 
	CLEAR_CURRENT_PROFILE
} from './types';

// get current profile
export const getCurrentProfile = () => dispatch => {
	dispatch(setProfileLoading());
	axios.get('/api/profile')
		.then(res => 
			dispatch({
				type: GET_PROFILE,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({ // not GET_ERRORS because a user can have no profile
				type: GET_PROFILE,
				payload: {}
			})
		);
};

// profile loading
export const setProfileLoading = () => ({
    type: PROFILE_LOADING
});

// clear profile
export const clearCurrentProfile = () => ({
    type: CLEAR_CURRENT_PROFILE
});

