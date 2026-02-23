<template>
  <TaskList :tasks="tasks" :loading="isLoading" @delete-task="handleDeleteTask" />
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, computed} from 'vue';

import TaskList from "@/components/TaskList.vue";
import { deleteTask, getTasksData } from "@/api/taskApi.ts";
import type { Task } from "@/types/task.ts";
import {useAuthStore} from "@/store/auth.ts";


export default defineComponent({
  name: 'MyTaskView',
  components: {
    TaskList
  },
  setup() {
    const tasks = ref<Task[]>([]);
    const isLoading = ref(true);
    const authStore = useAuthStore();
    const userID = computed(() => authStore.user?.id);

    const fetchTasks = async () => {
      try {
        isLoading.value = true;
        tasks.value = await getTasksData(null, userID.value);
      } catch (error) {
        console.error('Ошибка при загрузке задач:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const handleDeleteTask = async (taskId: number) => {
      const isConfirmed = window.confirm("Удалить задачу?");
      if (!isConfirmed) return;

      try {
        await deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        console.error("Ошибка удаления задачи:", error);
      }
    };

    onMounted(fetchTasks);

    return {
      tasks,
      isLoading,
      handleDeleteTask,
    };
  },
});
</script>
