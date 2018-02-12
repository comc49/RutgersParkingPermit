<template>
    <div id="formPage">
        <h1>Billing Address</h1>
        <v-form class="address-form" v-model="valid" ref="form" lazy-validation >
            <v-text-field
                label="First Name"
                v-model="firstName"
                :placeholder="firstName"
                :rules="nameRules"
                :counter="10"
                :disabled="saved"
                required
            ></v-text-field>
            <v-text-field
                label="Last Name"
                v-model="lastName"
                :placeholder="lastName"
                :rules="nameRules"
                :disabled="saved"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="Address"
                v-model="address"
                :disabled="saved"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="City"
                v-model="city"
                :rules="cityRules"
                :disabled="saved"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="ZipCode"
                v-model="zipCode"
                :rules="zipRules"
                :disabled="saved"
                :counter="10"
                required
            ></v-text-field>
            <v-text-field
                label="E-mail"
                v-model="email"
                :rules="emailRules"
                :disabled="saved"
                required
            ></v-text-field>
            <v-select
                label="Item"
                v-model="select"
                :items="items"
                :disabled="saved"
                :rules="[v => !!v || 'Item is required']"
                required
            ></v-select>
            <v-btn @click="submit" :disabled="!valid || saved" >
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
        saved: false,
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
    mounted() {
        let addressRef = firebase.database().ref(`users/${this.uid}`);
        addressRef.once('value').then((snapshot) => {
            let data = snapshot.val();
            for (let key in data) {
                this.firstName = data[key].firstName;
                this.lastName = data[key].lastName;
                this.saved = true;
            }
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
        //if (this.$refs.form.validate()) {
              // Get a key for a new Post.
            var newPostKey = firebase.database().ref(`users/${this.uid}`).child('addressData').push().key;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/users/' + this.uid + '/' + newPostKey] = this.prepare();

            return firebase.database().ref().update(updates);

            // Native form submission is not yet supported
            // replace this API call with a call to firebase
            /*
            let usersRef = firebase.database().ref('users');
            console.log('addressRef',addressRef)
            usersRef.push(this.prepare()).then(function(res) {
                console.log(res,'suuppp')
            })
            */
        //}
    },
    clear () {
        this.$refs.form.reset()
    }

  },
  computed : {
      ...mapGetters({
          token: 'session/token',
          uid: 'session/uid'
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
