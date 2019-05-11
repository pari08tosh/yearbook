import React, { Component } from 'react'
import { Route, Redirect, withRouter, Switch } from "react-router-dom";
import Home from '../home/home';
import EditProfile from '../editProfile/editProfile';
import Searching from '../searching/searching';
import Profile from "../profile/profile";
import WritePost from "../writePost/writePost"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { runInThisContext } from 'vm';

class Router extends Component {

    rollnumberRegex = "([a-z]+\-[0-9]{5}\-2015)";

    // Higher Order Component for protecting routes

    AuthRoute = ({ component: Component, ...rest }) => (
        <Route {...rest} render={(props) => (
        this.props.auth.loggedIn === true
            ? <Component {...props} />
            : <Redirect to={{
                pathname: '/', //Change this link to login link
                state: { from: this.props.location }
            }} />
        )} />
    )
// <this.AuthRoute path="/addItem" component={Itemform} />
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <this.AuthRoute exact path = {`/writePost/:user${this.rollnumberRegex}`} component={WritePost} ></this.AuthRoute>
                    <Route exact path="/search" component={Searching} />
                    <this.AuthRoute path="/editProfile" component={EditProfile} ></this.AuthRoute>
                    <Route path={`/:user${this.rollnumberRegex}`} component={Profile} />
                    <Redirect to="/" />
                </Switch>
            </div>
        )
  }
}

Router.propTypes = {
    auth: PropTypes.object.isRequired
  }
  
  const mapStateToProps = (state) => ({
    auth: state.auth
  });

export default withRouter(connect(mapStateToProps, {})(Router));
