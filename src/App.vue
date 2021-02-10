<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      src="https://hdwallpaperim.com/wp-content/uploads/2017/08/31/154406-blurred-gradient-748x421.jpg"
    >

    <v-toolbar-title>Hesoyam Pharmacy</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn @click="logout()" plain to="/login">Log out <v-icon>mdi-logout</v-icon></v-btn>


      
    </v-app-bar>



    <v-main>
      <router-view>
      </router-view>
    </v-main>

    <v-footer
    dark
    padless
  >
    <v-card
      flat
      tile
      class="indigo lighten-1 white--text text-center"
    >
      <v-card-text>
        <v-btn
          class="mx-4 white--text"
          icon
        >
        <a href="http://github.com/HesoyamGroup" class="github-logo">
          <v-icon size="24px">
            mdi-github
          </v-icon>
        </a>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0">
        Hesoyam Pharmacy is a pharmaceutical information system that creates a complex network between multiple pharmacies. We strive to introduce the future to the most essential sector of economy - healthcare. This software is a powerful productivity tool to help pharmacies better manage their time and resources!
      </v-card-text>

      <v-divider></v-divider>

      <v-card-text class="white--text">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-card-text>
    </v-card>
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
  .github-logo{
    color: white;
    text-decoration: none;
  }
</style>
