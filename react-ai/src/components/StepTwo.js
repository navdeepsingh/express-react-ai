import React from 'react';
import { Panel } from 'react-bootstrap';

// Stateless Function Component
const stepTwo = (props) => {

  return (
        <Panel className="stepTwo" header="Step Two : Pull feed from twitter and FB account">
          <a href="#" onClick={props.onClickTwitterPull}>Pull from Twitter Account</a><br />
          <a href="#" onClick={props.onClickFacebookPull}>Pull from Facebook Account</a>
          <div>
            <hr />
            <button className="btn btn-primary" onClick={props.onClickViewFeeds}>Sneak into Database</button>
          </div>
        </Panel>
      )
}

module.exports = stepTwo;
