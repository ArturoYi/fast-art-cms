import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { store } from '@/store';
import { setupRouter } from '@/router';

const app = createApp(App);
setupRouter(app);
app.use(store).mount('#app');
