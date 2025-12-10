<template>
  <div class="wx-voice-div" @click="playVoice">
    <el-icon>
      <Icon v-if="playing !== true" icon="ep:video-play" :size="32" />
      <Icon v-else icon="ep:video-pause" :size="32" />
      <span class="amr-duration" v-if="duration">{{ duration }} 秒</span>
    </el-icon>
    <div v-if="content">
      <el-tag type="success" size="small">语音识别</el-tag>
      {{ content }}
    </div>
  </div>
</template>

<script lang="ts" setup>
// 因为微信语音是 amr 格式，所以需要用到 amr 解码器
import BenzAMRRecorder from 'benz-amr-recorder'

defineOptions({ name: 'WxVoicePlayer' })

const props = defineProps({
  url: {
    type: String, // 语音地址
    required: true
  },
  content: {
    type: String, // 语音文本
    required: false
  }
})

const amr = ref()
const playing = ref(false)
const duration = ref()

/** 处理点击，播放或暂停 */
const playVoice = () => {
  // 情况一：未初始化，则创建 BenzAMRRecorder
  if (amr.value === undefined) {
    amrInit()
    return
  }
  // 情况二：已经初始化，则根据情况播放或暂时
  if (amr.value.isPlaying()) {
    amrStop()
  } else {
    amrPlay()
  }
}

/** 音频初始化 */
const amrInit = () => {
  amr.value = new BenzAMRRecorder()
  // 设置播放
  amr.value.initWithUrl(props.url).then(function () {
    amrPlay()
    duration.value = amr.value.getDuration()
  })
  // 监听暂停
  amr.value.onEnded(function () {
    playing.value = false
  })
}

/** 音频播放 */
const amrPlay = () => {
  playing.value = true
  amr.value.play()
}

/** 音频暂停 */
const amrStop = () => {
  playing.value = false
  amr.value.stop()
}
// TODO 下面样式有点问题
</script>
<style lang="scss" scoped>
.wx-voice-div {
  display: flex;
  width: 120px;
  height: 50px;
  padding: 5px;
  background-color: #eaeaea;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
}

.amr-duration {
  margin-left: 5px;
  font-size: 11px;
}
</style>
