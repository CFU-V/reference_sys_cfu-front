<template>
  <div>
    <!-- MW Login -->
    <b-modal
      size="md"
      id="modal-login"
      ref="modal_login"
      hide-footer
      title="повторно авторизуйтесь"
    >
      <button
        :style="$route.path != '/' ? 'width:50%' : ''"
        class="btn btn-success"
        @click="PushForward(true)"
      >На страницу авторизации</button>
      <button
        style="width:49%"
        v-show="$route.path != '/'"
        class="btn btn-outline-primary"
        @click="PushForward(false)"
      >На главную страницу</button>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";

export default {
  props: {
    viewMW: Boolean
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    PushForward(_action) {
      if (_action) {
        if (this.$router.path != "/login/") this.$router.push("/login/");
      } else {
        if (this.$router.path != "/") this.$router.push("/");
      }
    },
    Check() {
      try {
        const unix_date_reg = parseInt(localStorage.getItem("_date"));
        if (unix_date_reg !== null && unix_date_reg !== undefined) {
          const unix_date_now = new Date().getTime();
          const TTL_Token_hour = 12 * 60 * 60 * 1000;// !ИСПРАВИТЬ
          if (unix_date_now >= unix_date_reg + TTL_Token_hour) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("_date");
            localStorage.removeItem("user");
            if (this.viewMW !== null && this.viewMW === true) {
              this.$bvModal.show("modal-login");
            } else {
              if (this.$router.path !== "/login/") this.$router.push("/login/");
            }
          }
        }
      } catch (error) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("_date");
        localStorage.removeItem("user");
        if (this.$router.path !== "/login/") this.$router.push("/login/");
      }
    }
  },
  mounted() {
    this.Check();
  }
};
</script>

<style scoped>
#modal-login button {
  width: 100%;
  margin-top: 15px;
}
</style>
