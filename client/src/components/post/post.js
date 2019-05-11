import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom';
import './post.scss';

export default class Post extends Component {

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
  }

  render() {
    return (
      <div className="post-card m-2 my-4 p-3 shadow-sm">
        {
          (this.props.approve && !this.props.post.approved) ? (
            <div className="approve-btn-div text-right">
              <button className="btn btn-sm btn-primary" onClick={ () => this.props.onApprove(this.props.post) }><i className="fa fa-check" aria-hidden="true"></i> Approve</button>
            </div>
          ) : ""
        }
        <div className="row px-3 align-items-center">
          <div className="col-lg py-3">
            <p>{this.props.post.body}</p>
            <br/>
            <Link to = {`${this.props.post.fromRollnumber}`}> - {this.toTitleCase(this.props.post.fromName)}</Link>
          </div>
          {
            (this.props.post.imageName) ? (
              <div className="col-lg py-3 text-center">
                <img src={`/assets/postImages/${this.props.post.imageName}`} className="img-fluid shadow" alt=""/>
              </div>
            ) : ''
          }
        </div>
      </div>
    )
  }
}
