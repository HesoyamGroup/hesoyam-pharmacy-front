import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginPage from '../views/LoginPage.vue'

import {client} from '@/client/axiosClient'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  {
    path: '/login', component: LoginPage,
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach( async (to, from, next) => {
  //Before each routing, check user authentication (token)
  validateAuthentication().then( (isAuthenticationValid) => {
      if(!isAuthenticationValid){
        clearUserData();
      }
      next();
  });
});

function clearUserData(){
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_token_expires');
}

async function validateAuthentication() {
    return await client({
      method: 'GET',
      url: 'auth/validate-token'
    }).then( (response) => {
      return true;
    }, (error) => {
      return false;
    })
}

export default router
