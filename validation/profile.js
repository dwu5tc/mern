const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateProfileInput(data) {
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle : '';
	data.status = !isEmpty(data.status) ? data.status : '';
	data.skills = !isEmpty(data.skills) ? data.skills : '';

	const requireds = ['handle', 'status', 'skills'];
	requireds.forEach(required => {
		if (Validator.isEmpty(data[required])) {
			errors[required] = `Profile ${ required } is required!`;
		}
	});
	
	if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
		errors.handle = 'Handle needs to be between 2 and 40 characters!';
	}

	if (!isEmpty(data.website) && !Validator.isURL(data.website)) {
		errors.website = 'Not a valid URL!';
	}

	const socials = ['youtube', 'twitter', 'facebook', 'linkedin', 'instagram'];
	socials.forEach(social => {
		if (!isEmpty(data[social]) && !Validator.isURL(data[social])) {
			errors[social] = 'Not a valid URL!';
		}
	});

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
