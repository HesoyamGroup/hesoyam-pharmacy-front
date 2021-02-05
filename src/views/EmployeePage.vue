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

        <v-row v-if="employeeIsDermatologist">
            <v-col v-if="isAdministrator">
                <free-appointment-input></free-appointment-input>
            </v-col>
            <v-col>
                <free-appointment-picker :appointments="freeAppointments"></free-appointment-picker>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import * as UserService from '@/service/UserService'
import * as DateFormatter from '@/utils/DateFormatter'
import {client} from '@/client/axiosClient'
import FreeAppointmentInput from '../components/appointment/FreeAppointmentInput.vue'
import FreeAppointmentPicker from '../components/appointment/FreeAppointmentPicker.vue'

export default {
    name: 'EmployeePage',
    components:{
        FreeAppointmentInput,
        FreeAppointmentPicker
    },
    data: function(){
        return {
            employeeId: 0,
            userRole: '',
            employee: {},
            freeAppointments: []
        }
    },
    created(){
        this.employeeId = this.$route.params.id;
        this.userRole = UserService._getUserRole();
        this.fetchEmployee();
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
                url: '/checkup/free/dermatologist/' + this.employeeId,
                params:{
                    pharmacy: ''
                }
            }).then((response) => {
                this.freeAppointments = response.data;
                for(let appointment of this.freeAppointments){
                    appointment.range.from = DateFormatter.toJavascriptDateTime(appointment.range.from);
                    appointment.range.to = DateFormatter.toJavascriptDateTime(appointment.range.to);
                }
            })
        },
        getColor(rating){
            if(rating >= 4) return 'green';
            else if(rating >= 2) return 'orange';
            else return 'red';
        }
    },
    computed:{
        employeeIsDermatologist(){
            return (this.employee ? this.employee.role : '') == 'DERMATOLOGIST';
        },
        isAdministrator(){
            return this.userRole == 'ADMINISTRATOR';
        }
    }
}
</script>