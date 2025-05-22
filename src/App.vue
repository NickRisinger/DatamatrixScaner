<script setup>
import { ref, onMounted } from 'vue';

const video = ref(null);
const canvas = ref(null);
const code = ref('');
const scanned = ref(false);

let zbarWasm;

onMounted(async () => {
  zbarWasm = await window.zbarWASM();
  startVideo();
});

const startVideo = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'environment' },
  });
  video.value.srcObject = stream;

  video.value.onloadedmetadata = () => {
    video.value.play();
    requestAnimationFrame(scan);
  };
};

const scan = async () => {
  if (video.value.readyState === video.value.HAVE_ENOUGH_DATA && !scanned.value) {
    const ctx = canvas.value.getContext('2d');
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;
    ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
    const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height);
    const results = await zbarWasm.scanImageData(imageData);

    if (results.length > 0) {
      code.value = results[0].data;
      scanned.value = true;
      stopVideo();
      alert('Код успешно отсканирован!');
      return;
    }
  }

  requestAnimationFrame(scan);
};

const stopVideo = () => {
  const stream = video.value.srcObject;
  const tracks = stream.getTracks();
  tracks.forEach(track => track.stop());
};

const restartScan = () => {
  code.value = '';
  scanned.value = false;
  startVideo();
};
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
