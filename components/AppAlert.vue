<script setup lang="ts">
type AlertType = 'success' | 'error';

interface Button {
  primary: string;
  secondary?: string;
}

interface Options {
  closeOnClickOutside?: boolean;
}

interface AlertProperties {
  button: Button;
  description?: string;
  show: boolean;
  title?: string;
  type: AlertType;
  options?: Options;
}

const properties = defineProps<AlertProperties>();
const emit = defineEmits(['clickPrimary', 'clickSecondary', 'close']);

const alertContainer = ref<HTMLDivElement>();
onClickOutside(alertContainer, () => {
  if (properties.options?.closeOnClickOutside === true) emit('close');
});

const containerClass = computed(() => {
  switch (properties.type) {
    case 'success':
      return 'text-green shadow-green';

    case 'error':
      return 'text-red shadow-red';
  }
});

const iconClass = computed(() => {
  switch (properties.type) {
    case 'success':
      return 'i-ci-check';

    case 'error':
      return 'i-ci-close-big';
  }
});

const primaryButtonClass = computed(() => {
  switch (properties.type) {
    case 'success':
      return 'bg-green border-green hover:text-green';

    case 'error':
      return 'bg-red border-red hover:text-red';
  }
});

const secondaryButtonClass = computed(() => {
  switch (properties.type) {
    case 'success':
      return 'border-green text-green';

    case 'error':
      return 'border-red text-red';
  }
});
</script>

<template>
  <ClientOnly>
    <Body :class="show ? 'overflow-hidden' : ''" />
    <Teleport to="body">
      <Transition name="alert">
        <div
          v-if="show"
          id="alert-mask"
          z-999
          fixed
          inset-0
          flex
          items-center
          justify-center
          bg="black dark:transparent opacity-80"
          backdrop-blur-sm
        >
          <div
            id="alert-container"
            ref="alertContainer"
            flex="~ col"
            shadow="lg opacity-25"
            items-center
            rounded-lg
            bg-body
            border
            w-72
            p="y-6 x-4"
            select-none
            :class="containerClass"
          >
            <div border="4 dashed" rounded-full mb-2>
              <div w-full h-full m-0 p-16 :class="iconClass"></div>
            </div>
            <h1 font-semibold italic text-body text-xl>{{ title }}</h1>
            <p text="body center">{{ description }}</p>
            <div
              flex
              justify-around
              w-full
              mt-4
              class="children-(h-8 w-24 font-semibold transition-background-color-200 border-2)"
            >
              <button
                v-if="button.secondary"
                bg-transparent
                :class="secondaryButtonClass"
                @click="emit('clickSecondary')"
              >
                {{ button.secondary }}
              </button>
              <button
                hover:bg-transparent
                border-dashed
                text="white dark:black"
                :class="primaryButtonClass"
                @click="emit('clickPrimary')"
              >
                {{ button.primary }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<style scoped>
#alert-mask {
  transition-property: opacity;
  transition-timing-function: ease;
  transition-duration: 0.5s;
}

#alert-container {
  transition-property: transform, opacity;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-duration: 0.5s;
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
}

.alert-enter-from #alert-container,
.alert-leave-to #alert-container {
  transform: scale(1.1);
}
</style>
