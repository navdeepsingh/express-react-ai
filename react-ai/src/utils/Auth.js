import React, { Component } from 'react';
import App from '../App';

// Stateless Function Component
class Auth extends Component {
  constructor() {
    super();
    console.log('I am from Auth Component');
    this._afterAuth.bind(this)
  }

  _afterAuth() {
    if (window.opener) {
        window.opener.focus();

      if(window.opener.loginCallBack) {
        window.opener.loginCallBack();
      }
    }
    window.close();
  }

  loginCallBack() {
    App.checkAuthorization();
  }
}

module.exports = Auth;
