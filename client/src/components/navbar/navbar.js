import React, { Component } from 'react';
import "./navbar.scss";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { logout } from "../../actions/authActions";
import yearbookImage from '../../images/logoBlue.png';




class Navbar extends Component {

  onLogout = (e) => {
    e.preventDefault();
    this.props.logout();
  };


  render() {
    return (
      <div>
        <div className="header p-1 shadow">
          <div className="float-left">
          <Link to='/'><img className="yearbookimg img-fluid animated fadeIn" src={yearbookImage} alt=""/></Link>
          </div>
          <div className="float-right pr-3 mt-3">
          <Link to="/" className="btn btn-light mr-3 d-none d-sm-inline"><i className="fa fa-home"></i> Home</Link>
          {
            (this.props.auth.loggedIn) ?  (
              <Link to="/editProfile" className="btn btn-light mr-3"><i className="fa fa-edit" title="logout"></i> <span className="d-none d-sm-inline">Edit Profile</span></Link>
            ) : ""
          }
          {
            (this.props.auth.loggedIn) ?  (
              <button onClick={this.onLogout} className="btn btn-light"><i className="fa fa-sign-out" title="logout"></i> <span className="d-none d-sm-inline">Logout</span></button>
            ) : ""
          }
          </div>
        </div>
      </div>
    )
  }
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps, {logout})(Navbar);
  
