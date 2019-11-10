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
            let currentDay = new Date().toISOString().slice(0, 10);
            db.collection('categories').orderBy('order').get().then(function(categoriesFromDb){
                let categories = {};
                categoriesFromDb.forEach((category) => {
                    let categoryContent = {};
                    categoryContent.title = category.data().title;
                    db.collection('items').orderBy('order').where("category", "==", category.data().title).
                        onSnapshot((snapshot) => {
                            categoryContent.items = [];
                            let lastCategory;
                            snapshot.forEach((doc) => {
                                let checked = false;
                                if (doc.data().dates && doc.data().dates.includes(currentDay)) {
                                    checked = true;
                                }
                                categoryContent.items.push({id: doc.id, title: doc.data().title, checked: checked});
                                lastCategory = doc.data().category;
                            });
                            categories[lastCategory] = {...categoryContent};
                            state.items = {...categories};
                        });
                });
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

