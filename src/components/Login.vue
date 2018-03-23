<template>
  <v-layout mt-5>
    <v-flex xs6 offset-xs3 mt-5>
    <v-card>
      <div id="login">
        <h1>GPNJ RUTGERS</h1>
        <v-btn id="sign-in-button" color="success" class="sign-in-button" large @click="login">
          <svg id='logo' width="40" height="40" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
          </svg>
          SIGN IN WITH GPMAIL
        </v-btn>
      </div>
    </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from 'firebase';
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
  /*
  data() {

  },
  */
  methods: {
    ...mapActions({
        setToken: 'session/SetToken',
        setUID: 'session/SetUID',
        setUserInfo: 'session/SetUserInfo',
    }),
    login() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((res) => {
        //this.$router.push('homePage');
        this.setToken(res.credential.accessToken);
        this.setUID(res.user.uid);
        this.setUserInfo(res.user);
        //axios.defaults.headers['Authorization'] = `Bearer ${res.credential.accessToken}`;
        this.$router.replace('/');
      })
    }
  }
}
</script>

<style lang='scss'>
#login {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 5rem;
    h1 {
      font-size: 5rem;
      color: black;
    }
    #logo {
        margin-right: 1rem;
        fill: white;
    }
    button {
      font-weight: 900;
      color: white;
      font-size: 1.5rem;
      margin-bottom: 8rem;
    }
    #sign-in-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 400px;
        height: 5rem;
    }
}
</style>
