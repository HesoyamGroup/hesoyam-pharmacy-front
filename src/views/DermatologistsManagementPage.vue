<template>
    <div class="dermatologists-management">
        <v-card flat class="ma-5">
            <v-card-title>
                <div>Dermatologists Management</div>
                <v-spacer></v-spacer>
                <v-btn @click="addDermatologist" color="green" :dark="isValid" :disabled="!isValid">Add to my pharmacy</v-btn>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col>
                        <v-card class="ma-5">
                            <v-card-title>Select a dermatologist</v-card-title>
                            <v-card-text v-if="dermatologists.length > 0">
                                     <v-list dense>
                                        <v-list-item-group
                                            v-model="selectedDermatologist"
                                            color="primary"
                                        >
                                            <v-list-item
                                            v-for="dermatologist in dermatologists"
                                            :key="dermatologist.id"
                                            >
                                                <v-list-item-content>
                                                    <v-list-item-title>{{dermatologist.firstName}} {{dermatologist.lastName}}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                            </v-card-text>
                            <v-card-text v-else>There are no dermatologists not working at your pharmacy.</v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card class="ma-5">
                            <v-card-title>Define dermatologist shift</v-card-title>
                            <shift-picker v-model="shifts"></shift-picker>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import ShiftPicker from '@/components/employee/ShiftPicker.vue'
import {client} from '@/client/axiosClient'
export default {
    name: 'DermatologistsManagementPage',
    components:{
        ShiftPicker
    },
    data: function(){
        return{
            dermatologists: [],
            selectedDermatologist: null,
            shifts: {
                shiftRange: [],
                shiftFrom: '',
                shiftTo: '',
                shiftsValid: false
            }
        }
    },
    mounted(){
        this.fetchUnSortedDermatologists();
    },
    methods:{
        fetchUnSortedDermatologists(){
            client({
                method: 'GET',
                url: '/dermatologist/unsorted'
            }).then((response) => {
                this.dermatologists = response.data;
            })
        },
        addDermatologist(){
            let dermatologist = this.dermatologists[this.selectedDermatologist];

            client({
                method: 'PUT',
                url: '/dermatologist/add-to-my-pharmacy',
                data:{
                    id: dermatologist.id,
                    shiftRange: {
                        from: new Date(this.shifts.shiftRange[0]).toISOString(),
                        to: new Date(this.shifts.shiftRange[1]).toISOString()
                    },
                    shiftFrom: this.shifts.shiftFrom,
                    shiftTo: this.shifts.shiftTo
                }
            }).then((response) => {
                alert("Dermatologist added successfully");
                this.clearForm();
            }, (error) => {
                switch(error.response.status){
                    case 404: alert('Selected dermatologist cannot be found.'); break;
                    case 409: alert('Shift period is already taken'); break;
                    case 400: alert('Dermatologist is already added to the pharmacy'); break;
                }
            });
        },
        clearForm(){
            this.dermatologists.splice(this.selectedDermatologist, 1);
            this.selectedDermatologist = null;
            this.shifts = {
                shiftRange: [],
                shiftFrom: '',
                shiftTo: '',
                shiftsValid: false
            }
        }
    },
    computed:{
        isValid(){
            return this.selectedDermatologist != null && this.shifts.shiftsValid;
        }
    }
}
</script>