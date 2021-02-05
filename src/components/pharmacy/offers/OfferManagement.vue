<template>
    <div class="offer-management">
        <v-container fluid fill-height>
            <v-row class="fill-height">
                <v-col>
                    <v-card :elevation="5" height="100%">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Offer management </v-toolbar-title>
                        </v-toolbar>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-card :elevation="0.3">
                                            <v-toolbar>
                                                <v-toolbar-title>Orders</v-toolbar-title>
                                            </v-toolbar>

                                            <v-card-text>
                                                <!--Current orders-->
                                                <v-data-table :items="orders" hide-default-footer disable-pagination>
                                                    <template v-slot:header="header">
                                                        <th>
                                                            Pharmacy
                                                        </th>

                                                        <th>
                                                            Deadline
                                                        </th>

                                                        <th>
                                                            Details
                                                        </th>

                                                        <th>
                                                            Give offer
                                                        </th>
                                                    </template>

                                                    <template v-slot:item="row">
                                                        <tr>
                                                            <td>
                                                                <v-layout justify-center>
                                                                    {{row.item.pharmacyName}}
                                                                </v-layout>
                                                            </td>   
                                                            <td>
                                                                <v-layout justify-center>
                                                                    {{localDateTimeToJSDate(row.item.deadLine) | prettyPrintDate}}
                                                                </v-layout>
                                                            </td>  
                                                            <td>
                                                                <v-layout justify-center>
                                                                    <v-btn icon color="primary" @click="selectOrder(row.item)">
                                                                        <v-icon>mdi-file-document</v-icon>
                                                                    </v-btn>
                                                                </v-layout>
                                                            </td>  
                                                            <td>
                                                                <v-layout justify-center>
                                                                    <v-btn dark color="primary" @click="createOfferOpenDialog(row.item)">
                                                                        Give offer
                                                                    </v-btn>        
                                                                </v-layout>
                                                            </td>  

                                                        </tr>
                                                    </template>

                                                    <template v-slot:footer="footer">
                                                        <v-container class="footer" >
                                                            <v-row justify="center">
                                                                        <v-btn :disabled="!canGoBackPagination" @click="decPage()">Prev</v-btn>
                                                                        <v-btn :disabled="!hasMorePagination" @click="incPage()">Next</v-btn>
                                                            </v-row>
                                                        </v-container>
                                                    </template>
                                                </v-data-table>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>


                                    <v-col fill-height>
                                        <!--My offers--> 
                                        <v-card height="100%">
                                            <v-toolbar>
                                                <v-toolbar-title> My offers </v-toolbar-title>
                                            </v-toolbar>

                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <v-col>
                                                            <v-layout justify-center>
                                                                    <v-text-field type="number" v-model="filter.minPrice" label="Minimum offer price"> </v-text-field>
                                                            </v-layout>
                                                            
                                                        </v-col>
                                                         <v-col>
                                                            <v-text-field v-model="filter.maxPrice" type="number" label="Maximum offer price"> </v-text-field>
                                                        </v-col>
                                                        <v-col>
                                                            <v-select v-model="filter.offerStatus" :items="filter.statuses" label="Offer status"> </v-select>
                                                        </v-col>
                                                        <v-spacer> </v-spacer>
                                                        <v-col cols="2">
                                                            <v-layout justify-center align-center>
                                                                <v-btn @click="resetFilter()">
                                                                    Clear
                                                                </v-btn>
                                                            </v-layout>
                                                        </v-col>

                                                        <v-col cols="2">
                                                            <v-btn color="primary" @click="refreshOffers()">
                                                                Filter
                                                            </v-btn>
                                                        </v-col>
                                                    </v-row>
                                                    <v-divider inset class="ma-3"></v-divider>
                                                    <v-row>
                                                        <v-data-table :items="offers" hide-default-footer disable-pagination>
                                                            <template v-slot:header="header">
                                                                <th>
                                                                    Id
                                                                </th>

                                                                <th>
                                                                    Delivery date
                                                                </th>

                                                                <th>
                                                                    Offer status
                                                                </th>

                                                                <th> 
                                                                    Total price
                                                                </th>

                                                                <th> 
                                                                    Order details
                                                                </th>

                                                                <th>
                                                                    Cancel
                                                                </th>
                                                            </template>

                                                            <template v-slot:item="row">
                                                                <tr>
                                                                    <td>
                                                                        <v-layout>
                                                                            {{row.item.id}}
                                                                        </v-layout>
                                                                    </td>
                                                                    <td>
                                                                        <v-layout>
                                                                            {{localDateTimeToJSDate(row.item.deliveryDate) | prettyPrintDate}}
                                                                        </v-layout>
                                                                    </td>
                                                                    <td>
                                                                        <v-layout>
                                                                            {{row.item.offerStatus}}
                                                                        </v-layout>
                                                                    </td>
                                                                    <td>
                                                                        <v-layout>
                                                                            {{row.item.totalPrice}}
                                                                        </v-layout>
                                                                    </td>
                                                                    <td>
                                                                        <v-layout>
                                                                            <v-btn color="primary" icon @click="viewOrderDetails(row.item.orderId)">
                                                                                <v-icon>mdi-file-document</v-icon>
                                                                            </v-btn>
                                                                        </v-layout>
                                                                    </td>
                                                                    <td>
                                                                        <v-layout>
                                                                            <v-btn :disabled="(new Date() > localDateTimeToJSDate(row.item.deliveryDate)) || row.item.offerStatus != 'CREATED'"  @click="cancelOffer(row.item.id)"color="red">Cancel</v-btn>
                                                                        </v-layout>
                                                                    </td>
                                                                </tr>
                                                            </template>

                                                            <template v-slot:footer="footer">
                                                                <v-container class="footer" >
                                                                    <v-row justify="center">
                                                                         <v-btn :disabled="!canGoBackOfferPagination" @click="decOfferPage()">Prev</v-btn>
                                                                         <v-btn :disabled="!hasMoreOfferPagination" @click="incOfferPage()">Next</v-btn>
                                                                    </v-row>
                                                                </v-container>
                                                            </template>
                                                        </v-data-table>
                                                    </v-row>
                                                </v-container>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>


        <!--View details about order-->
        <v-dialog v-model="showOrderDetails" max-width="500px" max-height="700px">
            <v-card>
                <v-toolbar>
                    <v-toolbar-title>
                        Order details
                    </v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-subheader v-if="selectedOrder">
                                     {{selectedOrder.pharmacyName}} order by deadline: {{localDateTimeToJSDate(selectedOrder.deadLine) | prettyPrintDate}}
                                </v-subheader>
                               
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-list disabled v-if="selectedOrder">
                                <v-subheader>Order items</v-subheader>
                                <v-list-item-group color="primary">
                                    <v-list-item v-for="(item, i) in selectedOrder.showOrderItemDTOS" :key="i">
                                    <v-list-item-icon>
                                        <v-icon v-text="item.icon"></v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                        <v-list-item-title>{{item | stringifyOrderItem}}</v-list-item-title>
                                    </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                                </v-list>

                        </v-row>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="gray" @click="closeOrderDialog()">Close</v-btn>
                </v-card-actions>

            </v-card>
        </v-dialog>


        <v-dialog v-model="createOfferDialog" v-if="createOfferOrder" max-width="400px" max-height="500px" persistent>
            <v-card>

                <v-toolbar dark color="primary">
                    <v-toolbar-title>Create offer</v-toolbar-title>
                </v-toolbar>


                <v-card-text>
                    <v-form v-model="isCreateOfferFormValid">
                        <v-container>
                            <v-row>
                                <v-text-field v-model="offerPrice" type="number" prepend-icon="mdi-currency-usd" :rules="rules.priceRules"> </v-text-field>
                            </v-row>

                            <v-row>
                            <v-menu
                                v-model="dateMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="deliveryDate"
                                    label="Picker without buttons"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker :rules="rules.deliveryDateRules"
                                v-model="deliveryDate"
                                @input="dateMenu = false"
                                :min="minDate"
                                :max="maxDate"
                                ></v-date-picker>
                            </v-menu>
                            </v-row>
                        </v-container>
                    </v-form>
                </v-card-text>


                <v-card-actions>
                    <v-spacer> </v-spacer>
                    <v-btn color="gray" @click="closeOffer()">Close</v-btn>
                    <v-btn color="primary" :disabled="!deliveryDate || !isCreateOfferFormValid" @click="submitOffer()">Submit</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="showErrorGrr" color="red"> {{ error }}</v-snackbar>

    </div>
