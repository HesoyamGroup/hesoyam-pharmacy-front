<template>
    <v-list dense>
        <v-subheader>Available medicines</v-subheader>
        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                    <v-btn color="primary" to="/login">{{item.text}}</v-btn>
                </v-list-item-action>
            </v-list-item>
      </v-list-item-group>
    </v-list>
</template>

<script>

export default {
    name: 'PharmacyMedicineList',
    data: function(){
        return {
            items:[{text: 'egy'}, {text: 'ketto'}, {text: 'harom'}],
            selectedItem: null
        }
    },
    mounted(){
    }
}
</script>