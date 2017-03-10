import React from 'react';
import { Panel } from 'react-bootstrap';

// Stateless Function Component
const stepTwo = (props) => {

  return (
        <Panel header="Step Two : Pull feed from twitter and FB account">
          <a href="#">Pull from Twitter Account</a><br />
          <a href="#">Pull from Facebook Account</a>
        </Panel>
      )
}

module.exports = stepTwo;
