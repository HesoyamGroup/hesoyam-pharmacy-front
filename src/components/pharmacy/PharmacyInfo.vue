<template>
    <v-card>
        <v-card-title class="d-flex mb-3">
            <v-progress-circular :rotate="-90" :size="50" :value="localPharmacy.rating * 20" :color="getColor(localPharmacy.rating)">
                {{ localPharmacy.rating }}
            </v-progress-circular>
            <div class="ml-2">
                {{localPharmacy.name}}
            </div>
            <template v-if="isPatient">
                <v-btn v-if="!subscribed"
                    color="primary"
                    elevation="2"
                    class="ml-auto"
                    @click="subscribe()"
                >Subscribe</v-btn>
                <v-btn v-if="subscribed"
                    color="red"
                    elevation="2"
                    class="ml-auto"
                    @click="unsubscribe()"
                >Unsubscribe</v-btn>
            </template>

        </v-card-title>
        <v-card-subtitle>{{localPharmacy.description}}</v-card-subtitle>

        <v-card-text>{{localPharmacy.address.addressLine}}, {{localPharmacy.address.city.cityName}}</v-card-text>
        <v-row>
            <v-col class="ma-5">
                <leaflet-map id="pharmacymap" mode="display" v-model="latlng" height="300" ></leaflet-map>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import {client} from '@/client/axiosClient';
import LeafletMap from '../location/LeafletMap.vue';

export default {
  components: { LeafletMap },
    props: ['value'],
    name: 'PharmacyInfo',
    data: function(){
        return {
            userRole: 'ROLE_ADMIN',
            userId: 15,
            subscribed: false,
            latlng: null

        }
    },
    mounted(){
        this.userRole = localStorage.getItem('user_role');

        if(this.isPatient){
            //TODO: load logged in user ID
            //client(...)

            let pharmacyId = this.$route.params.id;
            client({
                method: 'GET',
                url: 'patient/' + this.userId + '/subscribed/pharmacy/' + pharmacyId
            }).then((response) => {
                this.subscribed = response.data;
                console.log("Patient is subscribed: " + response.data);
            }, (error) => {});
        }
    },
    methods:{
        subscribe: function(){
            //TODO: 3.23 Subscribe
            //client(...)
            this.subscribed = true;
        },
        unsubscribe: function(){
            //TODO: 3.23 Unsubscribe
            //client(...)
            this.subscribed = false;

        },
        getColor(rating){
            if(rating >= 4) return 'green';
            else if(rating >= 2) return 'orange';
            else return 'red';
        }
    },
    computed:{
        localPharmacy: function(){
            if(this.value){
                this.latlng = {lat: this.value.address.latitude, lng: this.value.address.longitude};
                return this.value;
            }
            else{
                return {address: {city: {}}};
            }
        },
        isPatient: function(){
            return this.userRole == 'ROLE_PATIENT';
        },

    },

}
</script>