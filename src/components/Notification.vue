<!-- components/Notifications.vue -->
<template>
  <v-snackbar
    v-model="snackbar"
    :color="color"
    :timeout="10000"
    location="top right"
    location-strategy="static"
    class="position-fixed"
    style="top: 20px; right: 20px; z-index: 9999;"
  >
    {{ text }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { defineOptions } from 'vue'
import { useNotifier } from '@/composables/useNotifier'

defineOptions({ name: 'AppNotification' })
const { snackbar, text, color } = useNotifier()
</script>
