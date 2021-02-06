<template>
<div class='counseling-reservation-component'>
    <v-container fluid fill-height class='spacing-playground pa-6 justify-center'>
        <v-card class='elevation-12 ma-4 flex-grow-1' shaped max-width="50%">
            <v-toolbar
            color='primary'
            dark>
                <v-card-title>Counseling Reservation</v-card-title>
            </v-toolbar>
            
            <v-card-actions class='justify-center'>
                <v-date-picker
                class='mr-6'
                v-model='selectedDate'
                color='primary'
                :min='currentDate'
                >
                </v-date-picker>
                <v-time-picker
                v-model='selectedTime'
                class='ml-6'
                format="24hr"
                >
                </v-time-picker>            
            </v-card-actions>
            <v-card-actions class='justify-center'>
                <v-btn
                v-if='selectedDate != null && selectedTime != null'
                color='primary'
                @click='searchFreeCounseling'>
                    Search
                </v-btn>
            </v-card-actions>
            <v-data-table
            v-if='showPharmaciesTable'
            :items='availablePharmacies'
            :headers='availablePharmaciesHeaders'
            :expanded.sync="expanded"
            :single-expand="singleExpand"
            show-expand
            no-data-text="No available counseling for this time and date!"
            item-key="id">
                <template v-slot:expanded-item="{headers, item}">
                    <td :colspan="headers.length">
                        <div class="row sp-details">
                            <div class="col-4 text-left ma-6">
                                <v-row>
                                    <h1>{{item.name}}</h1>
                                </v-row>
                                <v-row>
                                    <div>{{item.cityName}}, {{item.addressLine}}</div>
                                </v-row>
                                <v-row>
                                    <h3> Rating: {{item.rating}}/5.00 </h3>
                                </v-row>
                                <v-row>
                                    <v-divider
                                    ></v-divider>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <h3>Description:</h3>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <v-divider
                                    ></v-divider>
                                </v-row>
                                <v-row v-if='item.description'>
                                    <div>{{item.description}}</div>
                                </v-row>
                                <v-row class='justify-center'>
                                    <v-btn
                                    color='primary'
                                    class='ma-6'
                                    @click='pharmacistDialog'>
                                        See Pharmacists
                                    </v-btn>
                                </v-row>
                            </div>
                            <div class="col-7 text-right">
                                <v-row>
                                    <v-card id="leafletmap" class='justify-right flex-grow-1 ma-4'>
                                        <leaflet-map 
                                        id='bilostas' 
                                        mode="display" 
                                        height="250"
                                        width="250"
                                        v-model='item.pharmacyLocationDTO'
                                        >
                                        </leaflet-map>
                                    </v-card>
                                </v-row>
                            </div>
                        </div>
                    </td>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model='showPharmacistsDialog' class='ui-dialog' max-width="40%">
            <v-card shaped>
                <v-toolbar
                dark
                color='primary'>
                    <v-toolbar-title>Available Pharmacists</v-toolbar-title>
                </v-toolbar>
                <v-data-table
                v-model='selectedPharmacists'
                show-select
                :single-select='singleSelectPharmacist'
                :headers='pharmacistsHeaders'
                item-key="counselingId"
                :items='availablePharmacists'
                :items-per-page="5"
                return-object>
                </v-data-table>
                <v-card-actions class='justify-center'>
                    <v-btn
                    color='primary'
                    rounded
                    v-if='selectedPharmacists.length > 0'
                    @click='reserveCounceling'>
                        Reserve
                    </v-btn>    
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</div>
</template>

<script>

import {client} from '@/client/axiosClient';
import LeafletMap from '../location/LeafletMap.vue';
import * as DateFormatter from '@/utils/DateFormatter'

export default {
    components: {LeafletMap},
    name: 'CounselingReservation',
    data(){
        return{
            //date picker
            currentDate: null,
            selectedDate: null,
            //time picker
            selectedTime: null,
            //Pharmacies
            singleExpand: true,
            expanded: [],
            showPharmaciesTable: false,
            availablePharmacies: [],
            availablePharmaciesHeaders:[
                {text:'Pharmacy', value:'name'},
                {text:'Rating', value:'rating'},
                {text:'City', value:'cityName'},
            ],
            //pharmacists dialog
            showPharmacistsDialog: false,
            singleSelectPharmacist: true,
            pharmacistsHeaders:[
                {text:'Pharmacist', value:'pharmacistFullName'},
                {text:'Rating', value:'rating'},
                {text:'Time', value:'range.to'},
                {text:'Price', value:'price'}
            ],
            availablePharmacists: [],
            selectedPharmacists: []
        }
    },
    mounted(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        this.currentDate = yyyy+"-"+mm+"-"+dd;
        this.selectedDate = this.currentDate;
    },
    methods:{
        searchFreeCounseling: function()
        {
            console.log(this.selectedDate+" "+this.selectedTime)
            var param = this.selectedDate+' '+this.selectedTime
            this.expanded=[];
            client({
                method:'POST',
                url: 'counseling/free-pharmacies/patient',
                data:{
                    dateAndTime: param
                }
            })
            .then((response)=>{
                this.showPharmaciesTable = true
                this.availablePharmacies = response.data;
            })
        },
        pharmacistDialog: function()
        {
            this.showPharmacistsDialog = true;
            var param = this.selectedDate+' '+this.selectedTime
            client({
                method:'POST',
                url: 'counseling/free-pharmacists/patient',
                data:{
                    dateAndTime: param,
                    id: this.expanded[0].id
                }
            })
            .then((response) => {
                this.availablePharmacists = response.data;
                if(this.availablePharmacists.length > 0)
                {
                    for(let appointment of this.availablePharmacists)
                    {
                        appointment.range.to = DateFormatter.toAppointmentDateTime(appointment.range.from, appointment.range.to);
                    }
                }
            })
        },
        reserveCounceling: function()
        {
            console.log(this.selectedPharmacists);
            client({
                method:'POST',
                url:'counseling/reserve',
                data:{
                    id: this.selectedPharmacists[0].counselingId
                }
            })
            .then((response) => {
                for( var i = 0; i < this.availablePharmacists.length; i++){ 
                    if ( this.availablePharmacists[i].counselingId === response.data.id) 
                    { 
                        this.availablePharmacists.splice(i, 1);
                        break;
                    }
                }
                this.expanded = [];
                this.showPharmacistsDialog = false;
            })
        }
    }
}
</script>

<style scoped>
    .counseling-reservation-component{
        height: auto;
        display:flex;
        align-items: center;
    }
    .ui-dialog { z-index: 1000 !important ;}
</style>