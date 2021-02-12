<template>
    <v-card flat class="ma-5">
        <v-card-title>Shifts</v-card-title>
        <v-card-text>
            <v-card-subtitle>Days when employee is at work</v-card-subtitle>
            <v-date-picker v-model="value.shiftRange" range></v-date-picker>
            <v-card-subtitle>Working hours</v-card-subtitle>
            <v-row justify="space-around" align="center">
                <v-col style="width: 350px; flex: 0 1 auto;">
                    <h2>Start:</h2>
                    <v-time-picker
                    v-model="value.shiftFrom"
                    :max="value.shiftTo"
                    ></v-time-picker>
                </v-col>
                <v-col style="width: 350px; flex: 0 1 auto;">
                    <h2>End:</h2>
                    <v-time-picker
                    v-model="value.shiftTo"
                    :min="value.shiftFrom"
                    ></v-time-picker>
                </v-col>
                </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'ShiftPicker',
    props:{
        value:{
            type: Object,
            required: true
        }
    },
    data: function(){
        return {

        }
    },
    computed:{
        shiftsValid(){
            return this.value.shiftRange.length == 2 && this.value.shiftFrom != '' && this.value.shiftTo != '';
        }
    },
    watch:{
        shiftsValid(newValue, oldValue){
            this.value.shiftsValid = newValue;
        }
    }
    
}
</script>