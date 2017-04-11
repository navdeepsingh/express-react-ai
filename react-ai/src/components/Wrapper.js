import React from 'react';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';

// Stateless Function Component
const Wrapper = (props) => {

  return (
        <div className="container-fluid">
          <Jumbotron>
              <h1 className="jump">Express, React, MongoDB - AlchemyAPI</h1>
              <p>This app will let you connect with twitter and facebook and then can fetch posts/tweets.  After that symantic analysis of each feed will done. </p>
          </Jumbotron>

            <Row>
              <Col md={6} mdOffset={3}>
                {props.children}
              </Col>
            </Row>

        </div>
      )
}

module.exports = Wrapper;
