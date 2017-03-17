import React, { Component } from 'react';
import App from '../App';

// Stateless Function Component
class Auth extends Component {
  constructor() {
    super();
    this._afterAuth.bind(this)
  }

  _afterAuth() {
    window.close();
  }
}

module.exports = Auth;
