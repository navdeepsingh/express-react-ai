import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import Modal from 'react-modal';
import modalStyles from './assets/css/modal-styles';
import axios from 'axios';
import Util from './utils';
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
    this.handleViewFeeds = this.handleViewFeeds.bind(this);
    /*this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);*/
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // Set initial state
    this.state = {
      showStepOne : true,
      showStepTwo : false,
      showStepThree : false,
      linkTwitter : false,
      linkFacebook : false,
      progressValue: 0,
      modalIsOpen: false,
      twitterFeeds: ['Loading Twitter Feeds..'],
      facebookFeeds: ['Loading Facebook Feeds..']
    }

    this.apiUrl = 'http://localhost:8080'
  }

  componentDidMount() {
    this._checkAuthorization('twitter');
    this._checkAuthorization('facebook');
  }

  _checkAuthorization(handle) {
    let token = Util.getCookie(`${handle}Token`);
    if (token) {
      axios.get(this.apiUrl + `/auth/${handle}/jwt?token=${token}`)
        .then(res => {
            let user = res.data.user;

            // Display Toastr
            this.refs.container.success(`You Connected Successfully with ${Util.capitalizeFirstLetter(handle)} Account`, `Hello ${user.name}`, {
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
    this.setState({progressValue : 0});
    let token = Util.getCookie(`twitterToken`);
    axios.get(this.apiUrl + '/auth/twitter/statuses/home_timeline?token=' + token)
      .then(res => {
        // Display Toastr
        this.refs.container.success(`Tweets Successfully Pulled`, '', {
          timeOut: 30000,
          extendedTimeOut: 10000
        })

        // Set States
        let states = {progressValue : 100};
        this.setState(states);
      });
  }

  handleFacebookPull = (e)=>{
    e.preventDefault();
    this.setState({progressValue : 0});
    let token = Util.getCookie(`facebookToken`);
    axios.get(this.apiUrl + '/auth/facebook/feed?token=' + token)
      .then(res => {
        // Display Toastr
        this.refs.container.success(`Posts Successfully Pulled`, '', {
          timeOut: 30000,
          extendedTimeOut: 10000
        })

        // Set States
        let states = {progressValue : 100};
        this.setState(states);
        console.log(res);
      });
  }

  handleViewFeeds = (e) => {
    e.preventDefault();
    this.setState({modalIsOpen: true});
    const twToken = Util.getCookie(`twitterToken`);
    const fbToken = Util.getCookie(`facebookToken`);
    const token = `${twToken}|${fbToken}`;
    axios.get(this.apiUrl + '/api/view-feeds?token=' + token)
      .then(res => {
        //let resJson = JSON.stringify(res);
        this.setState({twitterFeeds : res.data.twitterFeeds, facebookFeeds : res.data.facebookFeeds});
      });

  }

  handleCloseModal() {
    this.setState({modalIsOpen: false});
  }

  render() {

    return (
      <div>
        <Wrapper>

          <Modal
            isOpen={this.state.modalIsOpen}
            style={modalStyles}
            contentLabel="Twiiter and Facebook Data"
          >

            <h2 ref="subtitle">Twiiter and Facebook Data</h2>
            <hr />
            <h3>Twitter Feeds : </h3>
            <pre>
            {[...this.state.twitterFeeds].map((feed, i) => {
              return <div>{i + 1} : {feed.feed}</div>
            })}
            </pre>
            <hr />
            <h3>Facebook Feeds : </h3>
            <pre>
            {[...this.state.facebookFeeds].map((feed, i) => {
              return <div>{i + 1} : {feed.feed}</div>
            })}
            </pre>
            <button onClick={this.handleCloseModal}>close</button>
          </Modal>

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
                onClickViewFeeds={this.handleViewFeeds}
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
