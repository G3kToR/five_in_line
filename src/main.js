import Vue from 'vue';
import App from './App.vue';
import store from './store';

/*const app = Firebase.initializeApp(config);
const db = app.database();
const booksRef = db.ref('books');*/
/*console.log(JSON.stringify({
  rooms: [{
    id: 1,
    players: [{
        name: 'Иван',
        id: 124235
      },
      {
        name: 'Петр',
        id: 756323,
      }
    ],
    marksArr: [
      [0, 1, 1],
      [2, 3, 2]
    ],
    begin: [0, 0]
  }]
}));*/
new Vue({
  el: '#app',
  store,

  created() {
    this.$store.dispatch('loadRoomsFromApi');
  },
  
  render: h => h(App),
});
