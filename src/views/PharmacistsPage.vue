<template>
    <employee-list type="pharmacist"></employee-list>
</template>

<script>
import EmployeeList from '../components/user/EmployeeList.vue'

export default {
  components: { EmployeeList },
    name: 'PharmacistsPage',
    data: function(){
        return {

        }
    }
}
</script>