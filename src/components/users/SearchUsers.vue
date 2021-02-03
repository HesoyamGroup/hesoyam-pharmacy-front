<template>
    <div id="main-container" class="main-container">
    <v-card
        class="mx-auto"
        max-width="400"
        tile
    >
  
    <!-- <v-row > -->
        <v-text-field
        v-model="query"
                clearable
                label="Search"
                type="text"
                outlined
                
        ></v-text-field>
        <v-row justify="center">
        <v-btn @click="searchQuery()" class="btn"><v-icon color="indigo lighten-1">mdi-account-search</v-icon></v-btn>
        <v-btn @click="resetList()" class="btn"><v-icon color = "indigo lighten-1">mdi-refresh</v-icon></v-btn>
        <br>
        <br>
        </v-row>
        <!-- <v-btn icon='mdi-search'></v-btn> -->
    <!-- </v-row> -->
    <v-row justify="center">
    <span>Sort by:</span>
    </v-row>
    <v-row justify="center">
    <v-btn @click="sortByFirstName()" plain color="indigo lighten-1">Name</v-btn>
    <v-btn @click="sortByLastName()" plain color="indigo lighten-1">Surname</v-btn>
    <v-btn @click="sortByDate()" plain color="indigo lighten-1">Date</v-btn>
    </v-row>
    <div v-for="patient in this.patientsFixed" :key="patient.firstName">
    <v-list-item two-line>
        <v-list-item-content>
            <v-list-item-title>{{patient.firstName}} {{patient.lastName}}</v-list-item-title>
            <v-list-item-subtitle>{{patient.lastCheckupDate}}</v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>  
        </div>
    </v-card>

    <v-snackbar
      v-model="snackbar"
      :vertical="vertical"
      light
      timeout="2000"
    >
      {{snackbarText}}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="indigo"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';

export default {
    name: 'SearchUsers',
    data(){
            return {
                patients: [],
                patientsFixed: [],
                query: '',
                sort_first_name_asc: true,
                sort_last_name_asc: true,
                sort_date_asc: true,
                snackbarText: '',
                snackbar: false,
                vertical: false,
            }
        },
        
    mounted(){      
        this.getAllPatients();
    },

    methods:{
        toDate: function(array){
            return array[0] + "-" +array[1] + "-" + array[2];
        },

        sortByFirstName: function(){
            if(this.sort_first_name_asc){
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            } else {
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            }

            this.sort_first_name_asc = !this.sort_first_name_asc;
        },

        sortByLastName: function(){
            if(this.sort_last_name_asc){
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.lastName.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            } else {
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.lastName.toUpperCase(); // ignore upper and lowercase
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            }

            this.sort_last_name_asc = !this.sort_last_name_asc;
            
        },

        sortByDate: function(){
            if(this.sort_date_asc){
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.lastCheckupDate.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.lastCheckupDate.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            } else {
                this.patientsFixed.sort(function(a, b) {
                    var nameA = a.lastCheckupDate.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.lastCheckupDate.toUpperCase(); // ignore upper and lowercase
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
            }

            this.sort_date_asc = !this.sort_date_asc;
        },

        searchQuery: function(){
            var link = 'appointment/search-for-user/' + this.query;
            client({
                method: 'GET',
                url: link
            })
            .then((response) => {
                this.patientsFixed = [];
                if(response.data.length === 0){
                    this.snackbar = true;
                    this.snackbarText = "No patients found!";
                }
                this.patients = this.sortByGrade(response.data);
                for(var patient of response.data){
                    patient.lastCheckupDate = this.toDate(patient.dateOfAppointment);
                    this.patientsFixed.push(patient);
                }
            })
        },
        sortByGrade: function(data){
            data.sort(function(a, b) {
                    var gradeA = a.grade;
                    var gradeB = b.grade;
                    if (gradeA < gradeB) {
                        return -1;
                    }
                    if (gradeA > gradeB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                    });
        },
        resetList: function(){
            this.patientsFixed = [];
            this.getAllPatients();
        },
        getAllPatients: function(){
            var link = '';
        if(localStorage.getItem('user_role').toLowerCase() === 'role_pharmacist')
            link = 'pharmacist/patients-for-pharmacist';
        else
            link = 'dermatologist/patients-for-dermatologist';

        client({
            method: 'GET',
            url: link 
        })
        .then((response) => {
            for(var patient of response.data){
                patient.lastCheckupDate = this.toDate(patient.dateOfAppointment);
                this.patientsFixed.push(patient);
            }
        })
        },
    },
}
</script>

<style scoped>
    .main-container{
        margin-top: 5%,
    }
    span{
        color: grey;
    }
    .btn{
        margin-left: 2%;
    }

</style>