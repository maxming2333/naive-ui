<markdown>
# 插槽

有人要在选择菜单里用插槽吗？
</markdown>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('空的')
</script>

<template>
  <n-popselect v-model:value="value" :options="[]" trigger="click">
    <n-button>{{ value || '弹出选择' }}</n-button>
    <template #header>
      不知道放些什么
    </template>
    <template #empty>
      没啥看的，这里是空的
    </template>
    <template #action>
      如果你点开了这个例子，你可能需要它
    </template>
  </n-popselect>
</template>
