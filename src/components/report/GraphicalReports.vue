<template>
<div>
    <v-row>
        <v-col>
            <sales-chart class="ma-5" type="medicine"></sales-chart>
        </v-col>
        <v-col>
            <sales-chart class="ma-5" type="appointment"></sales-chart>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <revenue-chart class="ma-5"></revenue-chart>
        </v-col>
    </v-row>
</div>
</template>

<script>
import RevenueChart from './RevenueChart.vue'
import SalesChart from './SalesChart.vue'
export default {
    components: { SalesChart, RevenueChart },
    name: 'GraphicalReports',
    
        
}
</script>