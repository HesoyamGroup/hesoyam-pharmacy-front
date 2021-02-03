<template>
    <div>
        <v-card class="ma-3">
            <v-card-title>Free appointments</v-card-title>
            <v-data-table
            :headers="headers"
            :items="appointments"
            class="elevation-1"
            >
                <template v-slot:item.reserve="{ item }">
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
//      employee-id: Long
import * as UserService from '@/service/UserService'

export default {
    name: 'FreeAppointmentPicker',
    props: ['appointments', 'employee-id'],
    data: function(){
        return{
            userRole: '',
            //employee: {}
        }
    },
    created(){
        this.userRole = UserService.getLoggedUserData().userRole;
    },
    mounted(){

    },
    methods:{

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
                        { text: '', value: 'reserve', sortable: false}
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