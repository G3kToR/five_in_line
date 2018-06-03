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
            getters.getDB.ref('rooms').off();
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

            /*if (getters.getRoomId) {
                console.log(getters.getRoomId);
                return false;
            }*/

            //const result = 'players' in Room ? Room.players : [];

            if (getters.getRooms[roomId].colPlayers < 2) {

                //result.push(getters.getPlayer);

                commit('setRoomId', roomId);

                return dispatch('editGameRoom', [{
                    key: 'colPlayers',
                    value: (getters.getRooms[roomId].colPlayers + 1)
                }]).then(() => {
                    const playerKey = getters.getGameRoomRef.child('players').push(getters.getPlayer).key;
                    commit('setPlayerKey', playerKey);

                    if (getters.getRooms[roomId].colPlayers === 2) {
                        dispatch('resetGameRoom', { status: 0 });
                    }
                });


                /*dispatch('editGameRoom', [{
                  key: 'players',
                  value: result
                }, {
                  key: 'colPlayers',
                  value: ++Room.colPlayers
                }]);*/


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

        restartGameRoom({ dispatch, getters }) {
            //console.log(getters.getPlayerKey);
            getters.getGameRoomRef.child('players').child(getters.getPlayerKey).child('status').set(1);

            if (getters.getGameRoom.status + 1  === 4) {
                //getters.getGameRoomRef.child('players').
                return dispatch('resetGameRoom', { status: 0 });
            }

            return dispatch('editGameRoom', {
                key: 'status',
                value: getters.getGameRoom.status,
            });
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

        },

        leaveGameRoom({ commit, dispatch, getters }) {

            //const Room = getters.getGameRoom;

            /*dispatch('editGameRoom', {
                key: 'colPlayers',
                value: Room.colPlayers - 1,
            });*/


            if (!('players' in getters.getGameRoom)) {
                return getters.getGameRoomRef.remove();
            }

            for (const key of Object.keys(getters.getGameRoom.players)) {
                if (getters.getGameRoom.players[key].id === getters.getPlayer.id) {
                    getters.getGameRoomRef.child('players').child(key).remove();
                    dispatch('editGameRoom', {
                        key: 'colPlayers',
                        value: getters.getGameRoom.colPlayers - 1,
                    }).then(() => {
                        if (getters.getGameRoom.colPlayers === 0) {
                            getters.getGameRoomRef.remove();
                        } else {
                            dispatch('editGameRoom', {
                                key: 'status',
                                value: 1,
                            });
                        }
                        commit('setRoomId', '');
                    });

                }
            }


            /*Room.players.forEach((player, index) => {
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
            }*/


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
            //return getters.getGameRoom.players[getters.getGameRoom.player - 1];
            //console.log(getters.getGameRoom);
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

        checkPlayerStep(state, getters) {
            return (getters.getCurrentPlayer && getters.getPlayer.id === getters.getCurrentPlayer.id);
        }
    },
};
export default FirebaseStore;
