<markdown>
# Rtl Debug
</markdown>

<script lang="ts" setup>
import { unstableTagRtl, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const rtlEnabled = ref(false)
const rtlStyles = [unstableTagRtl]
function handleClose() {
  message.info('tag close')
}
</script>

<template>
  <n-space vertical>
    <n-space><n-switch v-model:value="rtlEnabled" />Rtl</n-space>
    <n-config-provider :rtl="rtlEnabled ? rtlStyles : undefined">
      <n-space>
        <n-tag>
          我不配
          <template #avatar>
            <n-avatar
              src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
            />
          </template>
        </n-tag>
        <n-tag type="success" size="small" round closable @close="handleClose">
          梯田
        </n-tag>
        <n-tag type="error" closable round @close="handleClose">
          说好不哭
          <template #avatar>
            <n-avatar
              round
              src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
            />
          </template>
        </n-tag>
        <n-tag type="error" closable size="large" round @close="handleClose">
          一路向北
        </n-tag>
      </n-space>
    </n-config-provider>
  </n-space>
</template>
