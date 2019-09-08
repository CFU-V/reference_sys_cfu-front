<template>
  <div>
    <transition name="fade">
      <div v-if="isload" id="js-wrap-preloader">
        <div class="loader"></div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isload: true
    };
  },
  beforeCreate() {
    this.isload = true;
  },
  mounted() {
    this.isload = false;
  }
};
</script>

<style>
.loader-text {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  margin: -28px 0 0 -50px;
  width: 70px;
  height: 28px;
  color: white;
  text-align: center;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.9s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
