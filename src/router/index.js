import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MedicineSearchPage from '../views/MedicineSearchPage.vue'
import PharmacistPage from '../views/PharmacistPage.vue'
import DermatologistPage from '../views/Dermatologist1Page.vue'
import SysAdminProfilePage from '../views/SysAdminProfilePage.vue'

import PharmacyPage from '../views/PharmacyPage.vue'
import PharmacistsPage from '../views/PharmacistsPage.vue'
import DermatologistsPage from '../views/DermatologistsPage.vue'
import EmployeePage from '../views/EmployeePage.vue'

import * as UserService from '../service/UserService.js';

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
      if(UserService.isUserLoggedIn()){
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
      if(UserService.isUserLoggedIn()){
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
      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        next();
      }
    }
  },
  {
    path: '/sys-profile',
    component: SysAdminProfilePage,
    beforeEnter: function(to, from, next){
      if(UserService.isSysAdmin()){
        next();
        return;
      }
      router.push({path:'/login'});
    }
  },
  {
    path: '/medicine-search',
    component: MedicineSearchPage,
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/pharmacist',
    component: PharmacistPage,
    beforeEnter: function(to, from, next){
      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        next();
      }
    }
  },
  {
    path: '/pharmacist/:id',
    name: 'Pharmacist',
    component: EmployeePage,
    beforeEnter: function(to, from, next){
      UserService.isUserLoggedIn() ? next() : router.push({path: '/login'});
    }
  },
  {
    path: '/dermatologist/:id',
    name: 'Dermatologist',
    component: EmployeePage,
    beforeEnter: function(to, from, next){
      UserService.isUserLoggedIn() ? next() : router.push({path: '/login'});
    }
  },
  {
    path: '/dermatologist',
    component: DermatologistPage
  },
  {
    path: '/pharmacy/:id',
    name: 'Pharmacy',
    component: PharmacyPage
  },
  {
    path: '/pharmacists',
    name: 'Pharmacists',
    component: PharmacistsPage,
    beforeEnter: function(to, from, next){
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PATIENT' || user.userRole == 'ADMINISTRATOR'){
          next();
        }
        else{
          router.push({path: '/'});
        }
    }
  },
  {
    path: '/dermatologists',
    name: 'Dermatologists',
    component: DermatologistsPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'PATIENT' || user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/my-pharmacy',
    name: 'MyPharmacy',
    component: PharmacyPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        client({
          method: 'GET',
          url: 'administrator/pharmacy/id'
        }).then((response) => {
          let pharmacyId = response.data;
          router.push({path: '/pharmacy/' + pharmacyId});
        }, (error) => {});
      }
      else{
        router.push({path: '/'});
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  //Before each routing, check user authentication (token)
  UserService.validateAuthentication().then( (isAuthenticationValid) => {
      if(!isAuthenticationValid){
        UserService.clearUserData();
      }
      next();
  });
});


export default router
