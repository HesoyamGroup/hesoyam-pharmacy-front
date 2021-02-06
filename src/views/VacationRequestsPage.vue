<template>
    <v-card class="ma-5" flat>
        <v-card-title>Vacation Requests</v-card-title>

        <v-card-text v-if="vacationRequests.length > 0">
            <vacation-request-item v-for="vacationRequest in vacationRequests" :key="vacationRequest.id" :vacationRequest="vacationRequest" class="mb-2"></vacation-request-item>
        </v-card-text>
        <v-card-text v-else>There are no active vacation requests.</v-card-text>

    </v-card>
    
</template>

<script>
import {client} from '@/client/axiosClient';
import * as DateFormatter from '@/utils/DateFormatter'
import VacationRequestItem from '../components/employee/VacationRequestItem.vue';

export default {
    name: 'VacationRequestsPage',
    components:{
        VacationRequestItem
    },
    data: function(){
        return{
            vacationRequests: []
        }
    },
    mounted(){
        this.fetchNewRequests();
    },
    methods:{
        fetchNewRequests(){
            client({
                methods: 'GET',
                url: '/vacation-request/created'
            }).then((response) => {
                this.vacationRequests = response.data;
                for(let vacationRequest of this.vacationRequests){
                    this.fixDate(vacationRequest);
                }
            }, (error) => {});

        },
        fixDate(vacationRequest){
            vacationRequest.range.from = DateFormatter.toJavascriptDate(vacationRequest.range.from);
            vacationRequest.range.to = DateFormatter.toJavascriptDate(vacationRequest.range.to);
        }
    }
}
</script>