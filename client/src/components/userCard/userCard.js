import React, { Component } from 'react'
import './userCard.scss';

export default class UserCard extends Component {
  
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
      <div>
        <div className="user-card mx-auto shadow">
          <div className="text-center">
            <img className="img-fluid avatar pb-3" src={`assets/avatars/${this.props.user.avatar}`} alt=""/> 
            <h3>{this.toTitleCase(this.props.user.name)}</h3>
            <p className=""><i className="fa fa-quote-left" aria-hidden="true"></i> { (this.props.user.quote) ? this.props.user.quote : "..." } <i className="fa fa-quote-right" aria-hidden="true"></i></p>
          </div>
          <div className="">
            <div className="row p-1">
              <div className="col-md-4 font-weight-light">Branch:</div>
              <div className="col-md-8">{ this.props.user.branch }</div>
            </div>
            <div className="row p-1">
              <div className="col-md-4 font-weight-light">Roll No:</div>
              <div className="col-md-8">{`${this.props.user.course}/${this.props.user.rollnumber}/${this.props.user.year}`}</div>
            </div>
            <div className="row p-1">
              <div className="col-md-3 font-weight-light email">Email:  </div>
              <div className="col-md-9 email">{this.props.user.email}</div>
            </div>
            <div className="pb-3 text-right">
              <a target="_blank" href={(this.props.user.facebookProfile) ? this.props.user.facebookProfile : null}>
                  <span className="fa-stack fa-lg p-3 px-4">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-facebook fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
              <a target="_blank" href={(this.props.user.linkedinProfile) ? this.props.user.linkedinProfile : null}>
                  <span className="fa-stack fa-lg p-3 px-2">
                  <i className="fa fa-circle fa-stack-2x"></i>
                  <i className="fa fa-linkedin fa-stack-1x fa-inverse"></i>
                  </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
