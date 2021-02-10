<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      src="https://hdwallpaperim.com/wp-content/uploads/2017/08/31/154406-blurred-gradient-748x421.jpg"
    >

      <v-toolbar-title>
        <v-btn to="/" plain>
            <v-icon>mdi-medical-bag</v-icon>
            <div class="ml-3">Hesoyam Pharmacy</div>
        </v-btn>
      </v-toolbar-title>
      <v-btn to="/about" plain>About</v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="logout()" plain to="/login"><div class="mr-3">Log out</div><v-icon>mdi-logout</v-icon></v-btn>

    </v-app-bar>

    <v-main>
      <router-view>
      </router-view>
    </v-main>

    <v-footer absolute height="35" color="grey lighten-5">
      <v-spacer></v-spacer>
      <div>{{ new Date().getFullYear() }} — <i>Hesoyam Group</i></div>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';
import * as UserService from './service/UserService';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({
    //
  }),
  methods:{
    logout(){
      UserService.clearUserData();
    }
  }
};
</script>
<style scoped>
  .v-main{
    margin-bottom: 30px;
  }
  .v-app-bar{
    z-index: 2000 !important ;
  }
</style>
