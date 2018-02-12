import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  // combine sub modules
    state: {
        token: '',
        uid: null,
    },
    mutations: {
        'session/token' : function(state, token) {
        state.token = token;
        },
        'session/uid' : function(state, uid) {
        state.uid = uid;
        },
    },
    getters:  {
        'session/token' (state) {
        return state.token;
        },
        'session/uid' (state) {
        return state.uid;
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
    },
});

export default store;
