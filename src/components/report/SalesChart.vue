<template>
    <v-card>
        <v-card-title>{{label}} Report</v-card-title>
        <v-card-subtitle>{{subtitle}}</v-card-subtitle>
        <v-card-text>
            <v-tabs
            center-active
            >
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
            quarterData: [455, 128, 378, 489],
            labelsQuarter: ['Q1', 'Q2', 'Q3', 'Q4'],
            monthData: [455, 128, 378, 489, 354, 127, 471, 231, 258, 476, 947, 643],
            labelsMonth: ['Jan 2020', 'Feb 2020', 'Mar 2020', 'Apr 2020', 'May 2020', 'Jun 2020', 'Jul 2020', 'Aug 2020', 'Sep 2020', 'Oct 2020', 'Nov 2020', 'Dec 2020'],
            yearData: [4578, 1274],
            labelsYear: ['2020', '2021']
        }
    },
    mounted(){
        //fetchSalesData();
    },
    methods:{
        fetchSalesData(){
            client({
                method: 'GET',
                url: '/sales/' + this.type + '/month'
            }).then((response) => {
                //TODO:
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