import React from 'react';
import { Grid, Row, Col, Navbar, Jumbotron } from 'react-bootstrap';

// Stateless Function Component
const Wrapper = (props) => {

  return (
        <div>
          <Navbar inverse fixedTop>
            <Grid>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">React App</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
            </Grid>
          </Navbar>
          <Jumbotron>
            <Grid>
              <h1>React - AlchemyAPI</h1>
            </Grid>
          </Jumbotron>
          <Row>
            <Col md={4} mdOffset={4}>
              {props.children}
            </Col>
          </Row>
        </div>
      )
}

module.exports = Wrapper;
