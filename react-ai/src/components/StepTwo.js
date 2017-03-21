import React from 'react';
import { Panel } from 'react-bootstrap';

// Stateless Function Component
const stepTwo = (props) => {

  return (
        <Panel className="stepTwo" header="Step Two : Pull feed from twitter and FB account">
          <a href="#" onClick={props.onClickTwitterPull}>Pull from Twitter Account</a><br />
          <a href="#" onClick={props.onClickFacebookPull}>Pull from Facebook Account</a>
        </Panel>
      )
}

module.exports = stepTwo;
