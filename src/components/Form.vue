<template>
    <section id="formPage">
        <v-card id="form">
            <h1>Billing Address/Credit Card Info/Vehicle Info</h1>
            <v-form class="address-form" v-model="valid" ref="form" lazy-validation >
                <v-text-field
                    label="First Name"
                    v-model="firstName"
                    :placeholder="firstName"
                    :rules="nameRules"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Last Name"
                    v-model="lastName"
                    :placeholder="lastName"
                    :rules="nameRules"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Address"
                    v-model="address"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="City"
                    v-model="city"
                    :rules="cityRules"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="ZipCode"
                    v-model="zipCode"
                    :rules="zipRules"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="E-mail (Permit will be sent to this email)"
                    v-model="email"
                    :rules="emailRules"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Rutgers Parking Username"
                    v-model="rutgersUsername"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Rutgers Parking password"
                    v-model="rutgersPassword"
                    :type="hideFormInput ? 'password': 'text'"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Visa Credit Card Number"
                    v-model="visaCC"
                    :type="hideFormInput ? 'password': 'text'"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-text-field
                    label="Visa Credit Card CVV2"
                    v-model="visaCCCVV2"
                    :type="hideFormInput ? 'password': 'text'"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-select
                    label="Expiration Month"
                    v-model="expirationMonth"
                    :items="months"
                    :rules="[v => !!v || 'Month is required']"
                    required
                ></v-select>
                <v-select
                    label="Expiration Year"
                    v-model="expirationYear"
                    :items="years"
                    :rules="[v => !!v || 'Year is required']"
                    required
                ></v-select>
                <v-text-field
                    label="Vehicle Plate Number"
                    v-model="plateNumber"
                    :disabled="saved"
                    required
                ></v-text-field>
                <v-btn @click="submit" :disabled="!valid || saved" >
                    submit
                </v-btn>
                <v-btn @click="clear">clear</v-btn>
            </v-form>
        </v-card>
        <div class="fixedButton">
            <h5>{{hideFormInput ? 'Show' : 'Hide'}} Sensitive field</h5>
            <v-icon class="peek-icon" @click="hideFormInput = !hideFormInput">remove_red_eye</v-icon>
        </div>
    </section>

</template>

<script>
import firebase from 'firebase';
import axios from 'axios';
import moment from 'moment';
import CryptoJS from 'crypto-js';
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        saved: false,
        address: '',
        firstName: '',
        hideFormInput: true,
        lastName: '',
        city: '',
        state: 'NJ',
        country: 'United States',
        zipCode: '',
        rutgersUsername: null,
        rutgersPassword: null,
        expirationMonth: null,
        expirationYear: null,
        visaCCCVV2: null,
        visaCC: null,
        plateNumber: null,
        email: '',
        key: null,
        valid: true,
        nameRules: [
            (v) => !!v || 'Name is required',
            (v) => v && v.length <= 10 || 'Name must be less than 10 characters'
        ],
        cityRules: [
            (v) => !!v || 'City is required',
            (v) => v && v.length <= 20 || 'City must be less than 20 characters'
        ],
        zipRules: [
            (v) => !!v || 'Zip code is required',
            (v) => /\d+/.test(v)
        ],
        emailRules: [
            (v) => !!v || 'E-mail is required',
            (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
    }),
    mounted() {
        if (this.userFormData) {
            this.$http.post('/key').then((res) => {
                this.key = res.data;
                let bytesCC  = CryptoJS.AES.decrypt(this.userFormData.visaCC.toString(), this.key);
                let bytesCCCVV2  = CryptoJS.AES.decrypt(this.userFormData.visaCC.toString(), this.key);
                let bytesRutgersPassword  = CryptoJS.AES.decrypt(this.userFormData.visaCC.toString(), this.key);
                this.rutgersPassword = bytesRutgersPassword.toString(CryptoJS.enc.Utf8);
                this.visaCC = bytesCC.toString(CryptoJS.enc.Utf8);
                this.visaCCCVV2 = bytesCCCVV2.toString(CryptoJS.enc.Utf8);
            });
            this.firstName = this.userFormData.firstName;
            this.lastName = this.userFormData.lastName; 
            this.address = this.userFormData.address;
            this.city = this.userFormData.city;
            this.zipCode = this.userFormData.zipCode;
            this.country = this.userFormData.country;
            this.state = this.userFormData.state;
            this.email = this.userFormData.email;
            this.rutgersUsername = this.userFormData.rutgersUsername;
            this.expirationMonth = this.userFormData.expirationMonth;
            this.expirationYear = this.userFormData.expirationYear;
            this.plateNumber = this.userFormData.plateNumber;
        }
    },
  methods: {
    prepare() {
        let encryptCC = CryptoJS.AES.encrypt(this.visaCC, this.key);
        let encryptCCCV2 = CryptoJS.AES.encrypt(this.visaCCCVV2, this.key);
        let encryptRutgersPassword = CryptoJS.AES.encrypt(this.rutgersPassword, this.key);
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address,
            city: this.city,
            zipCode: this.zipCode,
            country: this.country,
            state: this.state,
            email: this.email,
            rutgersUsername: this.rutgersUsername,
            rutgersPassword: encryptRutgersPassword.toString(),
            visaCC: encryptCC.toString(),
            visaCCCVV2: encryptCCCV2.toString(),
            expirationMonth: this.expirationMonth,
            expirationYear: this.expirationYear,
            plateNumber: this.plateNumber,
        }
    },
    selectErrors () {
      const errors = []
      if (!this.$v.select.$dirty) return errors
      !this.$v.select.required && errors.push('Item is required')
      return errors
    },
    submit () {
        if (this.$refs.form.validate()) {
            // Write the new post's data simultaneously in the posts list and the user's post list.
            firebase.database().ref(`/users/${this.uid}/addressData`).set(
                this.prepare()
            ).then(() => {
               console.log('success!!') 
            });
        }
    },
    clear () {
        this.$refs.form.reset()
    }

  },
    computed : {
        ...mapGetters({
            token: 'session/token',
            uid: 'session/uid',
            userFormData: 'session/userFormData',
        }),
        months() {
            let a = [];
            for (let i = 1; i < 13; ++i) {
                a.push({
                    text: moment().set('month', i-1).format('MMMM'),
                    value: i
                });
            }
            return a;
        },
        years() {
            let a = [];
            for (let i=0; i<30; ++i) {
                a.push(2018 + i);
            }
            return a;
        }
  }
}
</script>

<style lang='scss'>
#formPage {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    .peek-icon {
        font-size: 6rem;
        color: black;
        opacity: .6;
    }
    h5 {
        padding: 0;
        margin: 0;
        color: black;
        font-size: 1rem;
    }
    .fixedButton {
        position: fixed;
        top: 2rem;
        right: 2rem;
    }
    #form {
        display: flex;
        flex-direction: column;
        width: 60%;
        padding: 2rem;
        margin: 1rem;
    }
    .address-form {
        width: 100%;
    }
}
</style>
