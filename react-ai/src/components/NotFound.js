import React, { Component } from 'react';
import Wrapper from './Wrapper';

// Stateless Function Component
class NotFound extends Component {
  render() {
  return (
        <div>
          <Wrapper>
            <h2>404 - Page Not Found</h2>
          </Wrapper>
        </div>
      )
    }
}

module.exports = NotFound;
