import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import axios from 'axios';

class App extends Component {

  constructor(props){
    // Pass props to parent class
    super(props);
    this.handleTwitterLink = this.handleTwitterLink.bind(this);
    // Set initial state
    this.state = {
      showStepOne : true,
      showStepTwo : false,
      showStepThree : false,
      showAuthLogin : true,
    }

    this.apiUrl = 'http://localhost:8080/'
  }

  componentDidMount() {
    axios.get(this.apiUrl + `auth/twitter/jwt`)
      .then((res) => {
        console.log(res.headers.get('Authorization'));
      })
      .catch((err) => {
        console.error(err);
      })
  }

  handleTwitterLink = (e)=>{
    e.preventDefault();
    window.location = this.apiUrl + 'auth/twitter';
  }

  render() {

    return (
      <div>
        <Wrapper>
          { this.state.showStepOne
            ? <StepOne onClickTwitterLink={this.handleTwitterLink}></StepOne>
            : null
          }
          { this.state.showStepTwo ? <StepTwo></StepTwo> : null }
          { this.state.showStepThree ? <StepThree></StepThree> : null }
        </Wrapper>
      </div>
    );
  }
}

export default App;
