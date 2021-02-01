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
                outlined
                clearable
                label="Search"
                type="text"
        ></v-text-field>
        <!-- <v-btn icon='mdi-search'></v-btn> -->
    <!-- </v-row> -->
    <span>Sort by:</span>
    <br>
    <v-btn @click="sortByFirstName()">Name</v-btn>
    <v-btn @click="sortByLastName()">Surname</v-btn>
    <v-btn @click="sortByDate()">Date</v-btn>
    <div v-for="patient in this.patientsFixed" :key="patient.firstName">
    <v-list-item two-line>
        <v-list-item-content>
            <v-list-item-title>{{patient.firstName}} {{patient.lastName}}</v-list-item-title>
            <v-list-item-subtitle>{{patient.lastCheckupDate}}</v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>  
        </div>
    </v-card>
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
            }
        },
        
    mounted(){
        client({
            method: 'GET',
            url: 'dermatologist/patients-for-dermatologist'
        })
        .then((response) => {
            this.patients = response.data;
            
            for(let patient of response.data){
                patient.lastCheckupDate = this.toDate(patient.dateOfAppointment);
                this.patientsFixed.push(patient);
            }
        })
        
        

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
            if(this.sort_first_name_asc){
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
            alert(this.sort_last_name_asc);
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
    },
}
</script>

<style scoped>
    .main-container{
        margin-top: 5%,
    }
</style>