<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div id="userbar">
                        <template v-if=this.$store.getters.getUser>
                            <a @click="signOut" href="#">Uitloggen</a>
                            <img :src="this.$store.getters.getUser.photoURL" alt="avatar" id="avatar">
                        </template>
                    </div>
                    <div class="title">Fleurs lijstje</div>
                    <div v-show=!this.$store.getters.getUser>
                        <div id="firebaseui-auth-container"></div>
                    </div>
                    <div v-if="errors !== ''" id="errors">{{ errors }}</div>
                    <div v-if="this.$store.getters.getItems && this.$store.getters.getUser">
                        <div v-for="category in this.$store.getters.getItems" :key="category.id">
                            <h2>{{ category.title }}</h2>
                            <div v-for="item in category.items" :key="item.id">
                                <input type="checkbox" :id="item.id" v-model="item.checked" :value="currentDay" @click="toggleDate(item.id, $event)" />
                                <label :for="item.id">{{ item.title }}</label>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {db, firebase, firebaseui} from '../main.js'

    export default {
        mounted() {
            // console.log('Component mounted.')
            let uiConfig = {
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                ],
                callbacks: {
                    // Avoid redirects after sign-in
                    signInSuccessWithAuthResult: () => false
                }
            };
            let ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start('#firebaseui-auth-container', uiConfig);
        },
        data: function () {
            return {
                checklistItem: '',
                errors: '',
                currentDay: new Date().toISOString().slice(0, 10),
            }
        },
        methods: {
            addChecklistItem: function() {
                if (this.checklistItem !== '') {
                    db.collection('items').add({
                        title: this.checklistItem,
                        created_at: Date.now()
                    }).then((response) => {
                        if (response) {
                            this.checklistItem = ''
                        }
                    }).catch((error) => {
                        this.errors = error
                    })
                } else {
                    this.errors = 'Please enter some text'
                }
            },
            toggleDate: function(id, event) {
                if (event.target.checked) {
                    db.collection('items').doc(id).update({
                        'dates': firebase.firestore.FieldValue.arrayUnion(new Date().toISOString().slice(0, 10))
                    });
                } else {
                    db.collection('items').doc(id).update({
                        'dates': firebase.firestore.FieldValue.arrayRemove(new Date().toISOString().slice(0, 10))
                    });
                }
            },
            signOut: function() {
                firebase.auth().signOut().catch(error => console.log(error))
            },
        }
    }
</script>
