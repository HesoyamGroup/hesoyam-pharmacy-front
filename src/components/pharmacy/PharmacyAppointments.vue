<template>
<div>
    <v-card>
        <v-card-actions class='justify-center'>
            <v-btn
            color='primary'
            @click='showDialogOfCheckups'>
                Dermatologist Appointments
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
            color='primary'>
                Pharmacist Appointments
            </v-btn>
            <v-dialog v-model='showCheckupDialog' class="ui-dialog" width="50%">
                <v-card>
                    <v-card-title>
                        All Appointments
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="searchChekup"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                    v-model='selectedCheckup'
                    :headers='checkupHeaders'
                    :items='freeCheckupAppointments'
                    :search="searchChekup"
                    :item-key='selectedCheckup.id'
                    show-select
                    :single-select='singleSelect'
                    return-object
                    >
                    </v-data-table>
                    <v-card-actions class='justify-center'>
                        <v-btn
                        color="primary"
                        @click="reserveCheckup"
                        v-if='selectedCheckup.length > 0'>
                            Reserve
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-card-actions>      
    </v-card>  
</div>
</template>

<script>
import * as DateFormatter from '@/utils/DateFormatter'
import {client} from '@/client/axiosClient';

export default {
    name: 'PharmacyAppointments',
    props: ['pharmacyId'],
    data: function(){
        return{
            showCheckupDialog: false,
            selectedCheckup: {},
            freeCheckupAppointments: [],
            checkupHeaders:[
                {text:'Dermatologist', value:'dermatologist.firstName'},
                {text:'Rating', value:'dermatologist.rating'},
                {text:'From', value:'range.from'},
                {text:'To', value:'range.to'},
                {text:'Price', value:'price'}
            ],
            searchChekup: '',
            singleSelect: true,
        }
    },
    mounted()
    {
        this.fetchFreeAppointmentsByPharmacy();
    },
    methods:{
        fetchFreeAppointmentsByPharmacy(){
            client({
            method: 'GET',
            url: 'checkup/free/pharmacy/'+this.pharmacyId,
            })
            .then((response) => {
                this.freeCheckupAppointments = response.data;
                if(this.freeCheckupAppointments.length > 0)
                {
                    for(let appointment of this.freeCheckupAppointments)
                    {
                        appointment.dermatologist.firstName = appointment.dermatologist.firstName+' '+appointment.dermatologist.lastName;
                        appointment.range.from = DateFormatter.toJavascriptDateTime(appointment.range.from);
                        appointment.range.to = DateFormatter.toJavascriptDateTime(appointment.range.to);
                    }
                }
                
            })
        },
        showDialogOfCheckups: function()
        {
            this.showCheckupDialog = true;
        },
        reserveCheckup: function()
        {
            client({
                method: 'POST',
                url: '/checkup/reserve',
                data:{
                    id: this.selectedCheckup[0].id,
                    range: null,
                    pharmacy: this.selectedCheckup[0].pharmacy,
                    price: this.selectedCheckup[0].price,
                    dermatologist: this.selectedCheckup[0].dermatologist
                }
            })
            .then((response) => {
                this.selectedCheckup = [];
                this.showDialogOfCheckups = false;
                for( var i = 0; i < this.freeCheckupAppointments.length; i++){ 
                    if ( this.freeCheckupAppointments[i].id === response.data.id) 
                    { 
                        this.freeCheckupAppointments.splice(i, 1);
                        break;
                    }
                }
            }, (error) => {

            })
        }
    }
}
</script>

<style scoped>
    .ui-dialog { z-index: 1000 !important ;}
</style>