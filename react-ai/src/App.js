import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import axios from 'axios';
import Progress from 'react-progress';
import { ToastContainer, ToastMessage } from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class App extends Component {

  constructor(props){
    // Pass props to parent class
    super(props);
    this.handleTwitterLink = this.handleTwitterLink.bind(this);
    this.handleFacebookLink = this.handleFacebookLink.bind(this);
    this.handleTwitterPull = this.handleTwitterPull.bind(this);
    this.handleFacebookPull = this.handleFacebookPull.bind(this);
    // Set initial state
    this.state = {
      showStepOne : true,
      showStepTwo : false,
      showStepThree : false,
      linkTwitter : false,
      linkFacebook : false,
      progressValue: 0
    }

    String.prototype.capitalizeFirstLetter = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    this.apiUrl = 'http://localhost:8080'
  }

  componentDidMount() {
    this._checkAuthorization('twitter');
    this._checkAuthorization('facebook');
  }

  _checkAuthorization(handle) {
    let token = this.getCook(`${handle}Token`);
    if (token) {
      axios.get(this.apiUrl + `/auth/${handle}/jwt?token=${token}`)
        .then(res => {
            let user = res.data.user;

            // Display Toastr
            this.refs.container.success(`You Connected Successfully with ${handle.capitalizeFirstLetter()} Account`, `Hello ${user.name}`, {
              timeOut: 30000,
              extendedTimeOut: 10000
            })

            // Set States
            let states = {progressValue : 100};
            if (handle === 'twitter')
              states.linkTwitter = true;
            else
              states.linkFacebook = true;
            this.setState(states);

            // If both Twitter and Facebook Account Linked Show Step Two
            if ( this.state.linkTwitter && this.state.linkFacebook ) {
              this.setState({showStepTwo : true});
            }

        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  _authPopup(handle) {
    var self = this,
        params = 'location=0,status=0,width=600,height=400';
    const authUrl = `${this.apiUrl}/auth/${handle}`;

    this.popup_window = window.open(authUrl, 'popupWindow', params);

    this.interval = window.setInterval((function() {
      if (self.popup_window.closed) {
        window.clearInterval(self.interval);
        self._checkAuthorization(handle);
      }
    }), 1000);
  }

  handleTwitterLink = (e)=>{
    e.preventDefault();
    if (!this.state.linkTwitter)
      this._authPopup('twitter');
  }

  handleFacebookLink = (e)=>{
    e.preventDefault();
    if (!this.state.linkFacebook)
      this._authPopup('facebook');
  }

  handleTwitterPull = (e)=>{
    e.preventDefault();
    let token = this.getCook(`twitterToken`);
    axios.get(this.apiUrl + '/auth/twitter/statuses/home_timeline?token=' + token)
      .then(res => {
        console.log(res);
      })
    /*let token = this.getCook(`twitterToken`);
    if (token) {
      axios.get(this.apiUrl + `/auth/twitter/jwt?token=${token}`)
        .then(res => {
            let user = res.data.user;
          });
    }*/
  }

  handleFacebookPull = (e)=>{
    e.preventDefault();
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
          <ToastContainer
           toastMessageFactory={ToastMessageFactory}
           ref="container"
           className="toast-top-right"
          />
          <Progress percent={this.state.progressValue} speed={.60}/>
          { this.state.showStepOne
            ? <StepOne
                onClickTwitterLink={this.handleTwitterLink}
                onClickFacebookLink={this.handleFacebookLink}
                linkTwitter={this.state.linkTwitter}
                linkFacebook={this.state.linkFacebook}
              >
              </StepOne>
            : null
          }
          { this.state.showStepTwo
            ? <StepTwo
                onClickTwitterPull={this.handleTwitterPull}
                onClickFacebookPull={this.handleFacebookPull}
              >
              </StepTwo>
            : null
          }
          { this.state.showStepThree ? <StepThree></StepThree> : null }
        </Wrapper>
      </div>
    );
  }
}



export default App;
