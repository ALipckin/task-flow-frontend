<template>
  <v-chip v-if="status" :color="statusInfo?.color || 'grey'" dark>
    {{ statusInfo?.label || status }}
  </v-chip>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import type { PropType } from "vue";

type TaskStatus = "pending" | "in_progress" | "completed";

const statusData = {
  pending: { label: "Ожидание", color: "orange" },
  in_progress: { label: "В процессе", color: "blue" },
  completed: { label: "Завершено", color: "green" },
} as const;

type StatusData = typeof statusData;

export const getStatuses = () => {
  return (Object.keys(statusData) as Array<keyof StatusData>).map((key) => ({
    value: key,
    ...statusData[key],
  }));
};

export default defineComponent({
  name: "TaskStatus",
  props: {
    status: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const statusInfo = computed(() => statusData[props.status as TaskStatus]);
    return { statusInfo };
  },
});
</script>
