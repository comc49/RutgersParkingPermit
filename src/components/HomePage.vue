<template>
    <div id="home-page" class="red lighten-2">
        <section id="welcome">
                <v-layout row wrap>
                <v-flex xs1>
                </v-flex>
                <v-flex xs10>
                    <h1  class="display-2">Welcome {{userInfo ? userInfo.displayName: ''}} to Rutgers Parking Permit Purchaser! </h1>
                </v-flex>
                <v-flex xs1>
                </v-flex>
                </v-layout>
            </v-flex>
            <v-btn class="headline" color="success" large @click="$router.push('/form')">Enter/Update Address</v-btn>
            <v-btn
                class="headline"
                color="success"
                :loading="loading"
                @click="buyPermit"
                :disabled="loading"
                large
            >
                Buy a Guest Permit
            </v-btn>
        </section>
    </div>
</template>

<script>
import firebase from 'firebase'
import CryptoJS from 'crypto-js';
import { mapGetters, mapActions } from 'vuex';

export default {
    data() {
        return {
            loading: false,
            userFormDataAvailable: false,
            key: null,
            carPlate: 'k53jcx',
            lot: 'livi',
        }
    },
    mounted() {
        let addressRef = firebase.database().ref(`users/${this.uid}/addressData`);
        if (addressRef) {
            addressRef.once('value').then((snapshot) => {
                let data = snapshot.val();
                this.userFormDataAvailable = true;
                console.log("setting the dang mapsetter ",data)

                this.setUserFormData(data);
                this.$nextTick(() => {
                    console.log('syupsdufpsdf',this.userFormData);
                })
            });
        }
        this.$http.post('/key').then((res) => {
            this.key = res.data;
        })
    },
    methods: {
        ...mapActions({
            setUserFormData: 'session/SetUserFormData',
        }),
        buyPermit() {
            this.loading = !this.loading;
            if (this.userFormDataAvailable) {
                let bytesCC  = CryptoJS.AES.decrypt(this.userFormData.visaCC.toString(), this.key);
                let bytesCCCVV2  = CryptoJS.AES.decrypt(this.userFormData.visaCCCVV2.toString(), this.key);
                let bytesRutgersPassword  = CryptoJS.AES.decrypt(this.userFormData.rutgersPassword.toString(), this.key);
                let body = {
                    ...this.userFormData,
                    visaCC: bytesCC.toString(CryptoJS.enc.Utf8),
                    visaCCCVV2: bytesCCCVV2.toString(CryptoJS.enc.Utf8),
                    rutgersPassword: bytesRutgersPassword.toString(CryptoJS.enc.Utf8),
                    carPlate: this.carPlate,
                    lot: this.lot,
                }
                this.$http.post('/buyPermit', body).then((res) => {
                    this.loading = false;
                    console.log(res,'res from buying permit');
                })
            }
        },
    },
  computed: {
      ...mapGetters({
          userInfo: 'session/userInfo',
          userFormData: 'session/userFormData',
          uid: 'session/uid',
      }),
  },
}
</script>

<style lang='scss'>
    #home-page {
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
        color: white;
        #welcome {
            width: 100%;
            height: 100%;
            padding-top: 8rem;
            h1 {
                padding: 4rem;
                font-weight: 800;
                color: black;
            }
            button {
                width: 25rem;
                height: 4rem;
                margin: 1rem;
                font-weight: 530;
                color: white;
                font-size: 1rem;
            }
        }
        width: 100%;
        height: 100%;
    }
</style>
