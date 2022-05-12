<script setup lang="ts">
import type { BirthdayResult } from '~~/typings/birthday';
import type { Member } from '~~/typings/terworking';

definePageMeta({
  title: 'Birthday countdown',
});

const members = useTerworkingMember();

const selectedMember = $(
  useState(
    'selected',
    () => members[Math.floor(Math.random() * members.length)]
  )
);

const now = $(useNow({ interval: 1000 }));

const birthdayRanges = computed(() =>
  members
    .map((member) => ({
      ms:
        now.valueOf() -
        new Date(now.getFullYear(), member.month - 1, member.day).valueOf(),
      ...member,
    }))
    .sort((a, b) => a.ms - b.ms)
);

let throttledBirthdayRanges = $ref(birthdayRanges.value);

watch(
  birthdayRanges,
  useThrottleFn(
    () => (throttledBirthdayRanges = birthdayRanges.value),
    60000,
    true,
    true
  )
);

const closest = $computed<Member>(
  () => throttledBirthdayRanges.filter(({ ms }) => ms < 0).reverse()[0]
);
const farthest = $computed<Member>(
  () => throttledBirthdayRanges.filter(({ ms }) => ms > 0)[0]
);

const _colorSequence = ['lime', 'fuchsia', 'rose', 'indigo'];
let colorSequence = $ref(_colorSequence);

watch(selectedMember, () => (colorSequence = useShuffle(_colorSequence)), {
  immediate: true,
});

const birthdayIsThisYear = $computed(() => {
  const month = now.getMonth() + 1;
  const day = now.getDate();

  return (
    selectedMember.month > month ||
    (selectedMember.month === month && selectedMember.day > day)
  );
});

const birthdayYear = $computed(() =>
  birthdayIsThisYear ? now.getFullYear() : now.getFullYear() + 1
);

const birthdayAge = $computed(() => birthdayYear - selectedMember.year);

const secondsUntilBirthday = $computed(() => {
  const birthdayDate = new Date(
    birthdayYear,
    selectedMember.month - 1,
    selectedMember.day
  );

  return Math.floor((birthdayDate.valueOf() - now.valueOf()) / 1000);
});

const message = $computed(() => `berusia ${birthdayAge} tahun`);

const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

const results = $computed(() => {
  if (secondsUntilBirthday === 0) {
    return [];
  }

  const daysLeft = Math.floor(secondsUntilBirthday / secondsInDay);
  const hoursLeft = Math.floor(
    (secondsUntilBirthday % secondsInDay) / secondsInHour
  );
  const minutesLeft = Math.floor(
    (secondsUntilBirthday % secondsInHour) / secondsInMinute
  );
  const secondsLeft = Math.floor(secondsUntilBirthday % secondsInMinute);

  return [
    { color: colorSequence[0], key: 'days', value: daysLeft },
    { color: colorSequence[1], key: 'hours', value: hoursLeft },
    { color: colorSequence[2], key: 'mins', value: minutesLeft },
    { color: colorSequence[3], key: 'secs', value: secondsLeft },
  ] as BirthdayResult[];
});
</script>

<template>
  <div class="md:max-w-xl md:mx-auto md:px-10">
    <div class="my-5 p-5 gap-6 grid">
      <h1 class="font-semibold text-5xl text-center mx-auto">
        Birthday countdown
      </h1>
      <select
        class="p-3 border-transparent rounded-lg w-full bg-secondary"
        v-model="selectedMember"
      >
        <option disabled selected>Please select one</option>
        <option :value="closest">Closest ({{ closest.name }})</option>
        <option :value="farthest">Farthest ({{ farthest.name }})</option>
        <option v-for="member of members" :value="member">
          {{ member.name }}
        </option>
      </select>
      <div
        class="flex items-center justify-center h-20 w-3/4 md:w-4/5 text-center mx-auto gap-2"
      >
        <TransitionGroup name="slide-fade-group">
          <template v-for="{ color, key, value } of results" :key="key">
            <div
              v-if="value !== 0"
              class="flex flex-col p-3 rounded-2xl"
              :class="`bg-${color}-200 divide-${color}-800 dark:bg-${color}-800 dark:divide-${color}-200`"
            >
              <span class="text-2xl md:text-3xl">
                {{ value }}
              </span>
              <span class="font-light text-lg md:text-xl">{{ key }}</span>
            </div>
          </template>
        </TransitionGroup>
      </div>
      <div class="flex flex-col text-center">
        <p class="text-2xl md:text-3xl">{{ selectedMember.name }}</p>
        <p class="text-lg md:text-xl">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-group-move,
.slide-fade-group-enter-active,
.slide-fade-group-leave-active {
  transition: all 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.slide-fade-group-enter-from,
.slide-fade-group-leave-to {
  transform: translateY(100%) scale(0.1);
  opacity: 0;
}

.slide-fade-group-leave-active {
  position: absolute;
}
</style>
