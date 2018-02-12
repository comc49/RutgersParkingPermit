<template>
    <div id="formPage">
        <h1>Billing Address</h1>
        <v-form class="address-form" v-model="valid" ref="form" lazy-validation>
            <v-text-field
                label="First Name"
                v-model="firstName"
                :rules="nameRules"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="Last Name"
                v-model="lastName"
                :rules="nameRules"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="Address"
                v-model="address"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="City"
                v-model="city"
                :rules="cityRules"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="ZipCode"
                v-model="zipCode"
                :rules="zipRules"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="E-mail"
                v-model="email"
                :rules="emailRules"
                required
            ></v-text-field>
            <v-select
                label="Item"
                v-model="select"
                :items="items"
                :rules="[v => !!v || 'Item is required']"
                required
            ></v-select>
            <v-btn @click="submit" :disabled="!valid" >
                submit
            </v-btn>
            <v-btn @click="clear">clear</v-btn>
        </v-form>
    </div>
</template>

<script>
import firebase from 'firebase';
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';

export default {
    data: () => ({
        rutgersUserName: '' ,
        rutgersPassword: '' ,
        address: '',
        firstName: '',
        lastName: '',
        city: '',
        state: 'NJ',
        country: 'United States',
        zipCode: '',
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
        email: '',
        emailRules: [
            (v) => !!v || 'E-mail is required',
            (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        select: null,
        items: [
            'Item 1',
            'Item 2',
            'Item 3',
            'Item 4'
        ],
    }),
    created() {
        let addressRef = firebase.database().ref('addressData');
        addressRef.once('value').then((snapshot) => {
            console.log(snapshot,'snapshot')
        });


    },
  methods: {
    prepare() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            address: this.address,
            city: this.city,
            zipCode: this.zipCode,
            country: this.country,
            state: this.state,
        }
    },
    submit () {
        if (this.$refs.form.validate()) {
            // Native form submission is not yet supported
            // replace this API call with a call to firebase
            let addressRef = firebase.database().ref('addressData');
            console.log('addressRef',addressRef)
            addressRef.push(this.prepare()).then(function(res) {
                console.log(res,'suuppp')
            })
        }
    },
    clear () {
        this.$refs.form.reset()
    }

  },
  computed : {
      ...mapGetters({
          token: 'session/token'
      })

  }
}
</script>

<style lang='scss'>
#formPage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    margin: 1rem;
    .address-form {
        width: 100%;
    }
}
</style>
