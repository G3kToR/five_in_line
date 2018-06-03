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

            if (getters.getRooms[roomId].colPlayers < 2) {

                getters.getDB.ref('rooms').off();
                commit('setRoomId', roomId);

                return dispatch('editGameRoom', [{
                    key: 'colPlayers',
                    value: (getters.getRooms[roomId].colPlayers + 1)
                }]).then(() => {
                    const playerKey = getters.getGameRoomRef.child('players').push(getters.getPlayer).key;
                    commit('setPlayerKey', playerKey);

                    if (getters.getRooms[roomId].colPlayers + 1 === 2) {
                        dispatch('resetGameRoom', { status: 0 });
                    }
                });

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
            updates['marksArr'] = [[0, 0, 0]];
            updates['begin'] = [0, 0];
            updates['player'] = 1;

            if (data) {
                'status' in data ? updates['status'] = data.status : null;
            }

            return getters.getGameRoomRef.update(updates);
        },

        resetPlayersStatus({ getters }) {
            for (const key of Object.keys(getters.getGameRoom.players)) {
                getters.getGameRoomRef.child('players').child(key).child('status').set(0);
            }
        },

        restartGameRoom({ dispatch, getters }) {

            getters.getGameRoomRef.child('players').child(getters.getPlayerKey).child('status').set(1);

            let colVote = 0;
            for (const key of Object.keys(getters.getGameRoom.players)) {
                if (getters.getGameRoom.players[key].status === 1) {
                    colVote++;
                }
            }

            if (colVote === 2) {
                dispatch('resetGameRoom', { status: 0 });
                return dispatch('resetPlayersStatus');
            }
        },

        addGameRoom({ commit, dispatch, getters }) {
            const newRoomKey = getters.getDB.ref('rooms').push().key;

            const room = {
                id: Date.now()
                    .toString()
                    .substr(4),
                colPlayers: 0,
                players: [],
                marksArr: [[0, 0, 0]],
                begin: [0, 0],
                player: 1,
                status: 1,
            };

            return getters.getDB.ref('/rooms/' + newRoomKey).update(room).then(() => {
                return dispatch('connectGameRoom', newRoomKey);
            });

        }
        ,

        leaveGameRoom({ commit, dispatch, getters }) {

            if (!getters.getPlayerKey) {
                getters.getGameRoomRef.off();
                return commit('setRoomId', '');
            }

            for (const key of Object.keys(getters.getGameRoom.players)) {
                if (getters.getGameRoom.players[key].id === getters.getPlayer.id) {
                    getters.getGameRoomRef.child('players').child(key).remove();
                    dispatch('editGameRoom', {
                        key: 'colPlayers',
                        value: getters.getGameRoom.colPlayers - 1,
                    }).then(() => {
                        if (getters.getGameRoom.colPlayers === 0) {
                            getters.getGameRoomRef.off();
                            getters.getGameRoomRef.remove();
                        } else {
                            getters.getGameRoomRef.off();
                            dispatch('editGameRoom', {
                                key: 'status',
                                value: 1,
                            });
                        }

                        commit('setGameRoom', null);
                        commit('setRoomId', '');
                        commit('setPlayerKey', '');
                    });

                }
            }

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
            return getters.getDB.ref('rooms').child(getters.getRoomId);
        },

        getCurrentPlayer(state, getters) {
            if (!('players' in getters.getGameRoom)) {
                return null;
            }
            let i = 1;
            for (const key of Object.keys(getters.getGameRoom.players)) {
                if (i++ === getters.getGameRoom.player) {
                    return getters.getGameRoom.players[key];
                }
            }
        },

        getPlayerFromApi(state, getters) {
            return getters.getGameRoom.players[getters.getPlayerKey];
        },

        getCurrentPlayerIndex(state, getters) {
            let i = 0;
            for (const key of Object.keys(getters.getGameRoom.players)) {
                if (i + 1 === getters.getGameRoom.player) {
                    return getters.getGameRoom.players[key];
                }
            }
        },

        checkPlayerStep(state, getters) {
            return (getters.getCurrentPlayer && getters.getPlayer.id === getters.getCurrentPlayer.id);
        }
    },
};
export default FirebaseStore;
