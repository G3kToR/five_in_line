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
        if (events.key === 'roomId' ) { // && events.oldValue && !events.newValue
            this.$store.commit('setRoomId', events.newValue);
            console.log('stor');
        }
    });
  },

  render: h => h(App),
});
