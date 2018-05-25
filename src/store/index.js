import Vue from 'vue';
import Vuex from 'vuex';
import FirebaseStore from './modules/firebase.store';
import PlayersStore from './modules/players.store';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  modules: {
    FirebaseStore,
    PlayersStore,
  },
});
export default store;
