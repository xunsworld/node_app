<template>
    <div>
        login page
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { getProfileById } from '@/apis/profiles';
const route = useRoute();
onBeforeMount(() => {
    const id: string = route.params.id as string;
    getProfileById(id).then((res) => {
        console.log(res);
    });
});
</script>

<style scoped></style>