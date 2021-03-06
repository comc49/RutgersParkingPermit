// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueFire from 'vuefire';
import firebase from 'firebase';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import axios from 'axios';
import Vuex from 'vuex';
import store from './store/index';
import ReconnectingWebSocket from 'reconnecting-websocket';

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(Vuetify, {
  theme: {
    primary: '#cc0033',
    secondary: '#B4C4D9',
    accent: '#FFFFFF',
    error: '#0B0D0A',
    info: '#C05858',
    success: '#cc0033',
    warning: '#0B0D0A'
  },
  options: {
    themeVariations: ['primary', 'secondary']
  }
})
Vue.use(Vuex)
axios.defaults.baseURL = window.location.protocol == "https:" ?  '/': process.env.API;
Vue.http = axios;
Vue.prototype.$http = axios;

let wsURL = window.location.protocol === "https:" ?
  `wss://${window.location.host}`:
    process.env.API.replace('http','ws');
  
let webSocket = new ReconnectingWebSocket(
  wsURL,
  null,
  {
    debug: window.location.protocol == "http" ? true: false,
    reconnectInterval: 3000
  }
);

store.dispatch('session/SetWebSocket', webSocket);


const config = {
  apiKey: 'AIzaSyD2OtZb77QTn-STDL0RXxSTqJtF5q07IOo',
  authDomain: 'rutgersparkingpermit.firebaseapp.com',
  databaseURL: 'https://rutgersparkingpermit.firebaseio.com',
  projectId: 'rutgersparkingpermit',
  storageBucket: 'rutgersparkingpermit.appspot.com',
  messagingSenderId: '1055963578231'
}
firebase.initializeApp(config)

/*
let token = localStorage.getItem('token');
let uid = localStorage.getItem('uid');
*/

let token;
let uid;

if (token) {
  store.dispatch('session/SetToken',token);
}
if (uid) {
  store.dispatch('session/SetUID',uid);
}
router.beforeEach((to,from,next) => {
  if (!store.getters['session/uid']) {
    if (to.path !== '/login') {
      next('/login');
    } else {
      next();
    }
  }
  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
