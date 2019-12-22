<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>[Просмотр] Сравнение документов</h2>
    <div id="viewresult"></div>
    <!-- PageNavigator -->
    <page-nav
      @click="GetViewCompare"
      :url="`/console/document-view-compare/?sid=${sid}&cid=${cid}&page=`"
      :maxPage="responseDocs.totalPages"
      :Page="$route.query.page ? $route.query.page : 0"
    ></page-nav>
    <!-- /PageNavigator -->
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import * as api from "../api";
import mnt from "moment";
import LoginCheck from "../components/logincheck.vue";
import switchToggle from "../components/switch_toggle";
import loadingsmall from "../components/loading_small.vue";
import colors from "colors";

export default {
  data() {
    return {
      sid: -1,
      cid: -1,
      responseDocs: {
        sourceText: "",
        compareText: "",
        totalPages: 0,
        page: 0
      },
      numpage: 0
    };
  },
  components: {
    PageNav: Navigator,
    LoginCheck,
    switchToggle,
    loadingsmall
  },
  created() {
    document.title = this.$route.meta.title;
    this.sid = parseInt(
      this.$route.query.sid === undefined ? -1 : this.$route.query.sid
    );
    this.cid = parseInt(
      this.$route.query.cid === undefined ? -1 : this.$route.query.cid
    );
    this.numpage = parseInt(
      this.$route.query.page === undefined ? 0 : this.$route.query.page
    );
    if (this.sid >= 0 && this.cid >= 0) {
      this.GetViewCompare(this.numpage);
    }
  },
  methods: {
    async GetViewCompare(page) {
      this.responseDocs = await api.DocCompare(this.sid, this.cid, page - 1);
      //----------------------------------
      let one = this.responseDocs.sourceText,
        other = this.responseDocs.compareText,
        color = "",
        span = null;

      let jsdiff = require("diff");

      let diff = jsdiff.diffChars(one, other),
        display = document.getElementById("viewresult"),
        fragment = document.createDocumentFragment();

      display.innerHTML = "";

      diff.forEach(function(part) {
        color = part.added ? "green" : part.removed ? "red" : "black";
        span = document.createElement("span");
        span.style.color = color;
        span.appendChild(document.createTextNode(part.value));
        fragment.appendChild(span);
      });

      display.appendChild(fragment);
    }
  },
  computed: {}
};
</script>

<style scoped>
#viewresult {
  margin-top: 50px;
}
</style>