</template>



<script>
    import {client} from '@/client/axiosClient';
    export default {
        name: 'offer-management',
        data(){
            return{
                filter: {
                    minPrice: null,
                    maxPrice: null,
                    offerStatus: null,
                    statuses: [
                        'CREATED',
                        'CANCELLED',
                        'ACCEPTED',
                        'REJECTED'
                    ]
                },
                orders: [],
                offers: [],
                offersPage: 1,
                offersMaxPerPage: 8,
                page: 1,
                maxPerPage: 6,
                showOrderDetails: false,
                selectedOrder: null,
                createOfferDialog: false,
                createOfferOrder: null,
                isCreateOfferFormValid: false,
                dateMenu:false,
                deliveryDate: null,
                minDate: (new Date()).toISOString(),
                maxDate: null,
                rules: {
                    priceRules: [
                        price => !!price || 'Price must be specified.',
                        price => (!isNaN(parseFloat(price)) && price >= 0)
                    ],
                    deliveryDateRules:[
                        date => !!date || 'Date must be selected.'
                    ]
                },
                offerPrice: 0,
                error: '',
                showErrorGrr: false
            }
        },
        mounted(){
            this.refreshOrders();
            this.refreshOffers();
        },
        methods: {
            resetFilter(){
                this.filter.minPrice = null;
                this.filter.maxPrice = null;
                this.filter.offerStatus = null;
                this.offersPage = 1;
                this.refreshOffers();
            },
            cancelOffer(id){
                client({
                    method: 'PUT',
                    url: `/offer/cancel/${id}`
                }).then((response) => {
                    this.refreshOffers();
                    this.$emit('myEvent');
                }, (error) => {
                    this.showError('You can\'t cancel that offer.');
                })
            },
            viewOrderDetails(id){
                client({
                    method: 'GET',
                    url: `/order/id/${id}`
                }).then((response) => {
                    this.selectOrder(response.data);
                }, (error) => {
                    this.showError('Couldn\'t retrieve order info.');
                });
            },
            refreshOffers(){
                client({
                    method: 'GET',
                    url: `/offer/my/?page=${this.offersPage}&${this.getRefreshOfferUrlParams()}`
                }).then( (response) => {
                    this.offers = response.data;
                    this.refreshOrders();
                }, (error) => {
                    this.showError('An error occured during retrieving your offers.');
                });

            },
            getRefreshOfferUrlParams(){
                let params = [];
                // minPrice: null,
                //     maxPrice: null,
                //     offerStatus: null,
                if(this.filter.minPrice){
                    params.push(`minPrice=${this.filter.minPrice}`);
                }
                if(this.filter.maxPrice){
                    params.push(`maxPrice=${this.filter.maxPrice}`);
                }
                if(this.filter.offerStatus){
                    params.push(`offerStatus=${this.filter.offerStatus}`);
                }
                return params.join('&');
            },
            closeOffer(){
                this.createOfferDialog = false;
                this.createOfferOrder = null;
                this.dateMenu = false;
                this.deliveryDate = null;
                this.maxDate = null;
                this.offerPrice = 0;
            },
            submitOffer(){
                client({
                    method: 'POST',
                    url: '/offer/create',
                    data:{
                        orderId: this.createOfferOrder.id,
                        totalPrice: this.offerPrice,
                        deliveryDate: (new Date(Date.parse(this.deliveryDate))).toISOString()
                    }
                }).then ((response) => {
                    this.closeOffer();
                    this.refreshOrders();
                    this.refreshOffers();
                    this.$emit('myEvent');
                }, (error) => {
                    this.showError('Make sure you got enough in your inventory!');
                });
            },
            createOfferOpenDialog(order){
                this.createOfferOrder = order;
                this.createOfferDialog = true;
                this.maxDate = this.localDateTimeToJSDate(order.deadLine).toISOString();
            },
            refreshOrders(){
                client({
                    method: 'GET',
                    url: `/order/active?page=${this.page}`
                }).then((response) => {
                    this.orders = response.data;
                }, (error) => {
                    this.showError('An error occured while trying to retrieve orders');
                })
            },
            selectOrder(order){
                this.selectedOrder = order;
                this.showOrderDetails = true;
            },
            closeOrderDialog(){
                this.showOrderDetails = false;
                this.selectedOrder = null;
            },
            incPage(){
                this.page += 1;
                this.refreshOrders();
            },
            decPage(){
                this.page -= 1;
                this.refreshOrders();
            },
            incOfferPage(){
                this.offersPage += 1;
                this.refreshOffers();
            },
            decOfferPage(){
                this.offersPage -= 1;
                this.refreshOffers();
            },
            localDateTimeToJSDate(datetimeArray){
                return new Date(datetimeArray[0], datetimeArray[1] -1, datetimeArray[2]);
            },
            JSDateToLocalDateTime(dateObj){
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                return [year, month, day, 0, 0 , 0];
            },
            showError(error){
                this.error = error;
                this.showErrorGrr = true;
                setTimeout(() => {
                    this.error = '';
                    this.showErrorGrr = false;
                }, 3000)
            },
            
        },
        computed: {
            hasMorePagination(){
                return this.orders.length >= this.maxPerPage;
            },
            canGoBackPagination(){
                return this.page > 1;
            },
            hasMoreOfferPagination(){
                return this.offers.length >= this.offersMaxPerPage;
            },
            canGoBackOfferPagination(){
                return this.offersPage > 1;
            }
        },
        filters:{
            stringifyOrderItem(orderItem){
                if (!orderItem) return '';
                return (orderItem.medicineName + ' ' + orderItem.quantity + ' units.')
            },
            prettyPrintDate(date){
                if(!date) return '';
                return date.toLocaleDateString("en-US");
            }
        }
    }

</script>


<style scoped>
    .offer-management{
        height:100%;
        width:100%;
    }
</style>