import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import AdminView from '@/views/AdminView.vue'
import AlumnosView from '@/views/AlumnosView.vue'
import UsuariosView from '@/views/UsuariosView.vue'
import MateriasView from '@/views/MateriasView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: UsuariosView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/alumnos',
    name: 'alumnos',
    component: AlumnosView
  },
  {
    path: '/materias',
    name: 'materias',
    component: MateriasView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
