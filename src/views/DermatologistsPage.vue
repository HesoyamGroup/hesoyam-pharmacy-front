<template>
    <employee-list type="dermatologist"></employee-list>
</template>

<script>
import EmployeeList from '../components/user/EmployeeList.vue'

export default {
  components: { EmployeeList },
    name: 'DermatologistsPage',
    data: function(){
        return {

        }
    }
}
</script>