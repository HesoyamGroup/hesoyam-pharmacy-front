<template>
    <div>
<v-stepper
    v-model="e6"
    vertical
  >
    <v-stepper-step
      :complete="e6 > 1"
      step="1"
      color="indigo lighten-2"
    >
      New appointment
    </v-stepper-step>

    <v-stepper-content step="1">
      <!-- <v-card
        color="grey lighten-1"
        class="mb-12"
        height="200px"
      > -->
      <v-combobox :items="pharmacies" v-model="selectedPharmacy" item-text="name" solo label="Select pharmacy"></v-combobox>
      <!-- </v-card> -->
      <v-btn
        color="indigo lighten-2"
        @click="e6 = 2"
        plain
      >
        Continue
      </v-btn>
      <v-btn plain>
        <router-link to="/pharmacist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_PHARMACIST'">
        Cancel
        </router-link>
        <router-link to="/dermatologist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_DERMATOLOGIST'">
        Cancel
        </router-link>
      </v-btn>
    </v-stepper-content>
    <v-stepper-step
      :complete="e6 > 2"
      step="2"
      color="indigo lighten-2"
    >
      Choose a patient
    </v-stepper-step>
    <v-stepper-content step="2">

      <v-autocomplete :items="patientsFixed" item-text="email" v-model="selectedPatient" label="Select patient" ></v-autocomplete>

      <v-btn
        color="indigo lighten-2"
        @click="e6 = 3"
        plain
      >
        Continue
      </v-btn>
      <v-btn plain>
        <router-link to="/pharmacist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_PHARMACIST'">
        Cancel
        </router-link>
        <router-link to="/dermatologist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_DERMATOLOGIST'">
        Cancel
        </router-link>
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 3"
      step="3"
      color="indigo lighten-2"
    >
      Choose a time slot
    </v-stepper-step>

    <v-stepper-content step="3">
        <div
        class="mx-auto"
        max-width="1000"
        tile
    >
        
        <v-row justify="center">
    
      
      <v-card>
        <v-card-title>
          <span class="headline">Book an appointment!</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="2"
                sm="6"
                md="4"
              >

                <v-date-picker v-model="datePicker" :disabledDates="disabledDates"
                color="indigo lighten-2"
                no-title></v-date-picker>

              </v-col>
            
              <v-col
                cols="2"
                sm="6"
                md="4"
              >
              <v-col style="width: 350px; flex: 0 1 auto;">
                <h2>Start:</h2>
                <v-time-picker
                  v-model="e7"
                ></v-time-picker>
              </v-col>
              <v-col style="width: 350px; flex: 0 1 auto;">
              <h2>End:</h2>
              <v-time-picker
                v-model="e8"
              ></v-time-picker>
              </v-col>

              </v-col>

              <v-col
                cols="2"
                sm="6"
                md="4"
              >
              <v-text-field 
              type="number" 
              :min="0"
              label="Price"
              v-model="priceInput"
              >
              </v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="indigo lighten-1"
            plain
            @click="checkNewAppointmentDate()"
          >
            Check
          </v-btn>
          <v-btn
            color="indigo lighten-1"
            plain
            @click="bookAppointment()"
            v-if="dateAvailable"
          >
            Book
          </v-btn>
          <v-btn plain>
           <router-link to="/pharmacist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_PHARMACIST'">
                Cancel
                </router-link>
                <router-link to="/dermatologist" class="cancel-btn" color="indigo lighten-2" v-if="role==='ROLE_DERMATOLOGIST'">
                Cancel
            </router-link>
            
        </v-btn>
        </v-card-actions>
      </v-card>
    
  </v-row>
  </div>
        
    
    </v-stepper-content>

    
  </v-stepper>
 
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
    data () {
      return {
          dateAvailable: false,
          patientEmail: null,
          datePicker: null,
          e6: null,
          e7: null,
          e8: null,
          role: null,
          patients: [],
          snackbar: false,
          snackbarText: null,
          disabledDates: null,
          priceInput: null,
          pharmacies: null,
          vertical: false,
          selectedPharmacy: null,
          selectedPatient: null,
          patientsFixed: [],

      }
    },
    mounted(){
        if(localStorage.getItem('user_role')==='ROLE_PHARMACIST')
            this.role = 'ROLE_PHARMACIST'
        else
            this.role = 'ROLE_DERMATOLOGIST'

        this.getAllPatients();
        this.getAllPharmacies();
    },
    methods: {
        bookAppointment: function(){
            alert("HERE");
          var x = (new Date()).getTimezoneOffset() * 60000; 
          client({
            url: 'appointment/book-new-appointment',
            method: 'POST',
            data: {
              patientEmail: this.selectedPatient.email,
              from: (new Date(new Date(this.datePicker + ' ' + this.e7) - x)).toISOString().slice(0,-1),
              to: (new Date(new Date(this.datePicker + ' ' + this.e8) - x)).toISOString().slice(0,-1),
              pharmacyId: this.selectedPharmacy.id,
              price: this.priceInput
            },
          })
          .then((response) => {
            if(response.data){
              this.snackbar = true;
              this.snackbarText = response.data;
            }
          })
        },

        getAllPharmacies: function(){
            var link = 'employee/all-pharmacies';
            if(localStorage.getItem('user_role') === 'ROLE_PHARMACIST'){
                link += '-pharmacist';
            }
            else {
                link += '-dermatologist';
            }
            
            client({
                url: link,
                method: 'GET'
            })
            .then((response) => {
                this.pharmacies = response.data;
            })
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
            console.log(this.patientsFixed)
        },

        toDate: function(array){
            return array[0] + "-" +array[1] + "-" + array[2];
        },


        toDateTime: function(array){
            return array[0] + "-" +array[1] + "-" + array[2] + " " + array[3] + ":" + array[4];
        },

        checkNewAppointmentDate: function(){
          var x = (new Date()).getTimezoneOffset() * 60000; 

          var dateTime = this.datePicker + " " + this.e7;
          dateTime = new Date(dateTime).toISOString().substring(0, 16);
          
          var to = this.datePicker + " " + this.e8;
          to = new Date(to).toISOString().substring(0, 16);

          

          var link = 'appointment/check-new-appointment/'+this.patientEmail+'&&'+dateTime+'&&'+to;

          client({
            url: link,
            method: 'GET'
          })
          .then((response) => {
            this.dateAvailable = response.data;
          })
        },
    },
}
</script>