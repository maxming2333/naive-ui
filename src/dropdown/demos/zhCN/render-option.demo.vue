<markdown>
# 为选项增加 Tooltip

你可以通过 `render-option` 为选项增添 Tooltip。
</markdown>

<script lang="ts" setup>
import type { DropdownGroupOption, DropdownOption } from 'naive-ui'
import type { VNode } from 'vue'
import { NTooltip, useMessage } from 'naive-ui'
import { h } from 'vue'

const message = useMessage()

function renderOption({
  node,
  option
}: {
  node: VNode
  option: DropdownOption | DropdownGroupOption
}) {
  return h(
    NTooltip,
    { keepAliveOnHover: false, style: { width: 'max-content' } },
    {
      trigger: () => [node],
      default: () => option.key
    }
  )
}

const options = [
  {
    label: '滨海湾金沙，新加坡',
    key: 'marina bay sands',
    disabled: true
  },
  {
    label: '布朗酒店，伦敦',
    key: 'brown\'s hotel, london'
  },
  {
    label: '亚特兰蒂斯巴哈马，拿骚',
    key: 'atlantis nahamas, nassau'
  },
  {
    label: '比佛利山庄酒店，洛杉矶',
    key: 'the beverly hills hotel, los angeles'
  }
]

function handleSelect(key: string | number) {
  message.info(String(key))
}
</script>

<template>
  <n-dropdown
    trigger="hover"
    :options="options"
    :render-option="renderOption"
    @select="handleSelect"
  >
    <n-button>找个地方休息</n-button>
  </n-dropdown>
</template>
