import React, { Component } from 'react';
import './loginform.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { withAlert } from 'react-alert';
import axios from 'axios';
const Recaptcha = require('react-recaptcha');


class Loginform extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       username: '',
       password: '',
       error: '',
       forgotPassword: false,
       email: '',
       loading: false,
       recaptchaResponse: ''
    };
    
  }

  onCaptcha = (e) => {
    this.setState({recaptchaResponse: e});
  }

  onchange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: ''});
    this.setState({loading: true});
    this.props.login({
      username: this.state.username,
      password: this.state.password
    }).then(err => {
      if(err) {
        this.props.alert.error(err);
        this.setState({ error: <p className="text-danger text-center"> {err} </p>})
      }
      this.setState({loading: false});
    });
  }

  onSubmitEmail = (e) => {
    e.preventDefault();
    this.setState({ error: ''});
    this.setState({loading: true});
    axios.post('/users/forgotPassword', { email: this.state.email, recaptchaResponse: this.state.recaptchaResponse })
    .then(data => {
      this.props.alert.success(`A mail has been sent with your details.`);
      this.setState({forgotPassword: false});
      this.setState({loading: false});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
      this.setState({ error: <p className="text-danger text-center"> {err.response.data.message} </p>})
      this.setState({loading: false});
    })
  }

  onForgotPassword = (e) => {
    this.setState({forgotPassword: true});
  }
  
  
  render(){
    return (
      <div className="postform mx-auto card mt-5 shadow-lg">
        <div className="card-body">
          {
            (!this.state.forgotPassword) ? (
              <div>
                <h5 className="text-center card-title">Login With DC</h5>
                <h6 className="card-subtitle mb-2 text-muted text-center mb-3 mt-2">No registration required. Login Directly with DC Credentials and build your profile.</h6>
                {this.state.error}
                <form onSubmit={this.onSubmit}>
                  <div className="form-group mb-3">
                    <input type="text" className="form-control" id="username" name="username" placeholder="Your DC Username" value={ this.state.username } onChange={ this.onchange } required/>
                  </div>
                  <div className="form-group mb-4">
                    <input type="password" className="form-control" id="password" name="password" placeholder="Your DC Password" value={ this.state.password } onChange={ this.onchange } required/>
                  </div>
                  <button disabled={this.state.loading} type="submit" className="btn btn-block btn-sm btn-primary">Submit</button>
                </form>
                <p style={{textAlign: 'left'}} className="mt-3 text-muted forgot-password" onClick={this.onForgotPassword}>Forgot Password</p>
              </div>

            ) : (
              <div>
                <h5 className="text-center card-title">Forgot Password</h5>
                <h6 class="card-subtitle text-muted text-center mb-3 mt-2">Enter Email-Id linked with DC</h6>
                {this.state.error}
                <form onSubmit={this.onSubmitEmail}>
                  <div className="form-group mb-3">
                    <input type="email" className="form-control" id="email" name="email" placeholder="Your DC Email" value={ this.state.email } onChange={ this.onchange } required/>
                  </div>
                  <div className="captcha mb-3">
                    <Recaptcha
                    sitekey="6LcEZnwUAAAAAGiViPP2mbXwvbr31C3k6K5PNpDk"
                    render="explicit"
                    verifyCallback={this.onCaptcha}
                    onloadCallback={this.onCaptcha}
                    data-size="compact"
                  />
                  </div>
                  <button disabled={this.state.loading} type="submit" className="btn btn-block btn-sm btn-primary">Submit</button>
                </form>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

Loginform.propTypes = {
  login: PropTypes.func.isRequired,
}

export default connect(null, { login })(withAlert(Loginform));



