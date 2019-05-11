import React, { Component } from 'react';
import './searching.scss';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import { withAlert } from 'react-alert';
import UserCard from '../userCard/userCard';
import Navbar from "../navbar/navbar";


class Searching extends Component {

  constructor(props) {
    super(props)

    this.state = {
        searching: true,
        loading: true,
        searchResults: []
    }
  }

  onChange = (e) => {
    this.setState({loading: true});
    if(e.target.value) {
      axios.post('/users/searchUsers', { searchString: e.target.value })
      .then(res => {
        this.setState({searchResults: res.data.data, loading: false});
      })
      .catch(err => {
          this.setState({loading: true});
          this.props.error(`Search Error, please try again later`);
      });
    }
  }

  render() {
    return (
      (!this.state.searching) ? <Redirect to="/" push/> : 
      <div className="searching container-fluid">
        <Navbar/>
        <div className="input-group searchbar mb-3 mt-5 mx-auto animated fadeIn">
          <input ref={input => input && input.focus()} type="text" className="form-control" placeholder="Search People" onFocus={this.onSearch} onChange={this.onChange}/>
        </div>
        {
          (this.state.loading) ?
          <div className="spinner-searching">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div> : (
            <div className="row align-items-center">
              {this.state.searchResults.map((user) => <div key={user._id} className="col-lg-3 py-5"><Link to={`/${user.course.toLowerCase()}-${user.rollnumber}-${user.year}`} style={{textDecoration: 'none', color: 'black'}}><UserCard user= {user}/></Link> </div>)}
            </div>
          )
        }
      </div>
    )
  }
}

export default withAlert(Searching);