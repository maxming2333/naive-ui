<markdown>
# Show / hide label

If `show-label` will default to `true` if not set and inherit `n-form`'s `show-label`.
</markdown>

<script lang="ts" setup>
import { ref } from 'vue'

const formRef = ref(null)
const formShowLabel = ref(true)
const formItemShowLabel = ref(true)
const formValue = ref({
  user: {
    name: '',
    age: ''
  },
  phone: ''
})
</script>

<template>
  <n-space vertical>
    <n-space>Form:<n-switch v-model:value="formShowLabel" /></n-space>
    <n-space>Form Item:<n-switch v-model:value="formItemShowLabel" /></n-space>
    <n-form ref="formRef" :model="formValue" :show-label="formShowLabel">
      <n-form-item
        label="Name"
        path="user.name"
        :show-label="formItemShowLabel"
      >
        <n-input v-model:value="formValue.user.name" placeholder="Input Name" />
      </n-form-item>
      <n-form-item label="Age" path="user.age">
        <n-input v-model:value="formValue.user.age" placeholder="Input Age" />
      </n-form-item>
      <n-form-item label="Phone" path="user.phone">
        <n-input v-model:value="formValue.phone" placeholder="Input Phone" />
      </n-form-item>
    </n-form>
  </n-space>
</template>
