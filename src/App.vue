<template>
  <div id="app" >
    <v-app>
      <transition name="fade">
        <router-view/>
      </transition>
    </v-app>
  </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions({
      closeWebSocket: 'session/closeWebSocket',
    })
  },
  beforeDestroy() {
    this.closeWebSocket();
  }
}
</script>

<style lang='scss'>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .65s;
}

.fade-enter-active {
  transition-delay: .65s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}

body {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  margin: 0;
}
#app {
  top: 0;
  background-color: #E1E1DF;
  position: absolute;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
