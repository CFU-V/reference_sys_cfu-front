<template>
  <div>
    <!-- Pre loader -->
    <page-loader></page-loader>
    <!-- Header -->
    <page-header></page-header>
    <!-- Content -->
    <div class="content-wrapper">
      <section class="container section-news" style="height: 500px;">
        <!-- Временно -->
        <h2>Страница не найдена!</h2>
      </section>
    </div>
    <!-- Footer -->
    <page-footer></page-footer>
  </div>
</template>

<script>
import Header from "./header.vue";
import Footer from "./footer.vue";
import Loader from "../components/PageLoader.vue";

export default {
  components: {
    PageHeader: Header,
    PageFooter: Footer,
    PageLoader: Loader
  }
};
</script>

<style scoped>
/* Content */
.content-wrapper {
  position: relative;
  background: #fff;
  margin: -60px 30px 0;
  border-radius: 6px 6px 0 0;
  -webkit-box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14),
    0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);
}

.section-news {
  padding-top: 50px;
}

.section-news > h2 {
  padding-bottom: 25px;
  margin-bottom: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
</style>
