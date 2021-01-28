<template>
    <v-list-item-group color="primary">
        <template v-if="employees.length > 0">
            <v-list-item v-for="employee in employees" :key="employee.id">
                <v-list-item-content>
                    <v-row>
                        <v-col>
                            <v-list-item-title>{{employee.firstName}} {{employee.lastName}}</v-list-item-title>
                        </v-col>
                        <v-col>
                            <v-btn :to="'/' + type + '/' + employee.id"><v-icon>mdi-account</v-icon></v-btn>
                        </v-col>
                    </v-row>
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
export default {
    name: 'PharmacyEmployeeList',
    props: ['type', 'employees'],
    data: function(){
        return{

        }
    }
}
</script>