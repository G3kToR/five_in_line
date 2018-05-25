const PlayersStore = {
  state: {
    players: null,
  },

  mutations: {
    setPlayers(state, data) {
      state.players = data;
    },
  },

  getters: {
    getPlayers(state) {
      return this.players;
    }
  }
}
export default PlayersStore;
