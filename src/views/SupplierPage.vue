<template> 
    <div id="supplier-page">  

        <v-container class="container">
            <v-row rows="6" class="row-1">
                <v-col>
                    <!--Edit user info-->
                    <SupplierChangeBasicInfo />
                </v-col>


                <v-col>
                    <StorageView :update="update"/>
                </v-col>
            </v-row>


            <v-row rows="6" class="row-2">
                <OfferManagement @myEvent="updateUpdate()"/>
            </v-row>
        </v-container>

    </div>
</template>


<script>
    import StorageView from '@/components/storage/StorageView.vue';
    import OfferManagement from '@/components/pharmacy/offers/OfferManagement.vue';
    import SupplierChangeBasicInfo from '@/components/users/SupplierChangeBasicInfo.vue';
    export default {
        name: 'supplier-page',
        components: {
            StorageView,
            OfferManagement,
            SupplierChangeBasicInfo
        },
        data(){
            return {
                update: false
            }
        },
        methods: {
            updateUpdate(){
                this.update = !this.update;
            }
        }
    }
</script>

<style scoped>
    .container{
        height: 1200px;
    }
    .row-1{
        height: 50%;
    }

    .row-2{
        height: 50%;
    }
</style>