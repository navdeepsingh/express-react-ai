import React from 'react';
import { Panel } from 'react-bootstrap';
import facebookLogo from '../assets/F_icon.svg';
import twitterLogo from '../assets/Twitter_Logo_Blue.svg';

// Stateless Function Component
const stepOne = (props) => {

  return (
        <Panel header="Step One : Link with twitter and FB account">
          <a href="#" onClick={props.onClickTwitterLink}><img src={twitterLogo} width="50" height="50" alt="Twitter" /></a>
          <a href="#" onClick={props.onClickFacebookLink}><img src={facebookLogo} width="30" height="30" alt="Facebook" /></a>
        </Panel>
      )
}

module.exports = stepOne;
