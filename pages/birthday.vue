<script setup lang="ts">
import ConfettiExplosion from 'vue-confetti-explosion';

definePageMeta({
  title: 'Birthday countdown',
});

const { calculateBirthdayAge, calculateSecondsBeforeBirthday } =
  useCalculateBirthday();

const members = useTerworkingMember();

const randomMember = members[Math.floor(Math.random() * members.length)];

const selectedMember = ref<Member>(randomMember);
const { pending: closestMemberPending, data: closestMemberBirthday } =
  useLazyFetch('/api/birthday/closest');
const { pending: farthestMemberPending, data: farthestMemberBirthday } =
  useLazyFetch('/api/birthday/farthest');

const secondsBeforeBirthday = ref(0);
const birthdayAge = ref(0);
const showConfetti = ref(false);

let tickHandler = 0;
onMounted(() => {
  const tick = () => {
    secondsBeforeBirthday.value = calculateSecondsBeforeBirthday(
      selectedMember.value
    );
    birthdayAge.value = calculateBirthdayAge(selectedMember.value);

    if (secondsBeforeBirthday.value === 0) {
      showConfetti.value = true;
      setTimeout(() => (showConfetti.value = false), 5000);
    }

    tickHandler = requestAnimationFrame(tick);
  };

  tick();
});

onUnmounted(() => {
  cancelAnimationFrame(tickHandler);
});

const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

const result = computed(() => {
  if (secondsBeforeBirthday.value === 0) {
    return {
      daysLeft: 0,
      hoursLeft: 0,
      minutesLeft: 0,
      secondsLeft: 0,
      message: '',
    };
  }

  const daysLeft = Math.floor(secondsBeforeBirthday.value / secondsInDay);
  const hoursLeft = Math.floor(
    (secondsBeforeBirthday.value % secondsInDay) / secondsInHour
  );
  const minutesLeft = Math.floor(
    (secondsBeforeBirthday.value % secondsInHour) / secondsInMinute
  );
  const secondsLeft = Math.floor(secondsBeforeBirthday.value % secondsInMinute);

  const message = `berusia ${birthdayAge.value} tahun`;

  return {
    daysLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    message,
  };
});
</script>

<template>
  <div>
    <div class="fixed top-0 left-0 z-0 w-full h-full pointer-events-none">
      <ConfettiExplosion
        v-if="showConfetti"
        class="mx-auto mt-8"
        :particleCount="300"
      />
    </div>
    <div class="my-5 p-5 gap-6 grid md:max-w-xl md:mx-auto md:px-10">
      <h1 class="text-4xl md:text-5xl text-center mb-4 mx-auto">
        Birthday countdown
      </h1>
      <select
        class="p-3 border-transparent rounded-lg w-full bg-gray-200 dark:bg-slate-800"
        v-model="selectedMember"
      >
        <option disabled selected>Please select one</option>
        <option v-if="!closestMemberPending" :value="closestMemberBirthday">
          Terdekat ({{ closestMemberBirthday.name }})
        </option>
        <option v-if="!farthestMemberPending" :value="farthestMemberBirthday">
          Terjauh ({{ farthestMemberBirthday.name }})
        </option>
        <option v-for="member of members" :value="member">
          {{ member.name }}
        </option>
      </select>
      <div
        class="flex justify-evenly text-center font-light text-2xl md:text-3xl children:(flex flex-grow flex-col divide-y p-4 m-2 rounded-2xl)"
      >
        <div
          class="bg-lime-200 divide-lime-800 dark:bg-lime-800 dark:divide-lime-200"
        >
          <span>{{ result.daysLeft }}</span>
          <span class="text-lg">Hari</span>
        </div>
        <div
          class="bg-fuchsia-200 divide-fuchsia-800 dark:bg-fuchsia-800 dark:divide-fuchsia-200"
        >
          <span>{{ result.hoursLeft }}</span>
          <span class="text-lg">Jam</span>
        </div>
        <div
          class="bg-rose-200 divide-rose-800 dark:bg-rose-800 dark:divide-rose-200"
        >
          <span>{{ result.minutesLeft }}</span>
          <span class="text-lg">Menit</span>
        </div>
        <div
          class="bg-indigo-200 divide-indigo-800 dark:bg-indigo-800 dark:divide-indigo-200"
        >
          <span>{{ result.secondsLeft }}</span>
          <span class="text-lg">Detik</span>
        </div>
      </div>
      <div class="flex flex-col text-center">
        <p class="text-2xl md:text-3xl">{{ selectedMember.name }}</p>
        <p class="md:text-xl">{{ result.message }}</p>
      </div>
    </div>
  </div>
</template>
