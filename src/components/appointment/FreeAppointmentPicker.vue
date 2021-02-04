<template>
    <div>
        <v-card class="ma-3">
            <v-card-title>Free appointments</v-card-title>
            <v-data-table
            :headers="headers"
            :items="appointments"
            class="elevation-1"
            >
                <template v-slot:item.actions="{ item }">
                    <v-btn @click="reserveAppointment(item)">Reserve</v-btn>
                </template>

                <template v-slot:item.pharmacy="{ item }">
                    <v-btn :to="'/pharmacy/' + item.pharmacy.id">{{item.pharmacy.name}}</v-btn>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
//Props:
//      appointments: List<FreeCheckUpDTO>
import * as DateFormatter from '@/utils/DateFormatter'
import * as UserService from '@/service/UserService'
import {client} from '@/client/axiosClient'

export default {
    name: 'FreeAppointmentPicker',
    props: ['appointments'],
    data: function(){
        return{
            userRole: ''
        }
    },
    created(){
        this.userRole = UserService.getLoggedUserData().userRole;
    },
    mounted(){
    },
    methods:{
        //Param:
        //      appointment - FreeCheckUpDTO
        reserveAppointment(appointment){
            //TODO: 3.13
            alert('Appointment ' + appointment.id + ' is being reserved');
            appointment.range.from = appointment.range.from + ':00';
            appointment.range.to = appointment.range.to + ':00';
            console.log(appointment.range);
            client({
                method: 'POST',
                url: '/checkup/reserve',
                data:{
                    id: appointment.id,
                    range: null,
                    pharmacy: appointment.pharmacy,
                    price: appointment.price,
                    dermatologist: appointment.dermatologist
                }
            })
            .then((response) => {
                console.log('ok');
            }, (error) => {

            })
        }
    },
    computed:{
        isPatient(){
            return this.userRole == 'PATIENT';
        },
        isAdministrator(){
            return this.userRole == 'ADMINISTRATOR';
        },
        headers(){
            if(this.isPatient){
                return [
                        { text: 'Pharmacy', value: 'pharmacy' },
                        { text: 'From', value: 'range.from' },
                        { text: 'To', value: 'range.to' },
                        { text: 'Price', value: 'price' },
                        { text: '', value: 'actions', sortable: false}
                ]
            }
            else if(this.isAdministrator){
                return [
                        { text: 'Pharmacy', value: 'pharmacy' },
                        { text: 'From', value: 'range.from' },
                        { text: 'To', value: 'range.to' },
                        { text: 'Price', value: 'price' }
                ]
            }
        }
    }

}
</script>