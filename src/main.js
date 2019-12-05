import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import store from './store'
import router from './router'
import Vuetify from 'vuetify'
import Notifications from 'vue-notification'
//-------------------------------------------
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'bootstrap/dist/css/bootstrap-reboot.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import 'jquery/dist/jquery.js'
import 'bootstrap/dist/js/bootstrap.js'
import 'popper.js/dist/popper.min.js'
import './assets/css/style.css'
//-------------------------------------------
Vue.use(Vuetify);
Vue.use(BootstrapVue);
Vue.use(Notifications);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
});
