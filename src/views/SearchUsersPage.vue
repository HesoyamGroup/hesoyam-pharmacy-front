<template>
    <SearchUsers class="main-container"/>
</template>

<script>
    import SearchUsers from "@/components/users/SearchUsers.vue";

export default {
     name: 'SearchUsersPage',
        components: {
            SearchUsers
        }
}
</script>

<style scoped>
    .main-container{
        margin: 5%;
    }
</style>