<template>
    <div>
        <leaflet-map id="locatormap" mode="input" v-model="latlng" height="300"></leaflet-map>
    </div>
</template>

<script>
import cyrillic2latin from '@/utils/CyrillicTranscript.js';
import LeafletMap from './LeafletMap.vue';
import {client} from '@/client/axiosClient';

// Usage:
//      <locator v-model="address"></locator>
//
//      address is an object defined by attributes as in setAddress method below
export default {
    name: 'Locator',
    props: ['value'],
    components:{
        LeafletMap
    },
    data: function(){
        return {
            latlng: null,
        }
    },
    methods:{
        geolocate(latlng){
            client({
                method: 'GET',
                url: 'https://us1.locationiq.com/v1/reverse.php?key=d9ed4cd3090a09&lat=' + latlng.lat + '&lon=' + latlng.lng + '&format=json'
            }).then((response) => {
                this.setAddress(response.data.address);
            }, (error) => {

            });
        },
        setAddress(geoAddress){
            let addressLine = cyrillic2latin(geoAddress.road) + (geoAddress.house_number ? (' ' + cyrillic2latin(geoAddress.house_number)) : '');
            let city = cyrillic2latin(geoAddress.city_district ? geoAddress.city_district : geoAddress.city);
            //let postalCode = cyrillic2latin(geoAddress.postcode);
            let country = cyrillic2latin(geoAddress.country);
            let countryCode = cyrillic2latin(geoAddress.country_code);

            //TODO query database for exact city, city ID, country...
            //Note: In bigger cities (eg. Belgrade) sometimes the city name would be Vracar Municipality or City of Belgrade
            let address = {
                addressLine: addressLine,
                city: {
                    cityName: city
                },
                country:{
                    countryName: country,
                    countryCode: countryCode
                }
            }

            this.$emit('input', address);
        }
    },
    watch:{
        latlng(newLatlng, oldLatlng){
            if(newLatlng){
                this.geolocate(newLatlng)
            }
        }
    },

}
</script>