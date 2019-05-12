import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import './profile.scss';
import { Link } from 'react-router-dom';
import { withAlert } from 'react-alert';
import axios from 'axios';
import UserCard from '../userCard/userCard';
import Post from "../post/post";
import { logout } from "../../actions/authActions";
import Navbar from "../navbar/navbar";


class Profile extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       user: {
         name: '',
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
       posts: [],
       loading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.getData(newProps.match.params.user);
  }


  getData = (rollnumber) => {
    axios.post('/users/getUser', {rollnumber: rollnumber})
    .then(res => {
      let currentUser = this.state.user;
      for (let key in currentUser) {
        currentUser[key] = "";
      }
      this.setState({user: {
        ...currentUser,
        ...res.data.data
      }
      }, ()=> {
      });
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });

    axios.post('/posts/getPosts', {rollnumber: rollnumber}, {headers: { 'Authorization' : this.props.auth.token }})
    .then(res => {
      this.setState({posts: res.data.data});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });
  }

  componentDidMount() {   
    if(this.props.location.search) {
      const queryString = String(this.props.location.search);
      if(queryString.search('success=true') !== -1) {
        this.props.alert.success(`Post submitted successfully. Will be shown if approved.`);
      }
      if(queryString.search('success=false') !== -1) {
        this.props.alert.error(`Something went wrong. Please try again later.`);
      } 
    }

    this.getData(this.props.match.params.user);
  }

  onLogout = (e) => {
    e.preventDefault();
    this.props.logout();
  };

  onApprove = (post) => {
    this.setState({
      posts: this.state.posts.map(arrayPost => {
        if (arrayPost._id === post._id) { 
          arrayPost.loading = true;
         } 
        return arrayPost;
      })
    });
    axios.post('/posts/approvePost', post, {headers: { 'Authorization' : this.props.auth.token }})
    .then(res => {
      this.setState({
        posts: this.state.posts.map(arrayPost => {
          if (arrayPost._id === post._id) { 
            arrayPost.approved = true;
            arrayPost.loading = false;
           } 
          return arrayPost;
        })
      });
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
      this.setState({
        posts: this.state.posts.map(arrayPost => {
          if (arrayPost._id === post._id) { 
            arrayPost.loading = false;
           } 
          return arrayPost;
        })
      });
    })
  };

  render() {
    return (
      <div className="profile-div container-fluid animated fadeIn">

        {
          (!(this.props.auth.rollnumber === this.props.match.params.user) && this.props.auth.loggedIn) ? (
            <div className="edit-btn-div">
              <Link to={{
                pathname: `/writePost/${this.state.user.course.toLowerCase()}-${this.state.user.rollnumber}-${this.state.user.year}`,
                state: { for: this.state.user }
                }} className="btn btn-primary edit-btn" title="Write A Post"><i className="fa fa-pencil pl-1"></i> Write a Post
              </Link>
            </div>
          ) : ''
        }  

        <Navbar/>

        <div className="row mt-5">
          <div className="col-lg-3">
            <UserCard user={this.state.user}/>
          </div>
          <div className="col-lg-9 shadow posts-div">
            <div className="mt-5 pb-3 px-4">
              <p>{this.state.user.about}</p>
            </div>
            <div className="">
              {
                this.state.posts.map((post) => { return <Post key={post._id} post= {post} onApprove={this.onApprove} approve={ ((this.props.auth.loggedIn && this.props.match.params.user === this.props.auth.rollnumber) && !post.loading) ? true : false } /> })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logout})(withAlert(Profile));
