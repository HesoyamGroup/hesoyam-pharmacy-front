<template>
    <v-card>
        <v-card-title>{{label}} Report</v-card-title>
        <v-card-subtitle>{{subtitle}}</v-card-subtitle>
        <v-card-text>
            <v-tabs
            center-active>
                <v-tab>Monthly</v-tab>
                <v-tab-item class="mt-5">
                    <line-chart :chartData="chartDataMonth"></line-chart>
                </v-tab-item>
                <v-tab>Quarterly</v-tab>
                <v-tab-item class="mt-5">
                    <line-chart :chartData="chartDataQuarter"></line-chart>
                </v-tab-item>
                <v-tab>Yearly</v-tab>
                <v-tab-item class="mt-5">
                    <line-chart :chartData="chartDataYear"></line-chart>
                </v-tab-item>
            </v-tabs>
        </v-card-text>
    </v-card>
</template>

<script>
import LineChart from './LineChart.vue';
import {client} from '@/client/axiosClient'
export default {
    components: { LineChart },
    props:{
        type:{
            type: String,   //appointment, medicine
            required: true
        }
    },
    name: 'SalesChart',
    data: function(){
        return {
            quarterData: [],
            labelsQuarter: [],
            monthData: [],
            labelsMonth: [],
            yearData: [],
            labelsYear: []
        }
    },
    mounted(){
        this.fetchSalesData();
    },
    methods:{
        fetchSalesData(){
            client({
                method: 'GET',
                url: '/sales/' + this.type,
                params:{
                    type: 'MONTHLY'
                }
            }).then((response) => {
                this.monthData = response.data.results;
                this.labelsMonth = response.data.labels;
            });
            client({
                method: 'GET',
                url: '/sales/' + this.type,
                params:{
                    type: 'QUARTERLY'
                }
            }).then((response) => {
                this.quarterData = response.data.results;
                this.labelsQuarter = response.data.labels;
            });
            client({
                method: 'GET',
                url: '/sales/' + this.type,
                params:{
                    type: 'YEARLY'
                }
            }).then((response) => {
                this.yearData = response.data.results;
                this.labelsYear = response.data.labels;
            });
        }
    },
    computed:{
        label(){
            return this.type == 'appointment' ? 'Appointments' : 'Medicines';
        },
        subtitle(){
            return this.type == 'appointment' ? 'Number of appointments completed' : 'Number of medicines sold'
        },
        chartDataQuarter(){
            return {
                labels: this.labelsQuarter,
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
                        data: this.quarterData
                    }
                ]
            };
        },
        chartDataMonth(){
            return {
                labels: this.labelsMonth,
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
                        data: this.monthData
                    }
                ]
            };
        },
        chartDataYear(){
            return {
                labels: this.labelsYear,
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
                        data: this.yearData
                    }
                ]
            };
        }
    }
}
</script>