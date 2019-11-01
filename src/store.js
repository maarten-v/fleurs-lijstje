import Vue from 'vue';
import Vuex from 'vuex';
import {db} from './main.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        items: null,
        user: null,
    },
    getters: {
        getItems: state => {
            return state.items;
        },
        getUser: state => {
            return state.user;
        },
    },
    mutations: {
        setItems: state => {
            let items = [];
            let currentDay = new Date().toISOString().slice(0, 10);

            db.collection('items').
                onSnapshot((snapshot) => {
                    items = [];
                    snapshot.forEach((doc) => {

                        let checked = false;
                        if (doc.data().dates && doc.data().dates.includes(currentDay)) {
                            checked = true;
                        }
                        items.push({id: doc.id, title: doc.data().title, checked: checked});
                    });

                    state.items = items;
                });
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        setItems: context => {
            context.commit('setItems');
        },
    }
});

