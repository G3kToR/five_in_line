import Vue from 'vue';
import App from './App.vue';
import store from './store';

new Vue({
  el: '#app',
  store,

  created() {
    this.$store.dispatch('apiConnect');
    this.$store.dispatch('loadInfoFromStore');
    window.addEventListener('storage', (events) => {
        if (events.key === 'roomId' ) {
            this.$store.commit('setRoomId', events.newValue);
        }
        if (events.key === 'playerKey' ) {
            this.$store.commit('setPlayerKey', events.newValue);
        }
    });
  },

  render: h => h(App),
});
