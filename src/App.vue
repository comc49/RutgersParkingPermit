<template>
  <div id="app" >
    <v-app class="red lighten-2">
      <transition name="fade">
        <router-view/>
      </transition>
    </v-app>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'App'
}
</script>

<style lang='scss'>
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .45s;
}

.fade-enter-active {
  transition-delay: .45s;
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
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
