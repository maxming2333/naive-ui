<markdown>
# 字素计数

浏览器默认的 `maxlength` 和 `minlength` 以及 naive-ui 自带的字数统计功能并不能准确地拆分所有的字符串，你可以使用 `count-graphemes` 属性来精确的测量文字长度。
</markdown>

<script lang="ts" setup>
import GraphemeSplitter from 'grapheme-splitter'

const splitter = new GraphemeSplitter()
const countGraphemes = (value: string) => splitter.countGraphemes(value)
</script>

<template>
  <n-form>
    <n-form-item label="默认表现">
      <n-input default-value="🌷🏳️‍🌈" show-count :maxlength="12" />
    </n-form-item>
    <n-form-item label="正确表现">
      <n-input
        default-value="🌷🏳️‍🌈"
        show-count
        :maxlength="12"
        :count-graphemes="countGraphemes"
      />
    </n-form-item>
  </n-form>
</template>
