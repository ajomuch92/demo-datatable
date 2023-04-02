import { createApp } from 'vue'
import './style.css';
import App from './App.vue';
import vClickOutside from 'click-outside-vue3';

createApp(App)
  .use(vClickOutside as any)
  .mount('#app');

