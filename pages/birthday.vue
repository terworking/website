<script setup lang="ts">
import type { BirthdayResult } from '~~/typings/birthday';
import type { Member } from '~~/typings/terworking';

definePageMeta({
  title: 'Birthday countdown',
});

const { member: members } = useTerworking();

const selectedMember = useState(
  'selected',
  () => members[Math.floor(Math.random() * members.length)]
);

const now = useNow({ interval: 1000 });

const birthdayRanges = computed(() =>
  members
    .map((member) => ({
      ms:
        now.value.valueOf() -
        new Date(
          now.value.getFullYear(),
          member.month - 1,
          member.day
        ).valueOf(),
      ...member,
    }))
    .sort((a, b) => a.ms - b.ms)
);

const throttledBirthdayRanges = ref(birthdayRanges.value);

watch(
  birthdayRanges,
  useThrottleFn(
    () => (throttledBirthdayRanges.value = birthdayRanges.value),
    60_000,
    true,
    true
  )
);

const closest = computed<Member>(
  () =>
    [...throttledBirthdayRanges.value]
      .reverse()
      .find(({ ms }) => ms < 0) as Member
);
const farthest = computed<Member>(
  () => throttledBirthdayRanges.value.find(({ ms }) => ms > 0) as Member
);

const birthdayIsThisYear = computed(() => {
  const month = now.value.getMonth() + 1;
  const day = now.value.getDate();

  return (
    selectedMember.value.month > month ||
    (selectedMember.value.month === month && selectedMember.value.day > day)
  );
});

const birthdayYear = computed(() =>
  birthdayIsThisYear.value
    ? now.value.getFullYear()
    : now.value.getFullYear() + 1
);

const birthdayAge = computed(
  () => birthdayYear.value - selectedMember.value.year
);

const secondsUntilBirthday = computed(() => {
  const birthdayDate = new Date(
    birthdayYear.value,
    selectedMember.value.month - 1,
    selectedMember.value.day
  );

  return Math.floor((birthdayDate.valueOf() - now.value.valueOf()) / 1000);
});

const message = computed(() => `berusia ${birthdayAge.value} tahun`);

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
const classes = ref(_classes);

watch(
  selectedMember,
  useDebounceFn(() => (classes.value = useShuffle(_classes)), 250),
  {
    immediate: true,
  }
);

const secondsInMinute = 60;
const secondsInHour = secondsInMinute * 60;
const secondsInDay = secondsInHour * 24;

const results = computed(() => {
  if (secondsUntilBirthday.value === 0) {
    return [];
  }

  const daysLeft = Math.floor(secondsUntilBirthday.value / secondsInDay);
  const hoursLeft = Math.floor(
    (secondsUntilBirthday.value % secondsInDay) / secondsInHour
  );
  const minutesLeft = Math.floor(
    (secondsUntilBirthday.value % secondsInHour) / secondsInMinute
  );
  const secondsLeft = Math.floor(secondsUntilBirthday.value % secondsInMinute);

  return [
    { colorClass: classes.value[0], key: 'days', value: daysLeft },
    { colorClass: classes.value[1], key: 'hours', value: hoursLeft },
    { colorClass: classes.value[2], key: 'mins', value: minutesLeft },
    { colorClass: classes.value[3], key: 'secs', value: secondsLeft },
  ] as BirthdayResult[];
});
</script>

<template>
  <div md="max-w-xl mx-auto px-10">
    <div my-5 p-5 gap-6 grid>
      <h1 font-semibold text-5xl text-center mx-auto>Birthday countdown</h1>
      <select
        v-model="selectedMember"
        p-3
        border-transparent
        rounded-lg
        w-full
        bg-secondary
      >
        <option disabled selected>Please select one</option>
        <option :value="closest">Closest ({{ closest.name }})</option>
        <option :value="farthest">Farthest ({{ farthest.name }})</option>
        <option v-for="member of members" :key="member.name" :value="member">
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
        <TransitionGroup name="birthday-cards">
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
.birthday-cards-move,
.birthday-cards-enter-active,
.birthday-cards-leave-active {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-duration: 0.5s;
}

.birthday-cards-enter-from,
.birthday-cards-leave-to {
  transform: translateY(100%) scale(0.1);
  opacity: 0;
}

.birthday-cards-leave-active {
  position: absolute;
}
</style>
