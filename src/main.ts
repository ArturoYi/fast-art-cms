import { createApp } from 'vue';
import '@/style.css';
import 'virtual:uno.css';
import App from '@/App.vue';
import { store } from '@/store';
import { setupRouter } from '@/router';
import i18n from '@/locale';

const app = createApp(App);
app.use(store).use(i18n);
setupRouter(app);
app.mount('#app');
