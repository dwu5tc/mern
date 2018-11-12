import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


// how does this all work?
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
	<Route 
		{ ...rest }
		render = { props => 
			auth.isAuthenticated ? (
				<Component { ...props } />
			) : (
				<Redirect to="/login" />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: state.auth
});


export default withRouter(connect(mapStateToProps)(PrivateRoute));