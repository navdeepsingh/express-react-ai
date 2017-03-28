import React from 'react';

// Stateless Function Component
const Feed = (props) => {

    return (
        <pre className={props.className}>
          <strong>{props.index}.</strong>&nbsp;
          {props.feed}<br />
          <small>{props.dateAdded}</small>
        </pre>
      )
}

module.exports = Feed;
