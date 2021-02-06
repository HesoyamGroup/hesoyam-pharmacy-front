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
            <v-list-item-subtitle>
                <v-col
                cols="12"
                sm="6"
                md="3"
                > 
                    {{patient.lastCheckupDate}}
                </v-col>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                    <v-btn plain color = "indigo lighten-2" @click="loadAllAppointments(patient)">
                        Appointments
                    </v-btn>
                </v-col>
                </v-list-item-subtitle>
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


      <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogHeadlineText}}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
        <v-list>
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
            <v-list-item
            v-for="item of allAppointments"
            :key="item.fixedDate"
            >
            <v-list-item-content>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                <v-list-item-title v-text="item.fixedDate"></v-list-item-title>
                </v-col>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                <v-btn
                v-if="userRole === 'ROLE_PHARMACIST'"
                plain 
                @click="openAppointment(item)"
                color="indigo lighten-2">
                Start Appointment
                </v-btn>
                </v-col>

            </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        </v-list>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            plain
            @click="closeDialog()"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';


export default {
    name: 'SearchUsers',
    data(){
            return {
                patients: [],
                userRole: null,
                selectedItem: null,
                dialogHeadlineText: null,
                dialog: false,
                allAppointments: [],
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
        this.userRole = localStorage.getItem('user_role');
    },

    methods:{
        toDate: function(array){
            return array[0] + "-" +array[1] + "-" + array[2];
        },

        toDateTime: function(array){
            return array[0] + "-" +array[1] + "-" + array[2] + " " + array[3] + ":" + array[4];
        },
        
        closeDialog: function(){
            this.dialog = false;
            this.allAppointments = [];
        },

        openAppointment: function(item){
            const encodedURI = encodeURI('/counseling-report' + '?patientEmail=' + item.patientEmail + '&from=' + item.fixedDate);
            this.$router.push({path: encodedURI});
        },

        loadAllAppointments: function(patient){
            var link = "";
            if(localStorage.getItem("user_role") === "ROLE_PHARMACIST")
                link = "counseling/get-all-counselings-for-patient"
            else
                link = "checkup/get-all-checkups-for-patient"

            link += "/"+patient.email;

            client({
                url: link,
                method: 'GET',
            })
            .then((response) => {
                // this.allAppointments = response.data;

                for(var appointment of response.data){
                    appointment.fixedDate = this.toDateTime(appointment.from);
                    this.allAppointments.push(appointment);
                }

                this.dialog = true;
                if(localStorage.getItem("role") === "ROLE_PHARMACIST"){
                    this.dialogHeadlineText = "Select a counseling!";
                } else {
                    this.dialogHeadlineText = "Select a checkup!";
                }
            })
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