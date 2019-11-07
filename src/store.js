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
            console.log('getitems function ',state.items);
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
                let categories = [];
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
                            state.items = Array.from(categories);
                            console.log('after setting state state is ', state.items);
                            console.log('loading finished, put it in state.items for '+  category.data().title, categoryContent);


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

