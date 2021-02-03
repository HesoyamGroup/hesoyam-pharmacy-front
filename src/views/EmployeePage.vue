<template>
    <v-card class="ma-5" flat>
        <v-card-title>
            <v-progress-circular :rotate="-90" :size="50" :value="employee.rating * 20" :color="getColor(employee.rating)">
                {{ employee.rating }}
            </v-progress-circular>
            <div class="ml-3">
                {{ employee.firstName }} {{ employee.lastName }}
            </div>
            <v-card-subtitle>{{employee.role}}</v-card-subtitle>
        </v-card-title>

        <v-row>
            <v-col>
                <free-appointment-input v-if="isDermatologist"></free-appointment-input>
            </v-col>
            <v-col>
                <v-card class="ma-3">
                    <v-card-title>Free appointments</v-card-title>
                    <v-data-table
                    :headers="headers"
                    :items="freeAppointments"
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
            </v-col>
        </v-row>

    </v-card>
</template>

<script>
import * as UserService from '@/service/UserService'
import * as DateFormatter from '@/utils/DateFormatter'
import {client} from '@/client/axiosClient'
import FreeAppointmentInput from '../components/appointment/FreeAppointmentInput.vue'

export default {
    name: 'EmployeePage',
    components:{
        FreeAppointmentInput
    },
    data: function(){
        return {
            employeeId: 0,
            userRole: '',
            employee: {},
            freeAppointments: [],
            
        }
    },
    created(){
        this.employeeId = this.$route.params.id;
        this.userRole = UserService._getUserRole();
        this.fetchEmployee();
    },
    mounted(){
    },
    methods:{
        fetchEmployee(){
            client({
                method: 'GET',
                url: '/employee/' + this.employeeId
            }).then((response) => {
                this.employee = response.data;
            }, (error) => {
                alert('Employee not found');
            });
            client({
                method: 'GET',
                url: '/checkup/free/dermatologist/' + this.employeeId
            }).then((response) => {
                this.freeAppointments = response.data;
                for(let appointment of this.freeAppointments){
                    appointment.range.from = DateFormatter.toJavascriptDateTime(appointment.range.from);
                    appointment.range.to = DateFormatter.toJavascriptDateTime(appointment.range.to);
                }
            })
        },
        addAppointment(appointment){
            this.freeAppointments.push(appointment);
        },
        getColor(rating){
            if(rating >= 4) return 'green';
            else if(rating >= 2) return 'orange';
            else return 'red';
        }
    },
    computed:{
        isDermatologist(){
            return (this.employee ? this.employee.role : '') == 'DERMATOLOGIST';
        },
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