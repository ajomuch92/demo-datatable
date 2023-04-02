import { createApp } from 'vue'
import './style.css';
import App from './App.vue';
import vClickOutside from 'click-outside-vue3';
import router from './routes';

createApp(App)
  .use(vClickOutside as any)
  .use(router)
  .mount('#app');

