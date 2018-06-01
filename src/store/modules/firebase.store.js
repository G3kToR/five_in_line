import Firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyD6Fe5_xEmKRD1pVm17ofko9zeWbn6IoRM',
  authDomain: 'firechat-d7768.firebaseapp.com',
  databaseURL: 'https://firechat-d7768.firebaseio.com',
  projectId: 'firechat-d7768',
  storageBucket: 'firechat-d7768.appspot.com',
  messagingSenderId: '839521172191',
};

const FirebaseStore = {
  state: {
    rooms: null,
    gameRoom: null,
    db: null,
  },

  mutations: {
    setDB(state, data) {
      state.db = data;
    },

    setRooms(state, rooms) {
      state.rooms = rooms ? rooms : 'none';
    },

    setGameRoom(state, gameRoom) {
      state.gameRoom = gameRoom;
    },
  },

  actions: {
    apiConnect({ state, commit }) {
      commit('setDB', Firebase.initializeApp(config).database());
    },

    loadRoomsFromApi({ state, commit }) {
      return new Promise((resolve, reject) => {
        state.db.ref('rooms').on('value', snapshot => {
          commit('setRooms', snapshot.val());
          resolve();
        });
      });
    },

    loadGameRoomFromApi({ state, commit, getters }) {
      return new Promise((resolve, reject) => {
        getters.getGameRoomRef.on('value', snapshot => {
          if (!snapshot.val()) {
            commit('setRoomId', '');
            reject();
          } else {
            commit('setGameRoom', snapshot.val());
            resolve();
          }
        });
      });
    },

    connectGameRoom({ state, commit, dispatch, getters }, roomId) {

      const Room = getters.getRooms[roomId];
      const result = 'players' in Room ? Room.players : [];

      if (Room.colPlayers < 2) {
        state.db.ref('rooms').off();

        result.push(getters.getPlayer);

        commit('setRoomId', roomId);

        dispatch('editGameRoom', [{
          key: 'players',
          value: result
        }, {
          key: 'colPlayers',
          value: ++Room.colPlayers
        }]);

        if (Room.colPlayers === 2) {
          dispatch('resetGameRoom', { status: 0 });
        }
      } else {
        return false;
      }
    },

    setGameMark({ dispatch, getters }, mark) {
        return dispatch('editGameRoom', [
          { key: 'marksArr', value: mark },
          { key: 'player', value: getters.getGameRoom.player === 1 ? 2 : 1 },
        ]);
    },

    resetGameRoom({ dispatch, getters }, data) {
      const updates = {};
      updates['marksArr'] = [[0,0,0]];
      updates['begin'] = [0,0];
      updates['player'] = 1;
      
      if (data) {
        'status' in data ? updates['status'] = data.status : null;
      }

      return getters.getGameRoomRef.update(updates);
    },

    restartGameRoom({ dispatch, getters }) {
      if (++getters.getGameRoom.status === 4) {
        return dispatch('resetGameRoom', { status: 0 });
      }

      return dispatch('editGameRoom', {
        key: 'status',
        value: getters.getGameRoom.status,
      });
    },

    addGameRoom({ state, commit, dispatch, getters }) {
      const newRoomKey = state.db.ref('rooms').push().key;

      const room = {
        id: Date.now()
          .toString()
          .substr(4, 6),
        colPlayers: 0,
        players: [],
        marksArr: [[0, 0, 0]],
        begin: [0, 0],
        player: 1,
        status: 1,
      };

      return state.db.ref('/rooms/' + newRoomKey).update(room).then( () => {
        return dispatch('connectGameRoom', newRoomKey);
      });
  
    },

    leaveGameRoom({ commit, dispatch, getters }) {
     
      const Room = getters.getGameRoom;

      Room.players.forEach((player, index) => {
        if (player.id === getters.getPlayer.id) {
          Room.players.splice(index, 1);
          getters.getGameRoomRef.child('colPlayers').set(--Room.colPlayers);
        }
      });

      if (Room.colPlayers === 0) {
        getters.getGameRoomRef.remove();
      } else {
        getters.getGameRoomRef.child('players').set(Room.players);
        dispatch('editGameRoom', {
          key: 'status',
          value: 1,
        });
      }

      commit('setRoomId', '');
    },

    editGameRoom({ getters }, data) {
      
      if (Array.isArray(data)) {

        const updates = {};
        data.forEach(item => {
          updates[item.key] = item.value;
        });
        return getters.getGameRoomRef.update(updates);

      } else {
        return getters.getGameRoomRef.child(data.key).set(data.value);
      }
      
    },
  },

  getters: {
    getDB(state) {
      return state.db;
    },

    getRooms(state) {
      return state.rooms;
    },

    getGameRoom(state) {
      return state.gameRoom;
    },

    getGameRoomRef(state, getters) {
      return state.db.ref('rooms').child(getters.getRoomId);
    },

    getCurrentPlayer(state, getters) {
      return getters.getGameRoom.players[getters.getGameRoom.player - 1];
    },

    checkPlayerStep(state, getters) {
      return (getters.getCurrentPlayer && getters.getPlayer.id === getters.getCurrentPlayer.id);
    }
  },
};
export default FirebaseStore;
