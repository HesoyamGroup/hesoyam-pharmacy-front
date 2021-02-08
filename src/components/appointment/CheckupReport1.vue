<template>
<div class="main-container">
  <v-stepper
    v-model="e6"
    vertical
  >
    <v-stepper-step
      :complete="e6 > 1"
      step="1"
      color="indigo lighten-2"
    >
      Checkup report
    </v-stepper-step>

    <v-stepper-content step="1">
      <!-- <v-card
        color="grey lighten-1"
        class="mb-12"
        height="200px"
      > -->
      <v-textarea v-model="report">
      </v-textarea>
      <!-- </v-card> -->
      <v-btn
        color="indigo lighten-2"
        @click="e6 = 2"
        plain
      >
        Continue
      </v-btn>
      <v-btn plain>
        <router-link to="/dermatologist" class="cancel-btn" color="indigo lighten-2">
        Cancel
        </router-link>
      </v-btn>
    </v-stepper-content>

    <v-stepper-step
      :complete="e6 > 2"
      step="2"
      color="indigo lighten-2"
    >
      Write a prescription
    </v-stepper-step>

    <v-stepper-content step="2">
        <div
        class="mx-auto"
        max-width="1000"
        tile
    >
        <v-list>
        <v-subheader>Prescription items</v-subheader>
        <v-btn plain
        @click.stop="dialog = true"
        >
            <v-icon color="indigo lighten-2">mdi-plus-circle-outline</v-icon>
        </v-btn>
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
        
            <v-list-item
            v-for="(item, i) in items"
            :key="i"
            >
            <v-list-item-icon color="indigo lighten-2">
                <v-icon>mdi-pill</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                <v-list-item-title v-text="item.medicine"></v-list-item-title>
                </v-col>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                <v-text-field type="number" :min="1" v-model="item.quantity"></v-text-field>
                </v-col>
                <v-col
                cols="12"
                sm="6"
                md="3"
                >
                <v-btn plain @click="removeItem(item)">remove item</v-btn>
                </v-col>

            </v-list-item-content>
            </v-list-item>
        </v-list-item-group>
        </v-list>
    </div>
      <v-btn plain
      color="indigo lighten-2"
      @click="e6 -= 1">
        Previous
      </v-btn>
      <v-btn
        plain
        color="indigo lighten-1"
        @click="newAppointmentDialog = true"
      >
        Book another checkup
      </v-btn>
      <v-btn
        plain
        color="indigo lighten-1"
        @click="submit()"
      >
        Submit
      </v-btn>
      <v-btn color="indigo lighten-2" plain>
        <router-link to="/dermatologist" class="cancel-btn" color="indigo lighten-2">
        Cancel
        </router-link>
      </v-btn>
    </v-stepper-content>

    
  </v-stepper>


  <v-row justify="center">
    <v-dialog
      v-model="newAppointmentDialog"
      persistent
      max-width="1000px"
    >
      
      <v-card>
        <v-card-title>
          <span class="headline">Book another counseling!</span>
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
          <v-btn
            plain
            @click="newAppointmentDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  
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
        e6: 1,
        e7: null,
        e8: null,
        patientEmail: null,
        from: null,
        report: null,
        medicineInput: null,
        quantityInput: 0,
        dialog: false,
        selectedItem: 1,
        medicineItems: [],
        items: [],
        snackbar: false,
        snackbarText: null,
        vertical: false,
        therapyDurationInput: 0,
        itemAvailable: false,
        pharmacyId: null,
        newAppointmentDialog: false,
        dateAvailable: false,
        priceInput: null,
        datePicker: null,
        disabledDates: {
          to: new Date(Date.now() - 8640000)
        },
      }
      
    },
    mounted(){
        this.patientEmail = this.$route.query.patientEmail;
        this.patientEmail = this.patientEmail.replace(/\s/g, '+');
        this.from = this.$route.query.from;
        this.pharmacyId = this.$route.query.pharmacy;
        console.log(this.$route.query.pharmacy);
        console.log(this.from);
        client({
            method: 'GET',
            url: 'medicine/all'
        })
        .then((response) => {
            // for(const medicine of response.data){
            //     this.medicineItems.push({
            //         name: medicine.name
            //         })
            // }
            this.medicineItems = response.data;
        })
    },

    methods: {
        addPrescriptionItem: function(){
            this.items.push({
                medicine: this.medicineInput,
                quantity: this.quantityInput,
                therapyDuration: this.therapyDurationInput,
            })
            this.medicineInput = null;
            this.quantityInput = 0;
            this.therapyDurationInput = 0;
        },
        removeItem: function(toRemove){
            const backup = this.items;
            this.items = [];
            for(var item of backup){
                if(!(item.text === toRemove.text && item.quantity === toRemove.quantity)){
                    this.items.push(item);
                }
            }
            
            
        },

        testAvailability: function(){
          client({
            url: 'medicine/check-availability/' + this.medicineInput + '&&' + this.quantityInput + '&&' + this.pharmacyId,
            method: 'GET'
          })
          .then((response) => {
            this.itemAvailable = response.data;
          })
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

        bookAppointment: function(){
          var x = (new Date()).getTimezoneOffset() * 60000; 
          client({
            url: 'appointment/book-new-appointment',
            method: 'POST',
            data: {
              patientEmail: this.patientEmail,
              from: (new Date(new Date(this.datePicker + ' ' + this.e7) - x)).toISOString().slice(0,-1),
              to: (new Date(new Date(this.datePicker + ' ' + this.e8) - x)).toISOString().slice(0,-1),
              pharmacyId: this.pharmacyId,
              price: this.priceInput
            },
          })
          .then((response) => {
            if(response.data){
              this.snackbar = true;
              this.snackbarText = response.data;
              this.newAppointmentDialog = false;
            }
          })
        },

        submit: function(){
            this.e6 = 3;
            var x = (new Date()).getTimezoneOffset() * 60000; 
            this.from = (new Date(new Date(this.from) - x)).toISOString().slice(0,-1);
            client({
                method: 'POST',
                url: 'checkup/finish-checkup',
                data: {
                    prescriptionItems: this.items,
                    report: this.report,
                    patientEmail: this.patientEmail,
                    from: this.from.substring(0, this.from.length - 1),
                }
            })
            .then((response) => {
                if(response.data === 'Successfully finished checkup!'){
                    setTimeout(() => { this.$router.push({path: '/dermatologist'})}, 2000);
                }
                this.snackbar = true;
                this.snackbarText = response.data;
            })
        }
    },
  }
</script>

<style scoped>
    .main-container{
        margin: 5%;
    }
    .cancel-btn{
        text-decoration: none;
    }
</style>