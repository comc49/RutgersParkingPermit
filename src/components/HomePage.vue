<template>
    <div id="home-page" class="red lighten-2">
        <section id="welcome">
            <h1>Welcome {{userInfo ? userInfo.displayName: ''}} to Rutgers Parking Permit Purchaser! </h1>
            <v-btn color="success" @click="$router.push('/form')">Enter/Update Address</v-btn>
            <v-btn
                color="success"
                :loading="loading"
                @click="loader"
                :disabled="loading"
            >
                Buy a Guest Permit
            </v-btn>
        </section>
    </div>
</template>

<script>
import firebase from 'firebase'
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        loader() {
            this.loading = !this.loading;
            console.log(this.loading,'loading')
            setTimeout(() => (this.loading = false), 3000)
        },
    },
  computed: {
      ...mapGetters({
          userInfo: 'session/userInfo',
      })
  },
}
</script>

<style lang='scss'>
    #home-page {
        color: white;
        #welcome {
            padding-top: 10rem;
            h1 {
                padding: 2rem;
                color: black;
            }
            button {
                font-weight: 530;
                color: white;
                font-size: 1rem;
            }
        }
        width: 100%;
        height: 100%;
    }
</style>
