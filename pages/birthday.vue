<script setup lang="ts">
definePageMeta({
  title: 'Birthday countdown',
});

const now = useNow({ interval: 1000 });

const { data } = await useAsyncData('birthday-data', async () => {
  const { member } = useTerworking();

  const ranges = member
    .map((it) => ({
      seconds: Math.floor(
        (now.value.valueOf() -
          new Date(now.value.getFullYear(), it.month - 1, it.day).valueOf()) /
          1000
      ),
      ...it,
    }))
    .sort((a, b) => a.seconds - b.seconds);

  const [closest, farthest] = [
    ranges.filter(({ seconds }) => seconds < 0).pop() as typeof member[number],
    ranges.find(({ seconds }) => seconds > 0) as typeof member[number],
  ];

  return { closest, farthest, members: member };
});

const selectedMember = useState(
  'birthday-selected',
  () =>
    data.value.members[Math.floor(Math.random() * data.value.members.length)]
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

const classes = ref([
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
]);

watch(selectedMember, () => (classes.value = useShuffle(classes.value)), {
  immediate: true,
});

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
  ];
});
</script>

<template>
  <div m-auto max-w-2xl p="4 md:y-8">
    <div card flex="~ col" items-center p="x-6 y-12" space-y-8>
      <h1 font-semibold text-5xl text-center>Birthday countdown</h1>
      <select
        v-model="selectedMember"
        p-3
        border
        border-card
        rounded-lg
        w="3/4"
        bg-transparent
      >
        <option disabled selected>Please select one</option>
        <option v-if="data.closest" :value="data.closest">
          Closest ({{ data.closest.name }})
        </option>
        <option v-if="data.farthest" :value="data.farthest">
          Farthest ({{ data.farthest.name }})
        </option>
        <option
          v-for="member of data.members"
          :key="member.name"
          :value="member"
        >
          {{ member.name }}
        </option>
      </select>
      <div flex items-center justify-center text-center space-x-2>
        <ClientOnly>
          <TransitionGroup name="birthday-card">
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
                <span font-medium text="2xl md:3xl">
                  {{ value }}
                </span>
                <span font-light text="lg md:xl">{{ key }}</span>
              </div>
            </template>
          </TransitionGroup>
        </ClientOnly>
      </div>
      <div flex="~ col" text-center max-w-md>
        <span text="3xl md:4xl">{{ selectedMember.name }}</span>
        <span text="xl md:2xl">
          {{ message }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.birthday-card-move,
.birthday-card-enter-active,
.birthday-card-leave-active {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  transition-duration: 0.5s;
}

.birthday-card-enter-from,
.birthday-card-leave-to {
  transform: translateY(100%) scale(0.1);
  opacity: 0;
}

.birthday-card-leave-active {
  position: absolute;
}
</style>
