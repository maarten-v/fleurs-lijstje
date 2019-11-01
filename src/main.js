import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import store from './store.js'

const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: "",
  messagingSenderId: process.env.VUE_APP_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
};
firebase.initializeApp(config);

export {firebase};

export const db = firebase.firestore()

new Vue({
  store,
  render: h => h(App),
  beforeCreate: function() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.commit('setUser', user);
        this.$store.dispatch('setItems');
      } else {
        this.$store.commit('setUser', null);
      }
    })
  },
}).$mount('#app')
