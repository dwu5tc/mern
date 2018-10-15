import React, { Component } from 'react';

class Login extends Component {
	constructor() {
		super();

		this.state = {
			name: '',
			email: '',
			password: '',
			passwordConfirm: '',
			errors: {}
		}

		// this.onChange = this.onChange.bind(this);
	}

	// onChange(e) {
	// 	this.setState({
	// 		[e.target.name]: e.target.value
	// 	});
	// }

	onChange = e => this.setState({
		[e.target.name]: e.target.value
	});

	onSubmit = e => {
		e.preventDefault();

		const newUser = { 
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			passwordConfirm: this.state.passwordConfirm
		};
		console.log(newUser);
	}

	render() {
		return (
			<div className="login">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Log In</h1>
							<p className="lead text-center">Sign in to your DevConnector account</p>
							<form onSubmit={ this.onSubmit }>
								<div className="form-group">
									<input type="email" 
										className="form-control form-control-lg" 
										placeholder="Email Address" 
										name="email"
										value={ this.state.email }
										onChange={ this.onChange } />
								</div>
								<div className="form-group">
									<input type="password" 
										className="form-control form-control-lg" 
										placeholder="Password" 
										name="password" 
										value={ this.state.passworld }
										onChange={ this.onChange } />
								</div>
								<input type="submit" className="btn btn-info btn-block mt-4" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
