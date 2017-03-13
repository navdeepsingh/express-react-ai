import React from 'react';
import { Panel } from 'react-bootstrap';
import facebookLogo from '../assets/F_icon.svg';
import twitterLogo from '../assets/Twitter_Logo_Blue.svg';

// Stateless Function Component
const stepOne = (props) => {

  return (
        <Panel header="Step One : Link with twitter and FB account">
          <div className="row">
            <div className="col-md-6">
              <a href="#" onClick={props.onClickTwitterLink}><img src={twitterLogo} width="50" height="50" alt="Twitter" /></a>
              <a href="#" onClick={props.onClickFacebookLink}><img src={facebookLogo} width="30" height="30" alt="Facebook" /></a>
            </div>
            <div className="col-md-6">
              Status:<br />
              { props.stepOneStatus === 'Linked'
                ? <p>Connected to Twitter <span className="glyphicon glyphicon-ok" aria-hidden="true"></span></p>
                : props.stepOneStatus
              }
            </div>
          </div>
        </Panel>
      )
}

module.exports = stepOne;
