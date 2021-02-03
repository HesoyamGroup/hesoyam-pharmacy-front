<template>
    <div>
        <v-row>
            <v-col>
                <v-list-item-title>{{employee.firstName}} {{employee.lastName}}</v-list-item-title>
            </v-col>
            <v-col>
                <v-btn :to="'/' + type + '/' + employee.id"><v-icon>mdi-account</v-icon></v-btn>
            </v-col>
            <v-col v-if="type == 'dermatologist'">
                <v-btn @click.stop="dialog = true">Free appointments</v-btn>
                <v-dialog v-model="dialog" class="ui-dialog" hide-overlay>
                    <free-appointment-picker :appointments="freeAppointments"></free-appointment-picker>
                </v-dialog>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import * as DateFormatter from '@/utils/DateFormatter'
import {client} from '@/client/axiosClient'
import FreeAppointmentPicker from '../appointment/FreeAppointmentPicker.vue'


//Props
//      employee - EmployeeBasicDTO
//      type - {pharmacist, dermatologist}
export default {
    name: 'PharmacyEmployeeListItem',
    props: ['employee', 'type'],
    components:{
        FreeAppointmentPicker
    },
    data: function(){
        return{
            dialog: false,
            freeAppointments: []
        }
    },
    mounted(){
        this.fetchEmployeeFreeAppointmentsByPharmacy();
    },  
    methods:{
        fetchEmployeeFreeAppointmentsByPharmacy(){
            let pharmacyId = this.$route.params.id;
            client({
                method: 'GET',
                url: '/checkup/free/dermatologist/' + this.employee.id,
                params:{
                    pharmacy: pharmacyId
                }
            }).then((response) => {
                this.freeAppointments = response.data;
                for(let appointment of this.freeAppointments){
                    appointment.range.from = DateFormatter.toJavascriptDateTime(appointment.range.from);
                    appointment.range.to = DateFormatter.toJavascriptDateTime(appointment.range.to);
                }
            })
        }
    }
}
</script>

<style scoped>
    .ui-dialog { z-index: 1000 !important ;}
</style>