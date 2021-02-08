<template>
    <v-card flat class="ma-5">
        <v-card-title>
            <div>Orders</div>
            <v-spacer></v-spacer>
            <v-btn to="/order/new" dark color="green">New order</v-btn>
        </v-card-title>
        <v-card-text>
            <order v-for="order in orders" :key="order.id" :order="order" @order-deleted="deleteOrder" :adminId="admin.id" class="mb-2"></order>
        </v-card-text>
    </v-card>
</template>

<script>
import {client} from '@/client/axiosClient'
import * as DateFormatter from '@/utils/DateFormatter'
import Order from '../components/pharmacy/Order.vue';
export default {
    components: { Order },
    name: 'OrdersPage',
    data: function(){
        return {
            orders: [],
            admin: {},
            ordersKey: 0
        }
    },
    created(){
        client({
            method: 'GET',
            url: '/profile/user-information'
        }).then((response) => {
            this.admin = response.data;
        });
    },
    mounted(){
        this.fetchOrders();
    },
    methods:{
        fetchOrders(){
            client({
                method: 'GET',
                url: '/order'
            }).then((response) => {
                this.orders = response.data;
                for(let order of this.orders){
                    this.fixOrderDate(order);
                }
            })
        },
        fixOrderDate(order){
            order.deadline = DateFormatter.toJavascriptDateTime(order.deadline);
            for(let offer of order.offers){
                this.fixOfferDate(offer);
            }
        },
        fixOfferDate(offer){
            offer.deliveryDate = DateFormatter.toJavascriptDateTime(offer.deliveryDate);
        },
        deleteOrder(order){
            let index = this.orders.findIndex(ord => ord.id === order.id);
            if(index != -1)
                this.orders.splice(index, 1);
        }
    }
}
</script>