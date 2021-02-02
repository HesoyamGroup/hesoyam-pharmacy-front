import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import DatetimePicker from 'vuetify-datetime-picker'

Vue.use(VueAxios, axios)
Vue.use(DatetimePicker)

Vue.config.productionTip = false


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
