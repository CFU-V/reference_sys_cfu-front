<template>
  <div>
    <!-- Pre loader -->
    <page-loader></page-loader>
    	<!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- Header -->
    <page-header></page-header>
    <!-- Content -->
    <div class="content-wrapper">
      <section class="container section-news" style="min-height: 500px;">
        <h2>Новости <span>(показывает только добавленные и обновлённые документы)</span></h2>
        <div class="news-text-box">
          <article class="news-text" v-for="(value, index) in news" :key="index">
            <h3>{{ convert(value['ctype'] == 'created' ? value['createdAt'] : value['updatedAt']) }}</h3>
            <p>{{ value['ctype'] == 'created' ? '(Добавлен документ)' : '(Обновлён документ)' }}</p>
            <br />
            <router-link :to="'/docview/' + value['id']">{{ value['title'] }}</router-link>
          </article>
        </div>
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
import * as api from "../api";
import LoginCheck from "../components/logincheck.vue";

export default {
  data() {
    return {
      news: []
    };
  },
  components: {
    PageHeader: Header,
    PageFooter: Footer,
    LoginCheck,
    PageLoader: Loader
  },
  methods: {
    convert(_date) {
      var date = new Date(_date);
      return (
        date.toLocaleDateString() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    },
    async GetNews() {
      try {
        const res = await api.GetNewsDocument();
        for (let i = 0; i < res.updated.length; i++) {
          res.updated[i].ctype = "updated";
          res.updated[i].sort_date = res.updated[i].updatedAt;
        }
        for (let i = 0; i < res.created.length; i++) {
          res.created[i].ctype = "created";
          res.created[i].sort_date = res.created[i].createdAt;
        }
        this.news = this.news.concat(res.updated);
        this.news = this.news.concat(res.created);
        this.news.sort(function(a, b) {
          if (a.sort_date > b.sort_date) return -1;
          return 0;
        });
      } catch (error) {}
    }
  },
  computed: {},
  created() {
    document.title = this.$route.meta.title;
    this.GetNews();
  },
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
  padding-bottom: 50px;
}

.section-news > h2 {
  padding-bottom: 25px;
  margin-bottom: 50px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}

.section-news > h2 > span {
  opacity: 0.3;
}

.news-text h3 {
  display: inline;
}

.news-text p {
  display: inline;
  opacity: 0.4;
}

.news-text {
  display: block;
  margin-bottom: 15px;
}

.news-text-box {
  width: 100%;
  min-height: 200px;
  height: auto;
}
</style>
