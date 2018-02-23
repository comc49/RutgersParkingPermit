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
                @click="dialog = true"
                large
            >
                Buy a Guest Permit
            </v-btn>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Buy Rutgers Guest Parking Permit</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
                <v-flex xs12>
                        <p class="text-lg-center red">NOTE:</p>
                        <p class="text-lg-center">To purchase the guest permit, You need to have your Rutgers parking account registered and your vehicle added</p>
                </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  label="Campus Lot"
                  v-model="lot"
                  autocomplete
                  required
                  :items="lots">
                </v-select>
              </v-flex>
              <v-flex xs12 sm6>
                    <v-text-field label="Vehicle Plate Number" v-model="plateNumber" type="text" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                    <v-card-text
                        class="d-block py-0"
                        v-bind:class="{'green--text': !msg.includes('error'),'red--text': msg.includes('error')}"
                        v-for="(msg,i) in msgs" :key="i"
                    >
                        {{msg}}
                    </v-card-text>
              </v-flex>
              <v-flex xs12>
                      <v-card-text>
                          Currently this application only supports purchasing
                          today's guest permit. 
                          <br>
                          <small>If there is a need I can add a feature where you can buy a permit for a date range </small>
                      </v-card-text>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn v-if="!showConfirm" color="secondary darken-1" flat @click.native="showConfirm=true">Buy</v-btn>
          <v-btn
            v-if="showConfirm"
            color="green darken-1"
            flat
            @click.native="buyPermit"
            :loading="loading"
          >Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
            lot: null,
            plateNumber: null,
            showConfirm: false,
            lots: ['cook', 'livi', 'busch', 'doug' ],
            exampleSocket: null,
            msgs: [],
            dialog: false,
        }
    },
    mounted() {
        let addressRef = firebase.database().ref(`users/${this.uid}/addressData`);
        if (addressRef) {
            addressRef.once('value').then((snapshot) => {
                let data = snapshot.val();
                this.userFormDataAvailable = true;
                if (data) {
                    this.setUserFormData(data);
                }
            });
        }
        this.$http.post('/key').then(
            (res) => {
                this.key = res.data;
            },
            (err) => {
                this.$router.error = 'cannot get the decrypt key'
                this.$router.push('/error');
        });
        this.webSocket.onmessage = this.getMessage;
    },
    methods: {
        ...mapActions({
            setUserFormData: 'session/SetUserFormData',
        }),
        getMessage(event) {
            this.msgs.push(event.data) 
        },
        buyPermit() {
            this.loading = true;
            if (this.userFormDataAvailable) {
                let bytesCC  = CryptoJS.AES.decrypt(this.userFormData.visaCC.toString(), this.key);
                let bytesCCCVV2  = CryptoJS.AES.decrypt(this.userFormData.visaCCCVV2.toString(), this.key);
                let bytesRutgersPassword  = CryptoJS.AES.decrypt(this.userFormData.rutgersPassword.toString(), this.key);
                let body = {
                    ...this.userFormData,
                    visaCC: bytesCC.toString(CryptoJS.enc.Utf8),
                    visaCCCVV2: bytesCCCVV2.toString(CryptoJS.enc.Utf8),
                    rutgersPassword: bytesRutgersPassword.toString(CryptoJS.enc.Utf8),
                    plateNumber: this.plateNumber,
                    lot: this.lot,
                }
                this.$http.post('/buyPermit', body).then((res) => {
                    this.loading = false;
                    this.dialog = false;
                    console.log(res,'res from buying permit');
                },
                (err) => {
                    this.msg = err;
                })
            }
        },
    },
  computed: {
      ...mapGetters({
          userInfo: 'session/userInfo',
          userFormData: 'session/userFormData',
          uid: 'session/uid',
          webSocket: 'session/webSocket',
      }),
  },
  watch: {
      'dialog': function(dialog){
          if (!dialog) {
              this.showConfirm = false;
              this.msgs = [];
          }
      }
  }
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
