<markdown>
# Menu Debug
</markdown>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('song0')
const value1 = ref(['song0', 'song1', 'song11'])
const options = [
  {
    label: 'Everybody\'s Got Something to Hide Except Me and My Monkey',
    value: 'song0',
    disabled: true
  },
  {
    label: 'Drive My Car',
    value: 'song1'
  },
  {
    label: 'Norwegian Wood',
    value: 'song2'
  },
  {
    label: 'You Won\'t See',
    value: 'song3',
    disabled: true
  },
  {
    label: 'Nowhere Man',
    value: 'song4'
  },
  {
    label: 'Think For Yourself',
    value: 'song5'
  },
  {
    label: 'The Word',
    value: 'song6'
  },
  {
    label: 'Michelle',
    value: 'song7',
    disabled: true
  },
  {
    label: 'What goes on',
    value: 'song8'
  },
  {
    label: 'Girl',
    value: 'song9'
  },
  {
    label: 'I\'m looking through you',
    value: 'song10'
  },
  {
    label: 'In My Life',
    value: 'song11'
  },
  {
    label: 'Wait',
    value: 'song12'
  }
]
</script>

<template>
  <n-space vertical>
    <n-select v-model:value="value" debug :options="options" />
    <n-select v-model:value="value" disabled :options="options" />
    <n-select v-model:value="value1" debug multiple :options="options" />
    <n-select v-model:value="value1" multiple disabled :options="options" />
  </n-space>
</template>
