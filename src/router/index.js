import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import LoginPage from '../views/LoginPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import MedicineSearchPage from '../views/MedicineSearchPage.vue'
import PharmacistPage from '../views/PharmacistPage.vue'
import DermatologistPage from '../views/DermatologistPage.vue'
import SysAdminProfilePage from '../views/SysAdminProfilePage.vue'
import SupplierPage from '../views/SupplierPage.vue'
import BrowseMedicinePage from '../views/BrowseMedicinePage.vue'
import AllPharmaciesPage from '../views/AllPharmaciesPage.vue'
import CounselingReservationPage from '../views/CounselingReservationPage.vue'
import PharmacyPage from '../views/PharmacyPage.vue'
import PharmacistsPage from '../views/PharmacistsPage.vue'
import DermatologistsPage from '../views/DermatologistsPage.vue'
import EmployeePage from '../views/EmployeePage.vue'
import SearchUsersPage from '../views/SearchUsersPage.vue'

import CounselingReportPage from '../views/CounselingReportPage.vue'
import CheckUpReportPage from '../views/CheckUpReportPage.vue'

import EPrescriptionPage from '../views/EPrescriptionPage.vue';
import PromotionsPage from '../views/PromotionsPage.vue'
import HandOutMedicinePage from '../views/HandOutMedicinePage.vue'
import VacationRequestsPage from '../views/VacationRequestsPage.vue'
import NewOrderPage from '../views/NewOrderPage.vue'
import PatientFeedbackPage from '../views/PatientFeedbackPage.vue'
import OrdersPage from '../views/OrdersPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import EmployeeHomePage from '../views/EmployeeHomePage.vue'
import PharmacistRegisterPage from '../views/PharmacistRegisterPage.vue'
import DermatologistsManagementPage from '../views/DermatologistsManagementPage.vue'


import GraphicalReports from '../components/report/GraphicalReports.vue'

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
    path: '/feedback',
    component: PatientFeedbackPage,
    beforeEnter: function(to, from, next){
      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PATIENT'){
          next();
        }
        else{
          router.push({path: '/'});
        }
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
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PATIENT' || user.userRole == 'ADMINISTRATOR'){
          next();
        }
        else{
          router.push({path: '/'});
        }
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
    path:'/supplier-profile',
    component: SupplierPage
  },
  {
    path:'/browse-medicine',
    component: BrowseMedicinePage
  },
  {
    path: '/medicine-search',
    component: MedicineSearchPage,
    
  },
  {
    path: '/counseling-reservation',
    component: CounselingReservationPage, 
    beforeEnter: function(to, from, next){

      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PATIENT'){
          next();
        }
        else{
          router.push({path: '/'});
        }
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
  },
  {
    path: '/pharmacist',
    component: PharmacistPage,
    beforeEnter: function(to, from, next){
      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PHARMACIST'){
          next();
        }
        else{
          router.push({path: '/'});
        }
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
    path: '/pharmacy/all',
    name: 'AllPharmacies',
    component: AllPharmaciesPage
  },
  {
    path: '/dermatologist',
    component: DermatologistPage,
    beforeEnter: function(to, from, next){

      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'DERMATOLOGIST'){
          next();
        }
        else{
          router.push({path: '/'});
        }
      }
    }
  },
  {
    path: '/pharmacy/:id',
    name: 'Pharmacy',
    component: PharmacyPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        client({
          method: 'GET',
          url: 'administrator/pharmacy/id'
        }).then((response) => {
          let pharmacyId = response.data;
          if(to.params.id == pharmacyId)
            next();
          else
            router.push({path: '/pharmacy/' + pharmacyId});
        }, (error) => {});
      } else
        next();
    }
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
    path: '/pharmacist-new',
    name: 'PharmacistRegisterPage',
    component: PharmacistRegisterPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      } else
        router.push({path: '/'});
    }
  },
  {
    path: '/searchusers',
    name: 'SearchUsers',
    component: SearchUsersPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'PHARMACIST' || user.userRole == 'DERMATOLOGIST'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/home-employee',
    name: 'EmployeeHome',
    component: EmployeeHomePage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'PHARMACIST' || user.userRole == 'DERMATOLOGIST'){
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
    path: '/dermatologists/management',
    name: 'DermatologistsManagementPage',
    component: DermatologistsManagementPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {

    path: '/counseling-report',
    name: 'CounselingReport',
    component: CounselingReportPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'PHARMACIST'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {

    path: '/checkup-report',
    name: 'CheckUpReport',
    component: CheckUpReportPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'DERMATOLOGIST'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/hand-out-medicine',
    name: 'HandOutMedicine',
    component: HandOutMedicinePage,

    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'PHARMACIST'){
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
  },

  {
    path: '/eprescription',
    name: 'eprescription',
    component: EPrescriptionPage,
    beforeEnter: function(to, from, next){
      if(!UserService.isUserLoggedIn()){
        router.push({path: '/login'});
      }
      else{
        let user = UserService.getLoggedUserData();
        if(user.userRole == 'PATIENT'){
          next();
        }
        else{
          router.push({path: '/'});
        }
      }
    }
  },
  {
    path: '/promotions',
    name: 'Promotions',
    component: PromotionsPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/vacation-requests',
    name: 'Vacation Requests',
    component: VacationRequestsPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR' || user.userRole == 'SYS_ADMIN'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/order/new',
    name: 'NewOrderPage',
    component: NewOrderPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/orders',
    name: 'OrdersPage',
    component: OrdersPage,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: GraphicalReports,
    beforeEnter: function(to, from, next){
      let user = UserService.getLoggedUserData();
      if(user.userRole == 'ADMINISTRATOR'){
        next();
      }
      else{
        router.push({path: '/'});
      }
    }
  },
  {
    path: '*',
    component: NotFoundPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach( async (to, from, next) => {
  document.title = to.meta.title || 'Hesoyam Pharmacy';
  //Before each routing, check user authentication (token)
  UserService.validateAuthentication().then( (isAuthenticationValid) => {
      if(!isAuthenticationValid){
        UserService.clearUserData();
      }
      next();
  });
});


export default router
