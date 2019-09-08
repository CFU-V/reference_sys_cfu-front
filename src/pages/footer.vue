<template>
  <div>
    <!-- Footer -->
    <footer class="footer-wrapper">
      <h3>Справочно-правовая система КФУ 2019{{TheNextFooterYear}} ©</h3>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    TheNextFooterYear() {
      const year = new Date().getFullYear();
      return year > 2019 ? "-" + year : "";
    }
  }
};
</script>

<style scoped>
/* Footer */
.footer-wrapper {
  height: 50px;
  position: relative;
  background: rgb(66, 66, 66);
  margin-left: 30px;
  margin-right: 30px;
  -webkit-box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}

.footer-wrapper h3 {
  text-align: center;
  color: white;
  padding-top: 15px;
}
</style>
