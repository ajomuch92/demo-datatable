<template>
  <div class="relative inline-block" v-click-outside="() => show=false">
    <span @click="show=!show">
      <slot name="default"/>
    </span>
    <span ref="refContainer" v-show="show" class="absolute bg-white shadow-md rounded-md min-w-max p-4 border border-gray-100 z-50 content">
      <slot name="content" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  minWidth: {
    type: [String, Number],
    default: '200px',
  }
});

const show = ref(false);

const refContainer = ref(undefined);

const containerHeight = ref(0);

const bottomOffset = computed(() => `-${containerHeight.value + 10}px`);

const minWidthCalc = computed(() => typeof props.minWidth === 'string' ? props.minWidth : `${props.minWidth}px`);

watch(show, (val: Boolean) => {
  if (val) {
    updateOffset();
  }
});

function updateOffset() {
  nextTick(() => {
    const el = refContainer.value;
    containerHeight.value = (el as any)?.clientHeight || 0;
  });
}

</script>

<style scoped>
.content {
  bottom: v-bind(bottomOffset);
  left: 50%;
  transform: translateX(-50%);
  min-width: v-bind(minWidthCalc);
}
</style>