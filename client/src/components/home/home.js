import React, { Component } from 'react'
import Loginform from "../loginform/loginform";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withAlert } from 'react-alert'
import background from '../../images/bitBackground.jpg';
import yearbookImage from '../../images/logo-white.png';
import bitlogo from '../../images/bitlogo.png';
import { Redirect, Link } from 'react-router-dom';
import "./home.scss";
import axios from 'axios';
import UserCard from '../userCard/userCard';
import Post from '../post/post';

class Home extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       searching: false,
       recentUsers: [],
       recentPosts: []
    };
  }
  
  onSearch = (e) => {
    this.setState({searching: true});
  }

  getRecentProfiles = () => {
    axios.post('/users/getRecentUsers')
    .then(res => {
      this.setState({recentUsers: res.data.data});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });
  };

  getRecentPosts = () => {
    axios.post('/posts/getRecentPosts')
    .then(res => {
      this.setState({recentPosts: res.data.data});
    })
    .catch(err => {
      this.props.alert.error(err.response.data.message);
    });
  };

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  componentDidMount() {
    this.getRecentProfiles();
    this.getRecentPosts();
  }

  render() {
    return (
      (this.state.searching) ? <Redirect to='/search' push/> :
      <div>
        <div className={`container-fluid landing-div`} style={ { backgroundImage:`linear-gradient(rgba(97, 97, 97, 0.500), rgba(97, 97, 97, .200)), url(${background})` } }>
          <img className="bitlogo img-fluid d-none d-md-block" src={bitlogo} alt=""/>
          <div className="row align-items-center mb-5 text-center animated fadeIn">
            <div className={ this.props.auth.loggedIn || this.state.searching ? "col-sm-12" : "offset-lg-2 col-sm-8 col-md-4" } style={{ textAlign: 'center' }}>
              <img src={yearbookImage} className="img-fluid pt-5" alt=""/>
              <h4>Cause these memories should last forever...</h4>
            </div>
            {
              !(this.props.auth.loggedIn || this.state.searching)  ? (
                <div className="col-sm-4">
                  <Loginform />
                </div>
              ) : ''
            }
          </div>
          <div className="input-group searchbar mb-2 mx-auto">
            <input type="text" className="form-control" placeholder="Search People" onFocus={this.onSearch}/>
          </div>
          {
            (this.props.auth.loggedIn)  ? (
              <div className="floating-user">
                <Link to={`/${this.props.auth.rollnumber}`} className="btn btn-sm btn-outline-light mb-5">
                  <i className="fa fa-user"></i> {this.toTitleCase(this.props.auth.name)}
                </Link>
              </div>
            ) : ''
          }
          <div className="down-arrow text-center">
            <i className="fa fa-angle-down" aria-hidden="true"></i>
          </div>
        </div>
        <div className="recentProfiles container-fluid">
          <h3 className="text-center mt-5">Recently Updated Profiles</h3>
          <div className="row align-items-center">
            {this.state.recentUsers.map((user) => <div key={user._id} className="col-lg-3 py-5"><Link to={`/${user.course.toLowerCase()}-${user.rollnumber}-${user.year}`} style={{textDecoration: 'none', color: 'black'}}><UserCard user= {user}/></Link> </div>)}
          </div>
          <hr/>
        </div>
        <div className="recentPosts container-fluid mb-5">
          <h3 className="text-center p-3">Recent Posts</h3>
          <div id="postCarousel" className="carousel slide" data-ride="carousel">
            <div className="carousel-inner">
              {this.state.recentPosts.map((post, index) =>
                <div key={post._id} className={`carousel-item  ${index === 0 ? 'active' : ''}`}>
                  <Post post={post}  approve={false}/>
                </div>
              )}
            </div>
            <a class="carousel-control-prev" href="#postCarousel" role="button" data-slide="prev">
              <i class="fa fa-2x fa-angle-left" aria-hidden="true"></i>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#postCarousel" role="button" data-slide="next">
              <i class="fa fa-2x fa-angle-right" aria-hidden="true"></i>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

Home.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, {})(withAlert(Home));
