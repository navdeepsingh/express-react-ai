import React, { Component } from 'react';
import Wrapper from './components/Wrapper';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepThree from './components/StepThree';
import Results from './components/Results';
import Modal from 'react-modal';
import Feed from './components/Feed';
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
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // Set initial state
    this.state = {
      showStepOne : true,
      showStepTwo : false,
      showStepThree : false,
      linkTwitter : false,
      linkFacebook : false,
      pullTwitter : false,
      pullFacebook : false,
      analyzed : true,
      progressValue: 0,
      progressHeight: 5,
      modalIsOpen: false,
      displayToast: false,
      twitterFeeds: ['Loading Twitter Feeds..'],
      facebookFeeds: ['Loading Facebook Feeds..'],
      toastMessage: props.toastMessage,
      toastTitle: props.toastTitle,
      toastTimeOut: props.toastTimeOut,

    }

    this.apiUrl= 'http://localhost:8080';
    this.progressHeight= 2;
  }

  componentDidMount() {
    this._progressBarLoading();
    this._checkAuthorization();

    //Animate Heading
    const heading = document.querySelector('.jump');
    heading.innerHTML = [...heading.textContent].map(letter => `<span>${letter}</span>`).join('');
  }

  _progressBarLoading() {
    this.interval = setInterval(() => {
      let progressValue = this.state.progressValue;

      if (progressValue === 100) {
      //  this.setState({progressValue: 0, progressHeight: 0});
        clearInterval(this.interval);
        return;
      }

      progressValue += 2;
      this.setState({progressValue: progressValue});

    }, 10);
  }

  _clearLoading() {
    //this.setState({progressValue: 100});
    this.setState({progressValue: 0});
    //clearInterval(this.interval);
  }


  _checkAuthorization() {
    const twToken = Util.getCookie(`twitterToken`);
    const fbToken = Util.getCookie(`facebookToken`);
    const token = `${twToken}|${fbToken}`;
    if (token && token !== '|') {
      axios.get(this.apiUrl + `/api/auth?token=${token}`)
        .then(res => {
            let twitterUser = res.data.twitterUser;
            let facebookUser = res.data.facebookUser;
            let twitterFeeds = res.data.twitterFeeds;
            let facebookFeeds = res.data.facebookFeeds;
            this.setState({pullTwitter: twitterFeeds, pullFacebook: facebookFeeds});

            // For Step One  ======================================
            if (twitterUser && typeof twitterUser === 'object' ) {
              this.setState({
                  linkTwitter : true,
                  showStepTwo: false,
                  displayToast : true,
                  toastMessage : `You connected successfully with Twitter account.`,
                  toastTitle: `Hello ${twitterUser.name}`
                });
            }
            if (facebookUser && typeof facebookUser === 'object') {
              this.setState({
                  linkFacebook : true,
                  displayToast : true,
                  showStepTwo: false,
                  toastMessage : `You connected successfully with Facebook account.`,
                  toastTitle: `Hello ${facebookUser.name}`
                });
            }
            // For Step Two  ======================================
            if (twitterUser && facebookUser && (!this.state.pullTwitter || !this.state.pullFacebook)) {
              this.setState({
                  showStepTwo: true,
                  displayToast : true,
                  toastMessage: `Awesome! Go Ahead with Step Two.`,
                  toastTitle: `Hey ${facebookUser.name}`,
                  toastTimeOut: 5000
                });
            }

            // For Step Three  ======================================
            if (this.state.pullTwitter && this.state.pullFacebook) {
              this.setState({
                  showStepTwo: true,
                  showStepThree: true,
                  displayToast : true,
                  toastMessage: `Yeaaaah! Go Ahead with Final Step Three.`,
                  toastTitle: `Hey ${facebookUser.name}`,
                });
            }
            // =====================================================
            // Display Toastr
            if (this.state.displayToast) {
              this.refs.container.success(this.state.toastMessage, this.state.toastTitle, {
                timeOut: this.state.toastTimeOut
              });
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
        self._checkAuthorization();
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
    let token = Util.getCookie(`twitterToken`);
    this._progressBarLoading();
    axios.get(this.apiUrl + '/auth/twitter/statuses/home_timeline?token=' + token)
      .then(res => {
        // Display Toastr
        this.refs.container.success(`Tweets Successfully Pulled`, '', {
          timeOut: this.state.toastTimeOut
        });

        // Set States
        this.setState({PullTwitter : true});
        this._checkAuthorization();
        this._clearLoading();
      });
  }

  handleFacebookPull = (e)=>{
    e.preventDefault();
    let token = Util.getCookie(`facebookToken`);
    this._progressBarLoading();
    axios.get(this.apiUrl + '/auth/facebook/feed?token=' + token)
      .then(res => {
        // Display Toastr
        this.refs.container.success(`Posts Successfully Pulled`, '', {
          timeOut: this.state.toastTimeOut
        });
        // Set States
        this.setState({PullFacebook : true});
        this._checkAuthorization();
        this._clearLoading();
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
        this.setState({twitterFeeds : res.data.twitterFeeds, facebookFeeds : res.data.facebookFeeds});
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleAnalyze = (e) => {
    e.preventDefault();
    const twToken = Util.getCookie(`twitterToken`);
    const fbToken = Util.getCookie(`facebookToken`);
    const token = `${twToken}|${fbToken}`;
    this._progressBarLoading();
    axios.get(this.apiUrl + '/api/analyze?token=' + token)
      .then(res => {
        // Display Toastr
        if (typeof res.data !== 'object') {
          this.refs.container.success(res.data, '', {
            timeOut: this.state.toastTimeOut
          });
          window.location = '/'
        } else {
          this.refs.container.success(`Analyzing Successfully Done`, '', {
            timeOut: this.state.toastTimeOut
          });
        }
        console.log(res);
        this._clearLoading();
      })
      .catch(err => {
        console.error(err);
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
            shouldCloseOnOverlayClick={true}
            contentLabel="Twitter and Facebook Data"
          >
            <h2 ref="subtitle">
              Twitter & Facebook Data
              <button className="btn btn-lg btn-primary pull-right" onClick={this.handleCloseModal}>close</button>
            </h2>
            <hr />
            <h3>Twitter Feeds : </h3>
            <pre>
            {
              [...this.state.twitterFeeds].length > 0 ?
              [...this.state.twitterFeeds].map((feed, i) => {
                return <Feed key={i} className="twitter-color" index={i+1} feed={feed.feed} dateAdded={feed.dateAdded}></Feed>
              })
              : 'No tweets collected Yet!'
            }
            </pre>
            <hr />
            <h3>Facebook Feeds : </h3>
            <pre>
            {
              [...this.state.facebookFeeds].length > 0 ?
              [...this.state.facebookFeeds].map((feed, i) => {
              return <Feed key={i} className="facebook-color" index={i+1} feed={feed.feed} dateAdded={feed.dateAdded}></Feed>
              })
              : 'No feed collected Yet!'
            }
            </pre>
            <button className="btn btn-lg btn-primary pull-right" onClick={this.handleCloseModal}>close</button>
          </Modal>

          <ToastContainer
           toastMessageFactory={ToastMessageFactory}
           ref="container"
           className="toast-top-right"
          />

          <Progress percent={this.state.progressValue} height={this.state.progressHeight} speed={.80}/>

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
                pullTwitter={this.state.pullTwitter}
                pullFacebook={this.state.pullFacebook}
              >
              </StepTwo>
            : null
          }
          { this.state.showStepThree ? <StepThree onClickAnalyze={this.handleAnalyze}></StepThree> : null }

          { this.state.analyzed ? <Results /> : null}
        </Wrapper>
      </div>
    );
  }
}

App.defaultProps = { toastMessage: '', toastTitle: '',  toastTimeOut: 3000 };

export default App;
