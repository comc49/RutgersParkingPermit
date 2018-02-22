import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  // combine sub modules
    state: {
        token: '',
        uid: null,
        userInfo: null,
        webSocket: null,
        userFormData: null,
        key: null,
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
            state.userFormData = {...userFormData} ;
        },
        'session/webSocket' : function(state, webSocket) {
            state.webSocket = webSocket ;
        },
        'session/closeWebSocket' : function(state) {
            if (state.webSocket) {
                state.webSocket.close();
            }
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
        'session/webSocket' (state) {
            return state.webSocket;
        },
    },
    actions:  {
        'session/SetToken' ({commit}, token) {
            commit('session/token', token);
        },
        'session/SetUID' ({commit}, uid) {
            commit('session/uid', uid);
        },
        'session/SetUserInfo' ({commit}, userInfo) {
            commit('session/userInfo', userInfo);
        },
        'session/SetUserFormData' ({commit}, userFormData) {
            commit('session/userFormData', userFormData);
        },
        'session/SetWebSocket' ({commit}, webSocket) {
            commit('session/webSocket', webSocket);
        },
        'session/closeWebSocket' ({commit}) {
            commit('session/closeWebSocket');
        },
    },
});

export default store;
