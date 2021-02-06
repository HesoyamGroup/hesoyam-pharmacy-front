<template>
    <v-card>
        <v-card-title>
            <v-btn :to="'/' + vacationRequest.employee.role.toLowerCase() + '/' + vacationRequest.employee.id" class="mr-2"><v-icon>mdi-account</v-icon></v-btn>
            {{vacationRequest.employee.firstName}} {{vacationRequest.employee.lastName}}
            <v-card-subtitle>{{vacationRequest.employee.role}}</v-card-subtitle>
            <v-spacer></v-spacer>

            <template v-if="vacationRequest.status == 'CREATED'">
                <v-btn color="green" @click="accept()" class="mr-2" dark>Accept</v-btn>
                <v-btn color="red" @click.stop="rejectDialog = true" dark>Reject</v-btn>
            </template>
            <v-chip color="red" v-if="vacationRequest.status == 'REJECTED'" dark>Rejected</v-chip>
            <v-chip color="green" v-if="vacationRequest.status == 'ACCEPTED'" dark>Accepted</v-chip>

            <v-dialog v-model="rejectDialog" max-width="500">
                <v-card>
                    <v-card-title>Reject</v-card-title>
                    <v-card-text>
                        <v-textarea placeholder="Reject reason" v-model="rejectReason" counter :rules="[rejectReasonRule]"></v-textarea>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="reject()" color="red" :dark="rejectionValid" :disabled="!rejectionValid">Reject</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-card-title>
        
        <v-card-text>
            {{vacationRequest.range.from}} ~ {{vacationRequest.range.to}}
        </v-card-text>
    </v-card>
</template>

<script>
import {client} from '@/client/axiosClient';
//Props
//      vacationRequest: VacationRequestDTO
export default {
    name: 'VacationRequestItem',
    props: ['vacationRequest'],
    data: function(){
        return {
            rejectDialog: false,
            rejectReason: '',
            rejectReasonLength: 300
        }
    },
    methods:{
        rejectReasonRule(value){
            return value.length <= this.rejectReasonLength ? true : 'Max ' + this.rejectReasonLength + ' characters'
        },
        accept(){
            client({
                method: 'PUT',
                url: '/vacation-request/accept/' + this.vacationRequest.id
            }).then((response) => {
                this.vacationRequest.status = 'ACCEPTED';
            }, (error) => {
                alert('Error during vacation accept');
            });
        },
        reject(){
            this.vacationRequest.rejectReason = this.rejectReason;
            client({
                method: 'PUT',
                url: '/vacation-request/reject',
                data: {
                    id: this.vacationRequest.id,
                    rejectReason: this.rejectReason
                }
            }).then((response) => {
                this.vacationRequest.status = 'REJECTED';
                this.rejectDialog = false;
            }, (error) => {
                alert('Error during vacation reject');
            });
        }
    },
    computed:{
        rejectionValid(){
            return this.rejectReason != '' && this.rejectReason.length <= this.rejectReasonLength;
        }
    }
}
</script>