<template>
  <div>
    <transition name="fade">
      <div v-if="IsLoading" class="fon-preloader">
        <div class="loader"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    IsLoading: false
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.loader {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border: 16px solid #f3f3f3;
  border-radius: 50%;
  border-top: 16px solid #3498db;
  width: 120px;
  height: 120px;
  -ms-animation: spin 2s linear infinite;
  -moz-animation: spin 2s linear infinite;
  -o-animation: spin 2s linear infinite;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }

  to {
    bottom: 0px;
    opacity: 1;
  }
}

@keyframes animatebottom {
  from {
    bottom: -100px;
    opacity: 0;
  }

  to {
    bottom: 0;
    opacity: 1;
  }
}

.fon-preloader {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
