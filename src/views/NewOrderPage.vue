<template>
    <v-card class="ma-5" flat>
        <v-card-title>
            <div>New order</div>
            <v-spacer></v-spacer>
            <v-datetime-picker v-model="deadLine" label="Deadline" :datePickerProps="{allowedDates: isUpcomingDate}">
                <template v-slot:dateIcon><v-icon>mdi-calendar</v-icon></template>
                <template v-slot:timeIcon><v-icon>mdi-clock-outline</v-icon></template>
            </v-datetime-picker>
            <v-btn @click="addOrder" color="primary" :disabled="!validOrder" class="ml-3">Add order</v-btn>
        </v-card-title>

        <v-card-text>
            <v-card flat>
                <v-card-title>Add order items</v-card-title>
                <v-card-subtitle>You should add at least one order item.</v-card-subtitle>
                <v-card-text class="d-flex justify-space-between">
                    <v-dialog v-model="showMedicines">
                        <v-data-table
                            v-model="selectedMedicine"
                            :headers="medicineHeaders"
                            :items="allMedicines"
                            single-select
                            item-key="id"
                            show-select
                            class="elevation-1">
                        </v-data-table>
                    </v-dialog>
                    <v-text-field @click.stop="showMedicines = true" label="Medicine" v-model="selectedMedicineName" readonly></v-text-field>
                    <v-text-field label="Quantity" v-model="quantity" class="ml-3 mr-3"></v-text-field>
                    <v-btn @click="addOrderItem" :disabled="!validOrderItem">Add</v-btn>
                </v-card-text>
            </v-card>
        </v-card-text>

        <v-card-text>
            <v-card v-for="(item, i) in orderItems" :key="i">
                <v-card-title>
                    <v-chip class="mr-2">{{item.quantity}}</v-chip>
                    <div>{{item.medicine.name}}</div>
                    <v-spacer></v-spacer>
                    <v-btn @click="removeItem(i)" color="red" dark>Remove</v-btn>
                </v-card-title>
            </v-card>
        </v-card-text>
    </v-card>
    
</template>

<script>
import {client} from '@/client/axiosClient'

export default {
    name: 'NewOrderPage',
    data: function(){
        return{
            deadLine: '',
            orderItems: [],

            allMedicines: [],
            addedMedicines: [],

            showMedicines: false,
            medicineHeaders:[
                {text: 'Name', value: 'name'},
                {text: 'Type', value: 'type'},
                {text: 'Manufacturer', value: 'manufacturerName'}
            ],

            selectedMedicine: [],
            quantity: ''
        }
    },
    mounted(){
        this.fetchMedicines();
    },
    methods:{
        fetchMedicines(){
            client({
                method: 'GET',
                url: '/medicine'
            }).then((response) => {
                this.allMedicines = response.data;
            }, (error) => {
                alert('Error getting list of all medicines.');
            })
        },
        addOrderItem(){
            let orderItem = {
                medicine: this.selectedMedicine[0],
                quantity: Math.floor(this.quantity)
            };
            this.orderItems.push(orderItem);
            this.pushMedicine(this.selectedMedicine[0]);

            this.resetNewOrderItem();
        },
        addOrder(){
            let orderItemsDTO = this.orderItems.map(item => {
                return {
                    medicineName: item.medicine.name,
                    medicineId: item.medicine.id,
                    quantity: item.quantity
                };
            });
            let offset = new Date(this.deadLine).getTimezoneOffset();
            let newDeadline = new Date(this.deadLine.getTime() - offset*60000).toISOString();
            let order = {
                deadLine: newDeadline,
                showOrderItemDTOS: orderItemsDTO
            };

            client({
                method: 'POST',
                url: '/order',
                data: order
            }).then((response) => {
                alert('New order saved!');
                this.resetOrder();
            }, (error) => {
                alert('Error occured while saving order');
            })
        },
        pushMedicine(medicine){
            let index = this.allMedicines.findIndex(i => i.id === medicine.id);
            if(index != -1){
                this.allMedicines.splice(index, 1);
                this.addedMedicines.push(medicine);
            }
        },
        popMedicine(medicine){
            let index = this.addedMedicines.findIndex(i => i.id === medicine.id);
            if(index != -1){
                this.addedMedicines.splice(index, 1);
                this.allMedicines.push(medicine);
            }
        },
        removeItem(index){
            this.popMedicine(this.orderItems[index].medicine);
            this.orderItems.splice(index, 1);
        },
        resetOrder(){
            //this.deadLine = null;
            this.resetNewOrderItem();
            this.orderItems = [];
            this.fetchMedicines();
        },
        resetNewOrderItem(){
            this.selectedMedicine = [];
            this.quantity = '';
        },
        isUpcomingDate(value){
            let now = new Date(Date.now());
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return new Date(value) >= today;
        },
    },
    computed:{
        selectedMedicineName(){
            return this.selectedMedicine.length == 0 ? '' : this.selectedMedicine[0].name;
        },
        validOrder(){
            return this.deadLine != '' && this.orderItems.length > 0;
        },
        validOrderItem(){
            return this.quantity > 0 && this.selectedMedicine.length == 1;
        }
    }

}
</script>