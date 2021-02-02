<template> 
    <div id="supplier-page">  

        <v-container class="container">
            <v-row rows="6" class="row-1">
                <v-col>
                    <!--Edit user info-->
                    Edit user info
                </v-col>


                <v-col>
                    <StorageView />
                </v-col>
            </v-row>


            <v-row rows="6" class="row-2">
                <!--Offers-->
                Offers
            </v-row>
        </v-container>

    </div>
</template>


<script>
    import StorageView from '@/components/storage/StorageView.vue';
    export default {
        name: 'supplier-page',
        components: {
            StorageView
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