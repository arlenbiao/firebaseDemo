<template>
  <div class="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <div class="mdl-layout__content mdl-color--grey-100">
      <!--main start-->
      <div class="mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-grid">
        <!-- Container for the Table of content -->
        <div class="mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-desktop">
          <div class="mdl-card__supporting-text mdl-color-text--grey-600">
            <!-- div to display the generated Instance ID token -->
            <div v-show="tokenShow">
              <h4>Instance ID Token</h4>
              token :
              <p style="word-break: break-all;">{{token}}</p>
              <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" @click="deleteToken()">Delete Token</button>
            </div>
            <!-- div to display the UI to allow the request for permission to
                   notify the user. This is shown if the app has not yet been
                   granted permission to notify. -->
            <div v-show="permissionShow">
              <h4>Needs Permission</h4>
              <p>{{token}}</p>
              <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" type="button" @click="requestPermission">Request Permission</button>
            </div>
            <!-- div to display messages received by this app. -->
            <div id="messages" style="text-align: left"></div>
          </div>
        </div>
      </div>
    </div>
    <!--main end-->
  </div>
</template>

<script>
  export default {
    name: 'fcm',
    data() {
      return {
        tokenShow: false,
        permissionShow: false,
        messaging: null,
        token: ''
      }
    },
    created() {
    },
    mounted() {
      let _this = this;
      _this.messaging = _this.$messaging
      console.log('====================================');
      console.log(_this.$messaging);
      console.log('====================================');
      _this.resetUI()
      _this.messaging.onTokenRefresh(function() {
        _this.messaging.getToken().then(function(refreshedToken) {
          console.log('Token refreshed.');
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          _this.setTokenSentToServer(false);
          // Send Instance ID token to app server.
          _this.sendTokenToServer(refreshedToken);
          // [START_EXCLUDE]
          // Display new Instance ID token and clear UI of all previous messages.
          _this.resetUI();
          // [END_EXCLUDE]
        }).catch(function(err) {
          console.log('Unable to retrieve refreshed token ', err);
          _this.showToken('Unable to retrieve refreshed token ', err);
        });
      });
      // [END refresh_token]
      // [START receive_message]
      // Handle incoming messages. Called when:
      // - a message is received while the app has focus
      // - the user clicks on an app notification created by a service worker
      //   `messaging.setBackgroundMessageHandler` handler.
      _this.messaging.onMessage(function(payload) {
        console.log('Message received. ', payload);
        _this.appendMessage(payload);
      });
    },
    methods: {
      resetUI() {
        let _this = this;
        this.clearMessages();
        this.showToken('loading...');
        // [START get_token]
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        this.messaging.getToken().then(function(currentToken) {
          if (currentToken) {
            console.log('====================================');
            console.log(this);
            console.log('====================================');
            _this.sendTokenToServer(currentToken);
            _this.updateUIForPushEnabled(currentToken);
          } else {
            // Show permission request.
            console.log('No Instance ID token available. Request permission to generate one.');
            // Show permission UI.
            _this.updateUIForPushPermissionRequired();
            _this.setTokenSentToServer(false);
          }
        }).catch(function(err) {
          console.log('An error occurred while retrieving token. ', err);
          _this.showToken('Error retrieving Instance ID token. ', err);
          _this.setTokenSentToServer(false);
        });
        // [END get_token]
      },
      showToken(currentToken) {
        this.token = currentToken;
      },
      // Send the Instance ID token your application server, so that it can:
      // - send messages back to this app
      // - subscribe/unsubscribe the token from topics
      sendTokenToServer(currentToken) {
        let _this = this;
        if (!_this.isTokenSentToServer()) {
          console.log('Sending token to server...');
          // TODO(developer): Send the current token to your server.
          _this.setTokenSentToServer(true);
        } else {
          console.log('Token already sent to server so won\'t send it again ' +
            'unless it changes');
        }
      },
      isTokenSentToServer() {
        return window.localStorage.getItem('sentToServer') === '1';
      },
      setTokenSentToServer(sent) {
        window.localStorage.setItem('sentToServer', sent ? '1' : '0');
      },
      showHideDiv(divShow, show) {
        this[divShow] = show;
      },
      requestPermission() {
        let _this = this;
        console.log('Requesting permission...');
        // [START request_permission]
        this.messaging.requestPermission().then(function() {
          console.log('Notification permission granted.');
          // TODO(developer): Retrieve an Instance ID token for use with FCM.
          // [START_EXCLUDE]
          // In many cases once an app has been granted notification permission, it
          // should update its UI reflecting this.
          _this.resetUI();
          // [END_EXCLUDE]
        }).catch(function(err) {
          console.log('Unable to get permission to notify.', err);
        });
        // [END request_permission]
      },
      deleteToken() {
        // Delete Instance ID token.
        // [START delete_token]
        this.messaging.getToken().then(function(currentToken) {
          this.messaging.deleteToken(currentToken).then(function() {
            console.log('Token deleted.');
            this.setTokenSentToServer(false);
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            this.resetUI();
            // [END_EXCLUDE]
          }).catch(function(err) {
            console.log('Unable to delete token. ', err);
          });
          // [END delete_token]
        }).catch(function(err) {
          console.log('Error retrieving Instance ID token. ', err);
          showToken('Error retrieving Instance ID token. ', err);
        });
      },
      appendMessage(payload) {
        const messagesElement = document.querySelector('#messages');
        const dataHeaderELement = document.createElement('h5');
        const dataElement = document.createElement('pre');
        dataElement.style = 'overflow-x:hidden;';
        dataHeaderELement.textContent = 'Received message:';
        dataElement.textContent = JSON.stringify(payload, null, 2);
        messagesElement.appendChild(dataHeaderELement);
        messagesElement.appendChild(dataElement);
      },
      // Clear the messages element of all children.
      clearMessages() {
        const messagesElement = document.querySelector('#messages');
        while (messagesElement.hasChildNodes()) {
          messagesElement.removeChild(messagesElement.lastChild);
        }
      },
      updateUIForPushEnabled(currentToken) {
        this.showHideDiv('tokenShow', true);
        this.showHideDiv('permissionShow', false);
        this.showToken(currentToken);
      },
      updateUIForPushPermissionRequired() {
        this.showHideDiv('tokenShow', false);
        this.showHideDiv('permissionShow', true);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  main,
  #messages-card {
    height: 100%;
    padding-bottom: 0;
  }
  #messages-card-container {
    height: calc(100% - 35px);
    padding-bottom: 0;
  }
  #messages-card {
    margin-top: 15px;
  }
  .mdl-layout__header-row span {
    margin-left: 15px;
    margin-top: 17px;
  }
  .mdl-grid {
    max-width: 1024px;
    margin: auto;
  }
  .material-icons {
    font-size: 36px;
    top: 8px;
    position: relative;
  }
  .mdl-layout__header-row {
    padding: 0;
    margin: 0 auto;
  }
  .mdl-card__supporting-text {
    width: auto;
    height: 100%;
    padding-top: 0;
    padding-bottom: 0;
  }
  #messages {
    overflow-y: auto;
    margin-bottom: 10px;
    height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
  }
  #message-filler {
    flex-grow: 1;
  }
  .message-container:first-of-type {
    border-top-width: 0;
  }
  .message-container {
    display: block;
    margin-top: 10px;
    border-top: 1px solid #f3f3f3;
    padding-top: 10px;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }
  .message-container.visible {
    opacity: 1;
  }
  .message-container .pic {
    background-image: url('/images/profile_placeholder.png');
    background-repeat: no-repeat;
    width: 30px;
    height: 30px;
    background-size: 30px;
    border-radius: 20px;
  }
  .message-container .spacing {
    display: table-cell;
    vertical-align: top;
  }
  .message-container .message {
    display: table-cell;
    width: calc(100% - 40px);
    padding: 5px 0 5px 10px;
  }
  .message-container .name {
    display: inline-block;
    width: 100%;
    padding-left: 40px;
    color: #bbb;
    font-style: italic;
    font-size: 12px;
    box-sizing: border-box;
  }
  #message-form {
    display: flex;
    flex-direction: row;
    width: calc(100% - 48px);
    float: left;
  }
  #image-form {
    display: flex;
    flex-direction: row;
    width: 48px;
    float: right;
  }
  #message-form .mdl-textfield {
    width: calc(100% - 100px);
  }
  #message-form button,
  #image-form button {
    width: 100px;
    margin: 15px 0 0 10px;
  }
  .mdl-card {
    min-height: 0;
  }
  .mdl-card {
    background: linear-gradient(white, #f9f9f9);
    justify-content: space-between;
  }
  #user-container {
    position: absolute;
    display: flex;
    flex-direction: row;
    top: 22px;
    width: 100%;
    right: 0;
    padding-left: 10px;
    justify-content: flex-end;
    padding-right: 10px;
  }
  #user-container #user-pic {
    top: -3px;
    position: relative;
    display: inline-block;
    background-image: url('/images/profile_placeholder.png');
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-size: 40px;
    border-radius: 20px;
  }
  #user-container #user-name {
    font-size: 16px;
    line-height: 36px;
    padding-right: 10px;
    padding-left: 20px;
  }
  #image-form #submitImage {
    width: auto;
    padding: 0 6px 0 1px;
    min-width: 0;
  }
  #image-form #submitImage .material-icons {
    top: -1px;
  }
  .message img {
    max-width: 300px;
    max-height: 200px;
  }
  #mediaCapture {
    display: none;
  }
  @media screen and (max-width: 610px) {
    header {
      height: 113px;
      padding-bottom: 80px !important;
    }
    #user-container {
      top: 72px;
      background-color: rgb(3, 155, 229);
      height: 38px;
      padding-top: 3px;
      padding-right: 2px;
    }
    #user-container #user-pic {
      top: 2px;
      width: 33px;
      height: 33px;
      background-size: 33px;
    }
  }
  .mdl-textfield__label:after {
    background-color: #0288D1;
  }
  .mdl-textfield--floating-label.is-focused .mdl-textfield__label {
    color: #0288D1;
  }
  .mdl-button .material-icons {
    top: -1px;
    margin-right: 5px;
  }
</style>
