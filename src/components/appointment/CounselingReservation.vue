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
        </v-card>
    </v-container>
</div>
</template>

<script>
export default {
    name: 'CounselingReservation',
    data(){
        return{
            //date picker
            currentDate: null,
            selectedDate: null,
            //time picker
            selectedTime: null,
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
            console.log(this.selectedDate+" ------- "+this.selectedTime)
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
</style>