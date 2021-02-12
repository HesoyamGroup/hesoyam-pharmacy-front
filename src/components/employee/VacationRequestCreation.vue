<template >
<div>
    <v-row>    
      <v-card>
        <v-card-title class="title">
          <!-- <span class="headline">Submit a vacation request!</span> -->
          <h1>Submit a vacation request!</h1>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="2"
                sm="6"
                md="4"
                title="From"
                class="calendar"
              >
                <h1>From</h1>
                <v-date-picker v-model="datePickerFrom"
                color="indigo lighten-2"
                no-title></v-date-picker>

              </v-col>
              
            
              <v-col
                cols="2"
                sm="6"
                md="4"
                title="To"
              >
              <h1>To</h1>
               <v-date-picker v-model="datePickerTo"
                color="indigo lighten-2"
                no-title></v-date-picker>

              </v-col>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="indigo lighten-1"
            plain
            @click="submitRequest()"
          >
            Submit
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
    data: function() {
        return{
            snackbar: false,
            snackbarText: null,
            datePickerFrom: null,
            datePickerTo: null,
            e7: null,
            e8: null,
        }
    },
    methods:{
        submitRequest: function(){
            client({
               url: 'vacation-request/create-request',
               method: 'POST',
               data: {
                    from: new Date(this.datePickerFrom).toISOString().substring(0, 16),
                    to: new Date(this.datePickerTo).toISOString().substring(0, 16)
               },
            })
            .then((request) => {
              if(response.data){
                this.snackbar = true;
                this.snackbarText = response.data;
              }
            })
        },
    }
}
</script>
<style scoped>
    .calendar{
        margin-right: 10%;
    }
    h1{
        justify-content: center;
        color: grey;
    }
    .title{
      justify-content: center;
    }
</style>