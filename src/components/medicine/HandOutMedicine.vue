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
        <v-btn @click="searchQuery()" class="btn"><v-icon color="indigo lighten-1">mdi-magnify</v-icon></v-btn>
        <v-btn @click="resetList()" class="btn"><v-icon color = "indigo lighten-1">mdi-refresh</v-icon></v-btn>
        <br>
        <br>
        </v-row>
        <!-- <v-btn icon='mdi-search'></v-btn> -->
    <!-- </v-row> -->
    
        <div v-if="resultFound" class="inner-card">
        <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="374"
    >
        <template slot="progress">
        <v-progress-linear
            color="deep-purple"
            height="10"
            indeterminate
        ></v-progress-linear>
        </template>

        <v-card-title>Reservation #{{reservationFixed.code}}</v-card-title>

        <v-card-text>

        <div class="my-4 subtitle-1">
            {{reservationFixed.medicineReservationStatus}}
        </div>

        <div v-for="item of reservationFixed.medicineReservationItems" :key="item.code">
            {{item.quantity}}x{{item.medicineName}}
        </div>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-subtitle
        v-if="reservationFixed.valid === true"
        >{{reservationFixed.patientFirstName}} {{reservationFixed.patientLastName}} • {{reservationFixed.fixedDate}}</v-card-subtitle>
        <v-card-subtitle
        v-if="reservationFixed.valid === false"
        color="error"
        >{{reservationFixed.patientFirstName}} {{reservationFixed.patientLastName}} • {{reservationFixed.fixedDate}}</v-card-subtitle>

        <v-card-actions>
        <v-btn
            color="indigo lighten-1"
            text
            @click="confirm"
        >
            Confirm
        </v-btn>
        <v-btn
            color="error"
            text
            @click="cancel"
            v-if="reservationFixed.valid === true"
        >
            Cancel
        </v-btn>

        </v-card-actions>
    </v-card>
    </div>
    <br>
    </v-card>



    <!-- <v-list-item two-line>
        <v-list-item-content>
            <v-list-item-title></v-list-item-title>
            <v-list-item-subtitle></v-list-item-subtitle>
        </v-list-item-content>
        </v-list-item>  
    </v-card> -->

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
                reservation: null,
                reservationFixed: null,
                reservationItems: [],
                query: '',
                snackbarText: '',
                snackbar: false,
                vertical: false,
                loading: false,
                selection: 1,
                resultFound: false,
            }
        },
        
    mounted(){      

    },

    methods:{
        toDate: function(array){
            return array[0] + "-" +array[1] + "-" + array[2];
        },

        searchQuery: function(){
            var link = 'medicine-reservation/pickup/' + this.query;
            client({
                method: 'GET',
                url: link
            })
            .then((response) => {
                if(response.data){
                    console.log(response.data);
                    this.resultFound = true;
                    var reservation = response.data;
                    reservation.fixedDate = this.toDate(response.data.pickUpDate);
                    this.reservationFixed = reservation;
                } else {
                    this.snackbarText = "No reservation found for the entered code!";
                    this.snackbar = true;
                }
            })
        },
        resetList: function(){
            this.resultFound = false;
            this.reservationFixed = null;
        },
        confirm () {
            console.log(this.reservationFixed);
            this.loading = true

            setTimeout(() => (this.loading = false), 2000)
            const code = this.reservationFixed.code;
            client({
                method: 'POST',
                url: 'medicine-reservation/confirm-pickup',
                data: {
                        reservationCode: code
                    }
            })
            .then((response) => {
                if(response.data){
                    this.snackbarText = "Successfully confirmed!";
                    this.snackbar = true;
                    this.resetList();
                }
            })
      },
        cancel () {
            this.loading = true
            const code = this.reservationFixed.code;

            setTimeout(() => (this.loading = false), 2000)
            client({
                method: 'POST',
                url: 'medicine-reservation/cancel-pickup',
                data: {
                    reservationCode: code
                }
            })
            .then((response) => {
                if(response.data){
                    this.snackbarText = "Successfully cancelled!";
                    this.snackbar = true;
                    this.resetList();
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
    /* .inner-card{
        margin: 5%;
    } */

</style>