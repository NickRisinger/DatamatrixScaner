<script setup>
import { BrowserMultiFormatReader } from '@zxing/browser';
import { onMounted, ref } from 'vue';

const video = ref<HTMLVideoElement | null>(null);
const code = ref<string>('');
const scanner = new BrowserMultiFormatReader();

const startScanning = async (
  videoElement: HTMLVideoElement,
  onResult: (result: string) => void,
) => {
  try {
    const result = await scanner.decodeOnceFromVideoDevice(undefined, videoElement);
    onResult(result.getText());
  } catch (err) {
    console.error(err);
  }
};

const stopScanning = () => {
  scanner.reset();
};

onMounted(() => {
  if (video.value) {
    startScanning(video.value, (result: string) => {
      code.value = result;
      stopScanning();
      alert('Код распознан!');
    });
  }
});
</script>

<template>
  <div>
    <h1>Data Matrix Scanner</h1>
    <video ref="video" autoplay playsinline v-show="!scanned"></video>
    <canvas ref="canvas" style="display: none;"></canvas>
    <p v-if="code">Распознанный код: <strong>{{ code }}</strong></p>
    <button v-if="scanned" @click="restartScan">Сканировать снова</button>
  </div>
</template>

<style scoped>
video {
  width: 100%;
  max-width: 400px;
  border: 2px solid #333;
}
button {
  margin-top: 1em;
  padding: 0.5em 1em;
  font-size: 1em;
}
</style>
