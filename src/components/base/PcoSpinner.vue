<script lang="ts" setup>

</script>

<template>
  <div class="spinner-container h-24">
    <svg
      class="spinner"
      width="44"
      height="44"
      viewBox="0 0 44 44"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="spinner__path"
        cx="22"
        cy="22"
        r="20"
        fill="none"
        stroke-width="4"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.spinner-container {
  position: relative;
  width: 100%;
}

.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  animation: rotate 2s linear infinite;
  width: 2.5rem;
  height: 2.5rem;
}

.spinner__path {
  stroke: $contrast-background--default;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
