import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  // combine sub modules
    state: {
        token: '',
        uid: null,
        userInfo: null,
    },
    mutations: {
        'session/token' : function(state, token) {
            state.token = token;
            localStorage.setItem('token',token);
        },
        'session/uid' : function(state, uid) {
            state.uid = uid;
            localStorage.setItem('uid', uid);
        },
        'session/userInfo' : function(state, userInfo) {
            state.userInfo = userInfo;
        },
        'session/userFormData' : function(state, userFormData) {
            state.userFormData = userFormData ;
        },
    },
    getters:  {
        'session/token' (state) {
            return state.token;
        },
        'session/uid' (state) {
            return state.uid;
        },
        'session/userInfo' (state) {
            return state.userInfo;
        },
        'session/userFormData' (state) {
            return state.userFormData;
        },
    },
    actions:  {
        'session/SetToken' ({commit}, token) {
            console.log('token',token)
            commit('session/token', token);
        },
        'session/SetUID' ({commit}, uid) {
            console.log('uid',uid)
            commit('session/uid', uid);
        },
        'session/SetUserInfo' ({commit}, userInfo) {
            console.log('userInfo',userInfo)
            commit('session/userInfo', userInfo);
        },
        'session/SetUserFormData' ({commit}, userFormData) {
            console.log('userFormData',userFormData)
            commit('session/userFormData', userFormData);
        },
    },
});

export default store;
