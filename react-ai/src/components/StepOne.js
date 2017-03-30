import React from 'react';
import { Panel, Row, Col } from 'react-bootstrap';
import facebookLogo from '../assets/F_icon.svg';
import twitterLogo from '../assets/Twitter_Logo_Blue.svg';

// Stateless Function Component
const stepOne = (props) => {

  return (
        <Panel className="stepOne" header="Step One : Link with twitter and FB account">
          <Row>
            <Col md={12}>
              <Row>
                <Col md={2} sm={1} xs={2}>
                  <a href="#" onClick={props.onClickTwitterLink}><img src={twitterLogo} width="50" height="50" alt="Twitter" /></a>
                </Col>
                <Col md={10} sm={11} xs={10} className="linkedStatus">
                    {
                      props.linkTwitter
                      ? `👍 Connected with Twitter`
                      : <a href="#" onClick={props.onClickTwitterLink}>Authourise with Twitter</a>
                    }
                </Col>
              </Row>
              <Row>
                <Col md={2} sm={1} xs={2}>
                  <a href="#" onClick={props.onClickFacebookLink}><img src={facebookLogo} width="50" height="50" alt="Facebook" /></a>
                </Col>
                <Col md={10} sm={11} xs={10} className="linkedStatus">
                {
                  props.linkFacebook
                  ? `👍 Connected with Facebook`
                  : <a href="#" onClick={props.onClickFacebookLink}>Authourise with Facebook</a>
                }
                </Col>
              </Row>
            </Col>
          </Row>
        </Panel>
      )
}

module.exports = stepOne;
