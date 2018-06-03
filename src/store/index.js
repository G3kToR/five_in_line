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
        playerKey: '',
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

        setPlayerKey(state, key) {
            state.playerKey = key;

            if (!key) {
                StoreService.remove('playerKey');
                return;
            }

            StoreService.set('playerKey', state.playerKey);
        },

        setRoomId(state, id) {
            state.roomId = id;

            if (!id) {
                StoreService.remove('roomId');
                return;
            }

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

            const playerKey = StoreService.get('playerKey');
            if (playerKey) {
                commit('setPlayerKey', playerKey);
            }
        },

        clearPlayerInfo({ commit }) {
            commit('setPlayer', null);
            commit('setRoomId', '');
            commit('setPlayerKey', '');
        }
    },

    getters: {
        getPlayer(state) {
            return state.player;
        },

        getPlayerKey(state) {
          return state.playerKey;
        },

        getRoomId(state) {
            return state.roomId;
        }
    }
});
export default store;
