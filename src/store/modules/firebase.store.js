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
    db: null,
  },

  mutations: {
    setDB(state, data) {
      state.db = data;
    },

    setRooms(state, data) {
      state.rooms = data;
      console.log(data);
    },
  },

  actions: {
    loadRoomsFromApi({ state, commit }) {
      commit(
        'setDB',
        Firebase.initializeApp(config)
          .database()
          .ref('rooms')
      );

      state.db.on('value', snapshot => {
        commit('setRooms', snapshot.val());
      });
    },

    removeRoomFromApi({ state }, key) {
      state.db.child(key).remove();
    },
  },

  getters: {
    getDB(state) {
      return state.db;
    },

    getRooms(state) {
      return state.rooms;
    },
  },
};
export default FirebaseStore;
