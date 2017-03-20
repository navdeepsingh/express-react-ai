import React from 'react';
import { Panel } from 'react-bootstrap';
import facebookLogo from '../assets/F_icon.svg';
import twitterLogo from '../assets/Twitter_Logo_Blue.svg';

// Stateless Function Component
const stepOne = (props) => {

  return (
        <Panel header="Step One : Link with twitter and FB account">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-2"><a href="#" onClick={props.onClickTwitterLink}><img src={twitterLogo} width="50" height="50" alt="Twitter" /></a></div>
                <div className="col-md-10">
                {
                  props.linkTwitter
                  ? `Connected with Twitter`
                  : `Authourise with Twitter`
                }
                </div>
              </div>
              <div className="row">
                <div className="col-md-2"><a href="#" onClick={props.onClickFacebookLink}><img src={facebookLogo} width="50" height="50" alt="Facebook" /></a></div>
                <div className="col-md-10">
                {
                  props.linkFacebook
                  ? `Connected with Facebook`
                  : `Authourise with Facebook`
                }
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )
}

module.exports = stepOne;
