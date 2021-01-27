import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'

import {client} from '@/client/axiosClient'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login', 
    component: LoginPage,
    beforeEnter: function(to, from, next){
      if(isUserLoggedIn()){
        router.push({path: '/'});
      }else{
        next();
      }
    }
  },

  {
    path: '/register', 
    component: RegisterPage,
    beforeEnter: function(to, from, next){
      console.log(isUserLoggedIn());
      if(isUserLoggedIn()){
        router.push({path: '/'});
      }else{
        next();
      }
    }
  },

  {
    path: '/profile', 
    component: ProfilePage,
    beforeEnter: function(to, from, next){
      if(!isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        next();
      }
    }
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




function isUserLoggedIn(){
    var userData = getLoggedUserData();
    //If user token present, user is logged.
    if(userData['userToken']) return true;

    return false;
}

function getLoggedUserData(){
    return {
      userRole: _getUserRole(),
      userToken: _getUserToken(),
      userTokenExpiryDate: _getUserTokenExpiryDate()
    }
}

function _getUserRole(){
  var userRole = localStorage.getItem('user_role');
  if(userRole != null){
      userRole = userRole.substring(userRole.indexOf('_') + 1);
  }

  return userRole;
}

function _getUserToken(){
  return localStorage.getItem('user_token');
}

function _getUserTokenExpiryDate(){
  return localStorage.getItem('user_token_expires');
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
