import { createApp } from 'vue'
import './style.css';
import App from './App.vue';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

createApp(App)
  .use(VueTippy)
  .mount('#app');

