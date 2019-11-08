import Vue from 'vue';
import Vuex from 'vuex';
import {db} from './main.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        items: null,
        user: null,
        categories: [],
    },
    getters: {
        getItems: state => {
            return state.items;
        },
        getCategories: state => {
            return state.categories;
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
                    db.collection('items').where("category", "==", category.data().title).
                        onSnapshot((snapshot) => {
                            console.log('onsnapshot is called for ', categoryContent);
                            categoryContent.items = [];
                            let lastCategory;
                            snapshot.forEach((doc) => {
                                console.log('items returned: ', doc.data().title);
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
        setCategories: state => {
            db.collection('categories').orderBy('order').get().then(function(categoriesFromDb){
                let categories = [];
                categoriesFromDb.forEach((category) => {
                    categories.push(category.data());
                });
                state.categories = categories;
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
        setCategories: context => {
            context.commit('setCategories');
        },
    }
});

