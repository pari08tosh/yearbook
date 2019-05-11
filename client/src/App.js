import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import store from './store';
import Router from './components/router/router';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const options = {
  position: 'top right',
  timeout: 3000,
  offset: '50px',
  transition: 'fade',
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...options}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AlertProvider>
      </Provider>
    );
  }
}

export default App;
