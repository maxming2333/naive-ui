<markdown>
# 自定义渲染每一个 tag
</markdown>

<script lang="ts" setup>
import { NTag } from 'naive-ui'
import { h, ref } from 'vue'

const tags = ref(['教师', '程序员'])

function renderTag(tag: string, index: number) {
  return h(
    NTag,
    {
      type: index < 3 ? 'success' : 'error',
      disabled: index > 3,
      closable: true,
      onClose: () => {
        tags.value.splice(index, 1)
      }
    },
    {
      default: () => tag
    }
  )
}
</script>

<template>
  <n-dynamic-tags v-model:value="tags" :render-tag="renderTag" />
</template>
