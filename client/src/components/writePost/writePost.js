import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import "./writepost.scss";
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withAlert } from 'react-alert';
import Navbar from "../navbar/navbar";
const Recaptcha = require('react-recaptcha');
 

class WritePost extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
      user: {
        name: '...',
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
      body: '',
      name: '',
      postImageVal: '',
      postImage: null,
      recaptchaResponse: '',
      redirect: ''
   };
  }

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  onChange = (e) => {
    if(e.target.name === 'postImage') {
      this.setState({postImage: e.target.files[0], postImageVal: e.target.value});
    } else {
      this.setState({[e.target.name]: e.target.value}, () => console.log(this.state));
    }
  }

  onCaptcha = (e) => {
    this.setState({recaptchaResponse: e});
  };

  onSubmit = (e) => {
    e.preventDefault();
    let fd = new FormData();
    fd.append('for', this.props.match.params.user);
    fd.append('postImage', this.state.postImage);
    fd.append('body', this.state.body);
    fd.append('form', this.state.from);
    fd.append('recaptchaResponse', this.state.recaptchaResponse);
    fd.append('name', this.state.name);

    axios.post('/posts/addPost', fd, {headers: { 'content-type': 'multipart/form-data', 'Authorization' : this.props.auth.token }})
    .then(data => {
      this.props.alert.success(data.data.message);
      this.setState({redirect: this.props.match.params.user});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });
  }

  componentDidMount() {
    axios.post('/users/getUser', {rollnumber: this.props.match.params.user})
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
      (this.state.redirect) ? <Redirect to={`/${this.state.redirect}`} push/> :
      <div className="container-fluid animated fadeIn">
        <Navbar/>
        <div className="mt-5 container">
          <Link to = {`/${this.props.match.params.user}`}><h3 className="text-center" style={{color: 'black'}}>A Post For {this.toTitleCase(this.state.user.name)}</h3></Link>
          <p className="text-center">
           <strong>This post will have to be approved by your friend before it shows up on his/her profile.</strong>
          </p>
        <hr/>
          <form onSubmit = {this.onSubmit}>
            <div className="row align-items-center mt-5">
              <div className="col-md-8">
              {
                (!this.props.auth.loggedIn) ? (
                  <div className="form-group">
                    <label htmlFor="name">Name and Batch</label>
                    <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={this.onChange} placeholder="Eg: Anuj Kumar, 2k12. Leave blank to be anonymous."/>
                  </div>
                ) : ""
              }
                <div className="form-group">
                  <textarea type="text" className="form-control" rows="10" id="body" name="body" value={this.state.body} onChange={this.onChange} placeholder="Write a post for your friend so he can proudly showcase meeting you on his profile. You can also attach an image with this post."></textarea>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group mb-5">
                  <label htmlFor="postImage">A Pic For Old Times Sake</label>
                  <input type="file" className="form-control" id="postImage" name="postImage" value={this.state.postImageVal} onChange={this.onChange} />
                </div>
                <Recaptcha
                  sitekey="6LcEZnwUAAAAAGiViPP2mbXwvbr31C3k6K5PNpDk"
                  render="explicit"
                  verifyCallback={this.onCaptcha}
                  onloadCallback={this.onCaptcha}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={ !this.state.body || !this.state.recaptchaResponse }>Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

WritePost.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withAlert(WritePost));

