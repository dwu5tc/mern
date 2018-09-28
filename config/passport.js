const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		// console.log(jwt_payload);
		User.findById(jwt_payload.id).then(user => { // how does the jwt payload have the user id???
			if (user) {
				return done(null, user); // no error with user
			}
			return done(null, false) // no error but no user
		}).catch(err => console.log);
	}));
};