<template>
    <v-card>
        <v-card-title>
            <v-chip :color="getOrderStatusColor" class="mr-3">{{order.status}}</v-chip>
            <div>Order #{{order.id}}</div>
            <v-spacer></v-spacer>
            <v-menu
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                :disabled="isRead">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="order.deadline"
                        label="Deadline"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="order.deadline" :allowed-dates="isUpcomingDate"></v-date-picker>
            </v-menu>
            <v-btn @click="edit" v-if="canEdit" color="yellow" class="ml-2">Edit</v-btn>
            <v-btn @click="cancelEditing" v-if="isUpdate" class="ml-2">Cancel</v-btn>
            <v-btn @click="updateOrder" v-if="isUpdate" color="primary" :disabled="!isOrderValid" class="ml-2">Save</v-btn>
            <v-btn @click="deleteOrder" v-if="canDelete" color="red" class="ml-2">Delete</v-btn>
        </v-card-title>
        <v-card-text>
            <v-expansion-panels flat
                v-model="panel"
                multiple>
                <v-expansion-panel>
                    <v-expansion-panel-header>Order items</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="orderItem in order.orderItems" :key="orderItem.id" flat>
                            <v-card-text class="d-flex justify-space-between">
                                <v-text-field label="Medicine" v-model="orderItem.medicine.name" readonly></v-text-field>
                                <v-text-field label="Quantity" v-model="orderItem.quantity" class="ml-3 mr-3" readonly></v-text-field>
                            </v-card-text>
                        </v-card>  
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="hasOffers">
                    <v-expansion-panel-header>Offers</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="offer in order.offers" :key="offer.id" flat>
                            <v-card-title>
                                <div>{{offer.supplier.firstName}} {{offer.supplier.lastName}}</div>
                                <v-spacer></v-spacer>
                                <v-chip :color="offerStatusColor(offer.offerStatus)">{{offer.offerStatus}}</v-chip>
                                <v-btn @click="acceptOffer(offer)" v-if="canAcceptOffer(offer)" color="primary" class="ml-2">Accept</v-btn>
                            </v-card-title>
                            <v-card-text class="d-flex justify-space-between">
                                <v-text-field label="Delivery date" v-model="offer.deliveryDate" readonly></v-text-field>
                                <v-text-field label="Total price" v-model="offer.totalPrice" class="ml-3 mr-3" readonly></v-text-field>
                            </v-card-text>
                        </v-card>  
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import {client} from '@/client/axiosClient'
import * as DateFormatter from '@/utils/DateFormatter'
export default {
    name: 'Order',
    props: {
        order:{
            type: Object,
            required: true
        },
        adminId:{
            type: Number,
            required: true
        }
    },
    data: function(){
        return{
            mode: 'read',
            prevDeadline: null,
            currentDeadline: null,
            panel: []
        }
    },
    mounted(){
        this.currentDeadline = this.order.deadline;
    },
    methods:{
        isUpcomingDate(value){
            let now = new Date(Date.now());
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return new Date(value) >= today;
        },
        offerStatusColor(status){
            switch(status){
                case 'CREATED': return 'yellow';
                case 'CANCELLED': return 'gray';
                case 'ACCEPTED': return 'green';
                case 'REJECTED': return 'red';
            }
        },
        canAcceptOffer(offer){
            if(this.hasPermission && offer.offerStatus == 'CREATED' && this.order.status == 'CREATED' && this.deadlineIsPassed())
                return true;
            return false;
        },
        deadlineIsPassed(){
            let deadline = new Date(this.order.deadline);
            return deadline < new Date(Date.now());
        },
        edit(){
            this.mode = 'update';
            this.prevDeadline = this.order.deadline;
        },
        cancelEditing(){
            this.mode = 'read';
            this.order.deadline = this.prevDeadline;
        },
        acceptOffer(offer){
            client({
                method: 'PUT',
                url: '/offer/accept/' + offer.id
            }).then((response) => {
                this.order.status = 'ACCEPTED';
                this.order.offers = response.data;
                for(let offer of this.order.offers){
                    this.fixOfferDate(offer);
                }
                alert('Offer accepted');
            }, (error) => {
                switch(error.response.status){
                    case 400: alert('Error, selected offer cannot be accepted.'); break;
                    case 403: alert("Error, administrator doesn't have permission."); break;
                    default: alert('An unknown error occured'); break;
                }
            });
        },
        fixOfferDate(offer){
            offer.deliveryDate = DateFormatter.toJavascriptDateTime(offer.deliveryDate);
        },
        updateOrder(){
            let deadline = new Date(this.order.deadline).toISOString();
            client({
                method: 'PUT',
                url: '/order',
                data:{
                    id: this.order.id,
                    deadline: deadline
                }
            }).then((response) => {
                alert('Success');
                this.mode = 'read';
            }, (error) => {
                switch(error.response.status){
                    case 400: alert('Error, selected order has offers.'); break;
                    case 403: alert("Error, administrator doesn't have permission."); break;
                    case 409: alert('Error, selected date is not allowed'); break;
                    default: alert('An unknown error occured'); break;
                }
            })
        },
        deleteOrder(){
            client({
                method: 'DELETE',
                url: '/order/' + this.order.id
            }).then((response) => {
                alert('Order deleted');
                this.$emit('order-deleted', this.order);
            }, (error) => {
                switch(error.response.status){
                    case 400: alert('Error, selected order has offers.'); break;
                    case 403: alert("Error, administrator doesn't have permission."); break;
                    default: alert('An unknown error occured'); break;
                }
            })
        }
    },
    computed:{
        isRead(){
            return this.mode == 'read';
        },
        isUpdate(){
            return this.mode == 'update';
        },
        canEdit(){
            return this.isRead && this.hasPermission && !this.hasOffers;
        },
        canDelete(){
            return this.hasPermission && !this.hasOffers;
        },
        hasPermission(){
            return this.adminId == this.order.administrator.id;
        },
        hasOffers(){
            return this.order.offers.length > 0;
        },
        isOrderValid(){
            return this.order.deadline != '';
        },
        getOrderStatusColor(){
            switch(this.order.status){
                case 'CREATED': return 'green';
                case 'ACCEPTED': return 'primary';
            }
        }
    }

}
</script>