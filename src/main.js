// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/messaging'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://openfood.test/api'
Vue.prototype.$axios = axios


//fcm初始化(rider)
/*let config = {
  apiKey: "AIzaSyAtvojnZHL4OydyRT6SNOMr32BxUeyziEk",
  authDomain: "openfood-rider-app-android.firebaseapp.com",
  databaseURL: "https://openfood-rider-app-android.firebaseio.com",
  projectId: "openfood-rider-app-android",
  storageBucket: "openfood-rider-app-android.appspot.com",
  messagingSenderId: "958747888222"
}
firebase.initializeApp(config)
Vue.prototype.$messaging = firebase.messaging()
Vue.prototype.$messaging.usePublicVapidKey('BOUm-cinovAH_F92r2WwfxgK0pgnmULCyQa8hmz7fEwpw9wFEeq-u5Ok-61WwrosF12fIPXVdZ1YxBqTiMBq7d0')*/


//pos端初始化
/*let config = {
  apiKey: "AIzaSyAtA5EvAwlBCaIq6vRUrRl7S1LEnfdH9E8",
  authDomain: "openfood-pos-app-android.firebaseapp.com",
  databaseURL: "https://openfood-pos-app-android.firebaseio.com",
  projectId: "openfood-pos-app-android",
  storageBucket: "openfood-pos-app-android.appspot.com",
  messagingSenderId: "162037152035"
}*/

//平台端配置
let config = {
    apiKey: "AIzaSyDW_klhsX-nGR_R661LNgSu69XUCEMpEaw",
    authDomain: "openfood-platform.firebaseapp.com",
    databaseURL: "https://openfood-platform.firebaseio.com",
    projectId: "openfood-platform",
    storageBucket: "openfood-platform.appspot.com",
    messagingSenderId: "673849500972"
}

firebase.initializeApp(config)
Vue.prototype.$messaging = firebase.messaging()
Vue.prototype.$messaging.usePublicVapidKey('BGBZrkh6N38O8fxVgeIbkWUexJMY5LU0NKdEppIYpynx2rj_a2XjnSZ4JwD6XvT-KjESITBO40yCSTmhBUt1ycw')

console.log('====================================');
console.log(navigator);
console.log('====================================');
navigator.serviceWorker.register('/static/firebase-messaging-sw.js')
  .then((registration) => {
    Vue.prototype.$messaging.useServiceWorker(registration)
  }).catch(err => {
  console.log(err)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
