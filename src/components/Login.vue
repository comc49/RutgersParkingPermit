
<template>
  <div id="login">
    <a id="sign-in-button" class="button sign-in-button" @click="login">
      <svg id='logo' width="40" height="40" viewBox="0 0 24 24">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
      </svg>
      SIGN IN WITH GPMAIL
    </a>
  </div>
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
    }),
    login() {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).then((res) => {
        console.log(res)
        //this.$router.push('homePage');
        this.setToken(res.credential.accessToken);
        this.setUID(res.user.uid);
        //axios.defaults.headers['Authorization'] = `Bearer ${res.credential.accessToken}`;
        console.log(axios.defaults.headers,'axios')
        this.$router.replace('/form');
      })
    }
  }
}
</script>

<style lang='scss'>
#login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    #logo {
        margin-right: 1rem;
    }
    #sign-in-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 600px;
        border: 2px solid;
        padding: 15px;
        font-size: 3rem;
    }
}
</style>
