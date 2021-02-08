<template>
    <v-card>
        <v-card-title>
            <div>Pharmacy Revenue</div>
            <v-spacer></v-spacer>
            <v-menu
                v-model="showMenu"
                :nudge-right="40"
                :close-on-content-click="false"
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
                <v-date-picker v-model="dates" range :allowed-dates="pastDates"></v-date-picker>
            </v-menu>
            <v-btn @click="search" class="ml-3" :disabled="!datesValid">Search</v-btn>
        </v-card-title>
        
        <v-card-text>
            <line-chart :chartData="chartData"></line-chart>
        </v-card-text>
    </v-card>
</template>

<script>
import LineChart from './LineChart.vue'
import {client} from '@/client/axiosClient'
export default {
  components: { LineChart },
    name: 'RevenueChart',
    data: function(){
        return{
            label: 'Revenue',
            labels: [],
            data: [],
            dates: [],
            showMenu: false
        }
    },
    methods:{
        search(){
            let from = new Date(this.dates[0]).toISOString();
            let to = new Date(this.dates[1]).toISOString();
            client({
                method: 'POST',
                url: '/sales/revenue',
                data: {
                    from: from,
                    to: to
                }
            }).then((response) => {
                this.labels = response.data.labels;
                this.data = response.data.results;
            }, (error) => {

            });
        },
        pastDates(value){
            let now = new Date(Date.now());
            let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return new Date(value) <= today;
        }
    },
    computed:{
        dateRangeText(){
            return this.dates.length == 2 ? this.dates[0] + ' ~ ' + this.dates[1] : '';
        },
        datesValid(){
            return this.dates.length == 2;
        },
        chartData(){
            return {
                labels: this.labels,
                datasets: [
                    {
                        label: this.label,
                        borderColor: '#249EBF',
                        pointBackgroundColor: 'white',
                        pointBorderColor: '#249EBF',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 10,
                        data: this.data
                    }
                ]
            };
        }
    }
}
</script>