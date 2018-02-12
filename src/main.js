// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import firebase from 'firebase'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import Vuex from 'vuex'
import store from './store/index';

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(Vuetify)
Vue.use(Vuex)
Vue.http = axios;
Vue.prototype.$http = axios;

const config = {
  apiKey: 'AIzaSyD2OtZb77QTn-STDL0RXxSTqJtF5q07IOo',
  authDomain: 'rutgersparkingpermit.firebaseapp.com',
  databaseURL: 'https://rutgersparkingpermit.firebaseio.com',
  projectId: 'rutgersparkingpermit',
  storageBucket: 'rutgersparkingpermit.appspot.com',
  messagingSenderId: '1055963578231'
}
firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
