<template>
        <div>
        <v-card>
            <v-card-title>Inventory</v-card-title>
     
            <v-data-table
            :headers="itemHeaders"
            :items="items"
            item-key="id"
            show-expand
            :expanded.sync="expanded"
            class="elevation-1 ma-5">

            <template v-slot:item.actions="{item}">
                <v-btn @click="remove(item)" :disabled="item.reserved > 0" color="red" dark>Remove</v-btn>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <div>
                        <inventory-item-price-list :inventory-item="item"></inventory-item-price-list>
                    </div>
                </td>
            </template>

            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import {client} from '@/client/axiosClient';
import InventoryItemPriceList from '@/components/pharmacy/InventoryItemPriceList.vue';

//Props:
//      value - pharmacy dto
export default {
    name: 'PharmacyInventory',
    props: ['value'],
    components:{
        InventoryItemPriceList
    },
    data: function(){
        return{
            items: [],
            itemHeaders: [
                {
                    text: 'Medicine',
                    value: 'medicineName'
                },
                {
                    text: 'Available',
                    value: 'available'
                },
                {
                    text: 'Reserved',
                    value: 'reserved'
                },
                {
                    text: 'Remove',
                    value: 'actions',
                    sortable: false
                },
                {
                    text: 'Price List',
                    value: 'data-table-expand'
                }
            ],
            expanded: []
        }
    },
    mounted(){
        this.fetchInventoryItems();
    },
    methods: {
        fetchInventoryItems(){
            let pharmacyId = this.$route.params.id;
            client({
                method: 'GET',
                url: '/inventory-item/pharmacy/' + pharmacyId
            }).then((response) => {
                let iitems = response.data;

                for(let iitem of iitems){
                    for(let p of iitem.prices){
                        p.range.from = this.fixDate(p.range.from);
                        p.range.to = this.fixDate(p.range.to);
                    }
                }

                this.items = iitems;
            }, (error) => {});
        },
        remove(item){
            client({
                method: 'DELETE',
                url: '/inventory-item/' + item.id
            }).then((response) => {
                alert('Inventory item successfully removed');
                let index = this.items.findIndex(i => i.id == item.id);
                this.items.splice(index, 1);
            })
        },
        fixDate(date){
            return new Date(date[0] + '-' + date[1] + '-' + date[2]).toISOString().substring(0, 10);
        }
    },
    computed: {
        localPharmacy(){
            return this.value ? this.value : {}
        }
    }
}
</script>