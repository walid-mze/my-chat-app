import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue'; // Importer la page d'inscription
import Profile from '../components/Profile.vue'; // Importer la page de profil

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register }, // Ajouter la route d'inscription
  { path: '/reset', name: 'Reset', component: () => import('../views/Reset.vue') }, // Importer la page de réinitialisation
  { path: '/profile', name: 'Profile', component: Profile }, // Ajouter la route de profil
  { path: '/chat', name: 'Chat', component: () => import('../components/Chat.vue') }, // Importer la page de chat
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;