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
      stepOneStatus : 'Yet to Start'
    }

    this.apiUrl = 'http://localhost:8080/'
  }

  componentDidMount() {
    let token = this.getCook('token');
    console.log(token);
    //axios.defaults.headers.common['Authorization'] = token;
    axios.get(this.apiUrl + `auth/twitter/jwt?token=${token}`)
      .then(res => {
          if (res.data.valid) {
            this.setState({stepOneStatus : 'Linked'})
          }
          console.log(JSON.stringify(res.data));
      })
      .catch(err => {
        console.error(err);
      })
  }

  handleTwitterLink = (e)=>{
    e.preventDefault();
    window.location = this.apiUrl + 'auth/twitter';
  }

  getCook(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring=RegExp(""+cookiename+"[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return unescape(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
  }

  render() {

    return (
      <div>
        <Wrapper>
          { this.state.showStepOne
            ? <StepOne onClickTwitterLink={this.handleTwitterLink} stepOneStatus={this.state.stepOneStatus}></StepOne>
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
