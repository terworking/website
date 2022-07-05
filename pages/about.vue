<script setup lang="ts">
import { Member } from '~~/types/terworking';

definePageMeta({
  title: 'About',
});

const { data } = await useFetch<Member[]>('/api/member');
</script>

<template>
  <div m-auto max-w-4xl p="4 md:y-8">
    <h1 font-semibold text-5xl text-center mb="8 md:12">About Us</h1>
    <div flex="~ col" justify-center space-y-2>
      <AboutMemberCard
        v-for="(member, index) of data"
        :key="member.name"
        :value="member"
        :reverse="index % 2 !== 1"
      />
    </div>
  </div>
</template>
