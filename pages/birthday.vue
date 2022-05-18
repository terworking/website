<script setup lang="ts">
import type { BirthdayResult } from '~~/typings/birthday';
import type { Member } from '~~/typings/terworking';

definePageMeta({
  title: 'Birthday countdown',
});

const { member: members } = useTerworking();

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

const _classes = [
  [
    'bg-lime-200',
    'divide-lime-800',
    'dark:bg-lime-800',
    'dark:divide-lime-200',
  ],
  [
    'bg-fuchsia-200',
    'divide-fuchsia-800',
    'dark:bg-fuchsia-800',
    'dark:divide-fuchsia-200',
  ],
  [
    'bg-rose-200',
    'divide-rose-800',
    'dark:bg-rose-800',
    'dark:divide-rose-200',
  ],
  [
    'bg-indigo-200',
    'divide-indigo-800',
    'dark:bg-indigo-800',
    'dark:divide-indigo-200',
  ],
];
let classes = $ref(_classes);

watch(
  $$(selectedMember),
  useDebounceFn(() => (classes = useShuffle(_classes)), 250),
  {
    immediate: true,
  }
);

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
    { colorClass: classes[0], key: 'days', value: daysLeft },
    { colorClass: classes[1], key: 'hours', value: hoursLeft },
    { colorClass: classes[2], key: 'mins', value: minutesLeft },
    { colorClass: classes[3], key: 'secs', value: secondsLeft },
  ] as BirthdayResult[];
});
</script>

<template>
  <div md="max-w-xl mx-auto px-10">
    <div my-5 p-5 gap-6 grid>
      <h1 font-semibold text-5xl text-center mx-auto>Birthday countdown</h1>
      <select
        p-3
        border-transparent
        rounded-lg
        w-full
        bg-secondary
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
        flex
        items-center
        justify-center
        h-20
        w="3/4 md:4/5"
        text-center
        mx-auto
        gap-2
      >
        <TransitionGroup name="slide-fade-group">
          <template v-for="{ colorClass, key, value } of results" :key="key">
            <div
              v-if="value !== 0"
              flex="~ col"
              p-3
              rounded-2xl
              divide-y
              transition-all-250
              :class="colorClass"
            >
              <span text="2xl md:3xl">
                {{ value }}
              </span>
              <span font-light text="lg md:xl">{{ key }}</span>
            </div>
          </template>
        </TransitionGroup>
      </div>
      <div flex="~ col" text-center>
        <p text="2xl md:3xl">{{ selectedMember.name }}</p>
        <p text="lg md:xl">
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
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-duration: 0.5s;
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
