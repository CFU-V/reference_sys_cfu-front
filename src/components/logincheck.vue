<template>
  <div>
    <!-- MW Login -->
    <b-modal
      id="modal-login"
      ref="modal_login"
      hide-footer
      title="повторно авторизуйтесь"
      @hidden="ResetMW"
    >
      <button class="btn btn-success" block @click="PushForward(true)">На страницу авторизации</button>
      <button class="btn btn-outline-success" block @click="PushForward(false)">На главную страницу</button>
    </b-modal>
  </div>
</template>

<script>
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
        this.$router.push("/login/");
      } else {
        this.$router.push("/");
      }
    },
    ResetMW() {
      this.$router.push("/login/");
    },
    Check() {
      if (localStorage.getItem("_date") != null || localStorage.getItem("jwt") != null) {
        try {
          const unix_date_reg = parseInt(localStorage.getItem("_date"));
          const unix_date_now = new Date().getTime();
          const TTL_Token_hour = 12 * 60 * 60 * 1000;
          if (unix_date_now > unix_date_reg + TTL_Token_hour) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("_date");
            localStorage.removeItem("user");
            if (this.viewMW != null && this.viewMW == true) {
              this.$bvModal.show("modal-login");
            } else {
              this.$router.push("/login/");
            }
          }
        } catch (error) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("_date");
          localStorage.removeItem("user");
          this.$router.push("/login/");
        }
      }
    }
  },
  mounted() {
    this.Check();
  }
};
</script>

<style scoped>
</style>
