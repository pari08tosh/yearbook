import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withAlert } from 'react-alert'
import axios from 'axios';
import './editProfile.scss';
import Navbar from '../navbar/navbar';



class EditProfile extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       user: {
         name: '',
         password: '',
         branch: '',
         course: '',
         rollnumber: '',
         year: '',
         email: '',
         quote: '',
         about: '',
         facebookProfile: '',
         linkedinProfile: '',
         avatar: ''
       },
       submitBtnDisable: false
    };
  }

  onchange = (e) => {
    this.setState({user: { 
      ...this.state.user,
      [e.target.name]: e.target.value
    } 
    });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({submitBtnDisable: true})
    axios.post('/users/updateProfile', this.state.user, {headers: { 'Authorization' : this.props.auth.token }})
    .then(res => {
      this.props.alert.success(`Successfully Updated Profile`);
      this.setState({submitBtnDisable: false});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
      this.setState({submitBtnDisable: false});
    });
  }
  
  componentDidMount() {
    return axios.post('/users/getUser', {rollnumber: this.props.auth.rollnumber})
    .then(res => {
      this.setState({user: {
        ...this.state.user,
        ...res.data.data
      }
      });
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });
  }

  render() {
    return (
      <div className="container-fluid edit-profile animated fadeIn">
        <Navbar/>
        <div className="row mt-5">
            <div className="col-md-4 text-center">
              <img className="avatar img-fluid mt-5 shadow" src={ `assets/avatars/${ this.state.user.avatar }`} alt=""/>
              <h4 className="mt-5 mb-3">Change Avatar</h4>
                <form action="/users/updateAvatar" method="POST" encType="multipart/form-data">
                  <div className="form-group px-5">
                    <input type="file" className="form-control" width="250" id="avatar" name="avatar" placeholder="Upload Picture"/>
                  </div>
                  <input type="text" hidden id="token" name="token" value={ this.props.auth.token } readOnly/>
                  <button type="submit" className="btn btn-sm btn-primary">Submit</button>
                </form>
            </div>
            <div className="mt-3 col-md-8 pt-3 pb-5" style={{borderLeft: '2px solid #3498db'}}>
              <h2 className="text-center">Build Your Profile</h2>
              <hr/>
              <form className="mt-5" onSubmit={this.onSubmit}>
                <div className="row">
                  <div className="form-group col-md">
                      <label htmlFor="name">Name</label>
                      <input type="text" className="form-control" id="name" name="name" value={ this.state.user.name } onChange={ this.onchange }/>
                  </div>
                  <div className="form-group col-md">
                      <label htmlFor="password">Password</label>
                      <input type="password" className="form-control" id="password" name="password" placeholder="Change Password" value={ this.state.user.password } onChange={ this.onchange }/>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md">
                    <label htmlFor="rollno">Roll No</label>
                    <input type="text" className="form-control" id="rollno" name="rollNo" readOnly value={ `${this.state.user.course}/${this.state.user.rollnumber}/${this.state.user.year}` } onChange={ this.onchange }/>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="branch">Branch</label>
                    <input type="text" className="form-control" id="branch" name="branch" placeholder="Eg: Mechanical Engineering" value={ this.state.user.branch } onChange={ this.onchange }/>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="abc@xyz.com" value={ this.state.user.email } onChange={ this.onchange }/>
                  </div>
                </div>
                <hr/>
                <div className="mt-5">
                  <div className="form-group">
                    <label htmlFor="quote">Yearbook Quote</label>
                    <input type="text" className="form-control" id="quote" name="quote" placeholder="It can be funny, it can be emotional, but do keep it short." value={ this.state.user.quote } onChange={ this.onchange }/>
                  </div>
                  <div className="form-group mt-5 pb-3">
                    <textarea type="text" className="form-control" rows="5" id="about" name="about" placeholder="A few words about your journey in college. Write about your fondest memories and the amazing people you met here. But don't reveal much, let your friends the talking." value={ this.state.user.about } onChange={ this.onchange }></textarea>
                  </div>
                </div>
                <hr/>
                <div className="row mt-3">
                  <div className="form-group col-md">
                    <label htmlFor="facebookProfile">Facebook Profile Link</label>
                    <input type="text" className="form-control" id="facebookProfile" name="facebookProfile" value={ this.state.user.facebookProfile } onChange={ this.onchange }/>
                  </div>
                  <div className="form-group col-md">
                    <label htmlFor="linkedinProfile">LinkedIn Profile Link</label>
                    <input type="text" className="form-control" id="linkedinProfile" name="linkedinProfile" value={ this.state.user.linkedinProfile } onChange={ this.onchange }/>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block mt-3" disabled = {this.state.submitBtnDisable}>Submit</button>
              </form>
            </div>
        </div>
      </div>
    )
  }
}

EditProfile.propTypes = {
    auth: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps, {})(withAlert(EditProfile));
