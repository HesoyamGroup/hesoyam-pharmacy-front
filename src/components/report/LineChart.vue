<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins
export default {
    extends: Line,
    mixins: [reactiveProp],
    props: {
        chartData: {
            type: Array | Object,
            required: true
        }
    },
    data: function() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: true
                        }
                    }]
                },
                legend: {
                    display: false
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    mounted () {
        this.renderChart(this.chartData, this.options);
        /*this.renderChart({
            labels: this.chartLabels,
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
                    data: this.chartData
                }
            ]
        }, this.options)*/
    }
}
</script>