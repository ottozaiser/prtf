<template>
  <div>
    <div class="blob">
      <svg
        width="800"
        height="800"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(300,300)">
          <path
            d="M126.9,-127.3C146.4,-76.7,131.7,-25,122.1,32.3C112.6,89.6,108.1,152.5,70,186.7C31.8,221,-40.1,226.7,-95.5,199.6C-151,172.4,-190.1,112.3,-196,54C-202,-4.4,-174.9,-61.1,-136.7,-116C-98.5,-170.9,-49.3,-223.9,2.2,-225.7C53.7,-227.5,107.4,-178,126.9,-127.3Z"
          />
        </g>
      </svg>
    </div>
    <div class="blob other">
      <svg
        width="600"
        height="600"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(300,300)">
          <path
            d="M123.8,-193.1C162.1,-168,196.1,-136.5,212.9,-97.8C229.6,-59.1,229.1,-13.1,224.4,33.5C219.7,80.2,210.7,127.5,185.7,166.7C160.7,205.8,119.7,236.7,77.3,237.2C35,237.6,-8.5,207.6,-55.9,192.6C-103.3,177.7,-154.4,177.9,-193.4,155.2C-232.4,132.5,-259.2,86.8,-255.4,43.2C-251.7,-0.4,-217.2,-42,-190.7,-81.6C-164.1,-121.3,-145.3,-159.1,-114.8,-187.8C-84.3,-216.6,-42.2,-236.3,0.3,-236.7C42.7,-237.1,85.4,-218.3,123.8,-193.1Z"
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: "Blob"
};
</script>

<style scoped lang="scss">
.blob {
  position: absolute;
  top: 0;
  left: 0;
  fill: var(--main-lightgray);
  width: 100vmax;
  z-index: 1;
  animation: move 10s ease-in-out infinite;
  transform-origin: 50% 50%;
}

.other {
  animation: moveOther 10s ease-in-out infinite;
}

@keyframes move {
  0% {
    transform: scale(1.5) translate(10px, -30px);
  }
  38% {
    transform: scale(0.8, 1) translate(80vw, 30vh) rotate(160deg);
  }
  40% {
    transform: scale(0.8, 1) translate(80vw, 30vh) rotate(160deg);
  }
  78% {
    transform: scale(1.8) translate(0vw, 50vh) rotate(-20deg);
  }
  80% {
    transform: scale(1.8) translate(0vw, 50vh) rotate(-20deg);
  }
  100% {
    transform: scale(1.5) translate(10px, -30px);
  }
}

@keyframes moveOther {
  0% {
    transform: scale(1.5) translate(0vw, 50vh) rotate(-20deg);
  }
  38% {
    transform: scale(1) translate(10px, -30px);
  }
  40% {
    transform: scale(1) translate(10px, -30px);
  }
  78% {
    transform: scale(0.5, 1) translate(80vw, 30vh) rotate(160deg);
  }
  80% {
    transform: scale(0.5, 1) translate(80vw, 30vh) rotate(160deg);
  }
  100% {
    transform: scale(1.5) translate(0vw, 50vh) rotate(-20deg);
  }
}
</style>
