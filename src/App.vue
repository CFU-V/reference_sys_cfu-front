
<template>
  <div id="app">
    <notifications group="foo" position="top center" />
    <notifications group="OnlineNotifications" position="bottom right" />
    <router-view />
  </div>
</template>

<script>
import io from "../static/js/socket.io";

export default {
  name: "App",
  data() {
    return {
      socket_io: null
    };
  },
  methods: {
    GetOnlineMessage() {
      const unix_date_reg = parseInt(localStorage.getItem("_date"));

      if (unix_date_reg === null || unix_date_reg === undefined)
        throw "[Socket|App] - unix_date_reg unknown";

      const unix_date_now = new Date().getTime();
      const TTL_Token_hour = 12 * 60 * 60 * 1000;
      const jwt = localStorage.getItem("jwt");

      if (
        jwt !== undefined &&
        unix_date_now < unix_date_reg + TTL_Token_hour &&
        this.socket_io === null
      ) {
        const usr = JSON.parse(localStorage.getItem("user"));
        if (usr === null || usr === undefined)
          throw "[Socket|App] - The user is unknown (null||undefined)";

        try {
          this.socket_io = io(process.env.BASE_URL);

          this.socket_io.on("connect", () => {});

          this.socket_io.emit("identity", usr.id);

          this.socket_io.on("message", data => {
            this.$notify({
              group: "OnlineNotifications",
              type: "success",
              title: "Уведомление",
              text: data.message
            });
            this.$store.dispatch(
              "ChangeCountOfAlert",
              this.$store.getters.GetCountAlert + 1
            );
          });
        } catch (error) {
          console.log(`[Socket|App] - ${error}`);
        }
      }
    }
  },
  mounted() {
    try {
      this.GetOnlineMessage();
    } catch (error) {
      console.log(`[Mounted|GetOnlineMessage - ${error}]`);
    }
  }
};
</script>

<style scoped>
#app {
  min-width: 720px;
}
</style>


