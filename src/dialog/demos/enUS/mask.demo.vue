<markdown>
# Click on mask

I think user is smart enough that they know if nothing happens after mask is clicked, they should click at confirm or cancel button.
</markdown>

<script lang="ts" setup>
import { useDialog, useMessage } from 'naive-ui'

const message = useMessage()
const dialog = useDialog()

function handleButtonClick() {
  dialog.success({
    title: 'Close',
    content: 'Are you sure?',
    positiveText: 'Sure',
    negativeText: 'Not Sure',
    maskClosable: false,
    onMaskClick: () => {
      message.success('cannot close')
    },
    onEsc: () => {
      message.success('close by esc')
    }
  })
}
</script>

<template>
  <n-button @click="handleButtonClick">
    Callback on Mask Clicked
  </n-button>
</template>
