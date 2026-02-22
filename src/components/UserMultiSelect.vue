<template>
  <v-select
    v-model="selectedUserIds"
    :items="users"
    item-title="displayName"
    item-value="id"
    :label="label"
    multiple
    chips
    clearable
  ></v-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { PropType } from "vue";

interface User {
  id: string | number | bigint;
  name: string;
  email: string;
  displayName: string;
}

export default defineComponent({
  props: {
    modelValue: {
      type: Array as PropType<Array<string | number | bigint>>,
      required: false,
      default: () => [],
    },
    label: {
      type: String,
      required: true,
    },
    users: {
      type: Array as PropType<User[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const normalizeUniqueIds = (ids: Array<string | number | bigint>) => {
      const uniqueByString = new Map<string, string | number | bigint>();
      ids.forEach((id) => {
        if (id !== null && id !== undefined && id !== "") {
          uniqueByString.set(String(id), id);
        }
      });
      return Array.from(uniqueByString.values());
    };

    const selectedUserIds = ref<Array<string | number | bigint>>(
      normalizeUniqueIds([...props.modelValue]),
    );

    watch(
      () => props.modelValue,
      (newValue) => {
        selectedUserIds.value = normalizeUniqueIds([...(newValue ?? [])]);
      },
      { deep: true },
    );

    watch(
      selectedUserIds,
      (newValue) => {
        emit("update:modelValue", normalizeUniqueIds([...(newValue ?? [])]));
      },
      { deep: true },
    );

    return { selectedUserIds };
  },
});
</script>
