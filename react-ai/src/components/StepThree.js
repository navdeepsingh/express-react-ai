import React from 'react';
import { Panel } from 'react-bootstrap';

// Stateless Function Component
const stepTwo = (props) => {

  return (
        <Panel className="stepThree" header="Step Three : Analyzing Sentences">
          <a href="#" onClick={props.onClickAnalyze}>Initiate Analyzing</a>
        </Panel>
      )
}

module.exports = stepTwo;
