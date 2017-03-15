import React, { Component } from 'react';
import App from '../App';

// Stateless Function Component
class AfterAuth extends Component {
  constructor(){
    super();
    window.close();
  }

  loginCallBack() {
    App.checkAuthorization();
  }

  render() {
  return (
        <div>
            <h2>Authourizing..</h2>
        </div>
      )
    }
}

module.exports = AfterAuth;
