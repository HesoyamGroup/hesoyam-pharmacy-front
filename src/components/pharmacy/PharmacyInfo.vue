<template>
    <v-card>
        <v-card-title class="d-flex mb-3">
            <v-progress-circular :rotate="-90" :size="50" :value="value.rating * 20" color="teal">
                {{ value.rating }}
            </v-progress-circular>
            <div class="ml-2">
                {{value.name}}
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
        <v-card-subtitle>{{value.description}}</v-card-subtitle>

        <v-card-text>{{value.address.addressLine}}, {{value.address.city.cityName}}</v-card-text>
        <v-row>
            <v-col class="ma-5">
                <div id="pharmacyMap">
                    Ovde ide mapa Lat {{value.address.latitude}} Lon {{value.address.longitude}}
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import {client} from '@/client/axiosClient';

export default {
    props: ['value'],
    name: 'PharmacyInfo',
    data: function(){
        return {
            userRole: 'ROLE_ADMIN',
            userId: 15,
            subscribed: false

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

        }
    },
    computed:{
        isPatient: function(){
            return this.userRole == 'ROLE_PATIENT';
        }
    }
}
</script>