import Vue from 'vue';
import Vuex from 'vuex';
import StoreService from '../service/store.service.js';
import FirebaseStore from './modules/firebase.store.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    FirebaseStore,
  },

  state: {
    player: {
      name: '',
      id: '',
    },

    roomId: '',
  },

  mutations: {

    setPlayer(state, player) {

      if (!player) {
        state.player.name = '';
        state.player.id = '';
        StoreService.remove('player');
        return;
      }

      state.player.name = player.name;

      if ('id' in player && player.id) {
        state.player.id = player.id;
      } else {
        state.player.id = Math.random().toString(36).substr(2, 6);
        StoreService.set('player', state.player);
      }

    },

    setRoomId(state, id) {
      state.roomId = id;
      StoreService.set('roomId', state.roomId);
    }
  },

  actions: {
    loadInfoFromStore({ commit }) {
      const player = StoreService.get('player');
      if (player) {
        commit('setPlayer', JSON.parse(player));
      }

      const roomId = StoreService.get('roomId');
      if (roomId) {
        commit('setRoomId', roomId);
      }
    }
  },

  getters: {
    getPlayer(state) {
      return state.player;
    },

    getRoomId(state) {
      return state.roomId;
    }
  }
});
export default store;
