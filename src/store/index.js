import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  // combine sub modules
    state: {
        token: ''
    },
    mutations: {
        'session/token' : function(state, token) {
        state.token = token;
        },
    },
    getters:  {
        'session/token' (state) {
        return state.token;
        },
    },
    actions:  {
        'session/SetToken' ({commit}, token) {
            console.log('token',token)
        commit('session/token', token);
        },
        'test'  ({commit},t) {
            console.log(t,'t')

        },
    },
});

export default store;
