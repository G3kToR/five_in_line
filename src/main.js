import Vue from 'vue';
import App from './App.vue';
import store from './store';

new Vue({
  el: '#app',
  store,

  created() {
    this.$store.dispatch('apiConnect');
    this.$store.dispatch('loadInfoFromStore');
  },

  render: h => h(App),
});
