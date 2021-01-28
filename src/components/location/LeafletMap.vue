<template>
    <div>
    <div :id="mapid" v-bind:style="mapStyle">

    </div>
  
        <v-btn v-if="mode=='input' || mode == 'input-display'" class="mt-2" @click="locateMe" :loading="loading">
            <v-icon left >mdi-map-marker</v-icon>
            Locate me
        </v-btn>

</div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// props:
//      mode: [input, display, input-display]
//      value: Object{lat, lng}
//      height: map height in px
export default {
    name: 'LeafletMap',
    props: ['mode', 'value', 'height'],
    data: function(){
        return {
            map : {},
            popup : {},
            circle: undefined,
            icon: {},
            marker: undefined,
            popupMessage: "Apartment's location",
            loading: false,
            mapid: 'leafletmap'
        }
    },
    methods:{
        onMapReady:function(){
            const thismap = this.map;
            setTimeout(function(){thismap.invalidateSize(true);}, 0);
        },
        onMapClick : function(e) {
            this.changeLocation(e.latlng);
            this.removeCircle();
        },
        onLocationFound : function(e) {
            var radius = e.accuracy;

            this.removeCircle();
            this.circle = L.circle(e.latlng, radius).addTo(this.map);

            this.changeLocation(e.latlng);
            this.loading = false;
            this.map.stopLocate();
        },
        onLocationError : function(e) {
            this.map.stopLocate();
            this.loading = false;
            //pushErrorNotification("Geolocation error", "Please allow location access in your browser.");
        },
        locateMe : function(){
            this.loading = true;
            this.map.locate({setView: true, maxZoom: 16});
        },
        changeLocation : function(latlng){
            //this.value = latlng;
            this.$emit('input', latlng);
        },
        setMarker:function(latlng){
            if(this.marker != undefined){
                this.map.removeLayer(this.marker);
                this.marker = undefined;
            }
            this.marker = L.marker(latlng, {icon: this.icon}).addTo(this.map);
        },
        removeCircle(){
            if(this.circle != undefined){
                this.map.removeLayer(this.circle);
                this.circle = undefined;
            }
        }
    },
    mounted(){
        this.popup = L.popup({closeButton: false});
        this.icon = L.icon({
            iconUrl: '../marker.png',
            iconSize: [42, 42],
            iconAnchor: [12,42]
        });
        
        if(this.mode == "input"){
            this.map = L.map(this.mapid).setView([45.2009537, 20.5291344], 8);
        }
        else if(this.mode == 'display'){
            this.map = L.map(this.mapid, {closePopupOnClick : false, center:[this.latlng.lat, this.latlng.lng], zoom:15}).setView([this.latlng.lat, this.latlng.lng], 15);
            this.setMarker(this.latlng);
        }
        else{ // mode == 'input-display'
            this.map = L.map(this.mapid).setView([this.latlng.lat, this.latlng.lng], 15);
            this.setMarker(this.latlng);
        }

        this.map.whenReady(this.onMapReady);
        
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            minZoom: 1,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1Ijoia2dlcmcxMyIsImEiOiJja2RqZ2FzN2kwZWkyMzJxeGRreGMwa29iIn0.w0UuIKgvCBXBNKZzx4tobg'
        }).addTo(this.map);


        if(this.mode == 'input' || this.mode == 'input-display'){
            this.map.on('click', this.onMapClick);
            this.map.on('locationfound', this.onLocationFound);
            this.map.on('locationerror', this.onLocationError);
        }
    },
    watch: {
        value(newValue, oldValue){
            this.map.setView([newValue.lat, newValue.lng], this.map.getZoom());
            /*this.popup
                .setLatLng(newValue)
                .setContent(this.popupMessage)
                .openOn(this.map);*/
            this.setMarker(newValue);
        }
    },
    computed:{
        mapStyle:function(){
            return {"height" : this.height + "px"};
        },
        latlng: function(){
            return this.value ? this.value : {lat: 0, lng: 0};
        }
    }
    
}
</script>