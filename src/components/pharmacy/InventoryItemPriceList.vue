<template>
    <div>
        <v-card>
            <v-card-title>
                <!-- Input -->
                    <v-row>
                        <v-col>
                            <v-text-field label="Price" v-model="newPrice"></v-text-field>
                        </v-col>
                        <v-col>
                            <v-menu
                                v-model="showMenu"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="dateRangeText"
                                        label="Dates"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                </template>

                                <v-date-picker
                                v-model="newDates"
                                range
                                ></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col>
                            <v-btn @click="addPriceItem">Add</v-btn>
                        </v-col>
                    </v-row>
            </v-card-title>
        
        <v-list dense>
            <v-subheader>Prices</v-subheader>
            <v-list-item-group color="primary">
                <v-list-item v-for="price in localInventoryItem.prices" :key="price.id">
                    <v-list-item-content>
                        <v-row>
                            <v-col>
                                <v-text-field label="Price" v-model="price.price" readonly></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field label="Valid from" prepend-icon="mdi-calendar" readonly v-model="price.range.from"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field label="Valid to" readonly v-model="price.range.to"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';

//Props
//      
export default {
    name: 'InventoryItemPriceList',
    props: ['inventoryItem'],
    data: function(){
        return{
            newPrice: 0,
            newDates: [],
            showMenu: false,


        }
    },
    mounted(){
    },
    methods:{
        addPriceItem(){
            client({
                method: 'POST',
                url: '/inventory-item/' + this.inventoryItem.id + '/price',
                data:{
                    price: this.newPrice,
                    range:{
                        from: new Date(this.newDates[0]).toISOString(),
                        to: new Date(this.newDates[1]).toISOString()
                    }
                }
            }).then((response) => {
                this.localInventoryItem.prices = response.data;
                for(let p of this.localInventoryItem.prices){
                    p.range.from = this.fixDate(p.range.from);
                    p.range.to = this.fixDate(p.range.to);
                }
                this.newDates = [];
                this.newPrice = 0;
            }, (error) => {
                alert('Conflicting dates');
            });
        },
        fixDate(date){
            return new Date(date[0] + '-' + date[1] + '-' + date[2]).toISOString().substring(0, 10);
        }
    },
    computed:{
        localInventoryItem(){
            return this.inventoryItem ? this.inventoryItem : {prices:[]};
        },
        dateRangeText(){
            return this.newDates.join(' ~ ');
        }
    }

}
</script>