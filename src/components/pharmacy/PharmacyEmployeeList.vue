<template>
    <v-list-item-group color="primary">
        <template v-if="employees.length > 0">
            <v-list-item v-for="employee in employees" :key="employee.id">
                <v-list-item-content>
                    <pharmacy-employee-list-item :employee="employee" :type="type"></pharmacy-employee-list-item> 
                </v-list-item-content>
            </v-list-item>
        </template>
        <v-list-item v-else>
            <v-list-item-content>
                <v-list-item-title>There are no {{type}}s.</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list-item-group>
</template>

<script>
import PharmacyEmployeeListItem from './PharmacyEmployeeListItem.vue'
export default {
    name: 'PharmacyEmployeeList',
    props: ['type', 'employees'],
    components: { 
        PharmacyEmployeeListItem
    },
    data: function(){
        return{
            dialog: false
        }
    }
}
</script>