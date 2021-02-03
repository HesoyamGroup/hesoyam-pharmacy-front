<template>
<div>
    <v-card class="ma-3">
        <v-card-title>Add free appointment</v-card-title>
        <v-card-text>
            <v-form>
                <v-datetime-picker v-model="newFrom" label="From">
                    <template v-slot:dateIcon><v-icon>mdi-calendar</v-icon></template>
                    <template v-slot:timeIcon><v-icon>mdi-clock-outline</v-icon></template>
                </v-datetime-picker>
                <v-text-field label="Duration (min)" v-model="newDuration" required></v-text-field>
                <v-text-field label="Price" v-model="newPrice" required></v-text-field>
                <v-btn @click="addFreeAppointment()" class="ml-auto" :disabled="!formValid">Add</v-btn>
            </v-form>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
    </v-card>
</div>
    
</template>

<script>
import {client} from '@/client/axiosClient'

export default {
    name: 'FreeAppointmentInput',
    data: function(){
        return {
            newFrom: null,
            newDuration: null,
            newPrice: null

        }
    },
    methods:{
        addFreeAppointment(){
            let offset = new Date(this.newFrom).getTimezoneOffset();
            let from = new Date(this.newFrom.getTime() - offset*60000);
            let to = new Date(from.getTime() + this.newDuration*60000);

            let fromStr = from.toISOString();
            let toStr = to.toISOString();
            let employeeId = this.$route.params.id;
            //alert(fromStr.substr(0, fromStr.length-1) + ' >>>> ' + toStr.substr(0, toStr.length-1));
            client({
                method: 'POST',
                url: '/checkup/free/dermatologist/' + employeeId,
                data:{
                    range:{
                        from: from.toISOString(),
                        to: to.toISOString()
                    },
                    price: this.newPrice
                }
            }).then((response) => {
                alert('Free appointment added!');
                this.$emit('free-appointment-added', response.data);
                this.newDuration = null;
                this.newPrice = null;
            }, (error) => {
                alert(error.response.data);
            })
        }
    },
    computed:{
        formValid(){
            return this.newFrom != '' && this.newDuration > 0 && this.newPrice > 0;
        }
    }
}
</script>