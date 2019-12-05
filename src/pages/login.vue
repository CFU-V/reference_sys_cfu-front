<template>
  <div>
    <!-- Login -->
    <div class="login">
      <h1>
        <router-link to="/"></router-link>Вход в систему для пользователей
      </h1>
      <form class="form-login" @submit="OnClickLogin">
        <label for="user_login">Имя пользователя или e-mail</label>
        <input
          required
          type="text"
          id="user_login"
          class="input"
          v-model="login"
          autocomplete="on"
          placeholder="login"
        />
        <label for="user_pass">Пароль</label>
        <input
          required
          type="password"
          id="user_pass"
          class="input"
          v-model="password"
          autocomplete="off"
          placeholder="password"
        />
        <button type="sumbit" class="btn btn-outline-primary">Войти</button>
      </form>
      <div class="alert" :class="success" role="alert">{{ RespText }}</div>
    </div>
    <!-- /Login -->
  </div>
</template>

<script>
import * as api from "../api";

export default {
  name: "Login",
  data() {
    return {
      login: "",
      password: "",
      RespText: "",
      success: ""
    };
  },
  components: {

  },
  methods: {
    async OnClickLogin(e) {
      e.preventDefault();
      if (this.password.length > 0 && this.login.length > 0) {
        try {
          const res = await api.SetLogin(this.login, this.password);
          localStorage.setItem("user", JSON.stringify(res.user));
          localStorage.setItem("jwt", res.token);
          if (localStorage.getItem("jwt") != null) {
            this.$router.push("/");
            localStorage.setItem("_date", new Date().getTime());
            this.$parent.$bvModal._vm.GetOnlineMessage();
          } else {
            this.RespText = "Ошибка во время авторизации!";
            this.success = "alert-danger";
          }
        } catch (error) {
          console.log('Test: ' + error.message);
          if (error == "Error: Request failed with status code 404") {
            this.RespText = "Ошибка! Сервер авторизации временно недоступен.";
            this.success = "alert-danger";
          } else {
            this.RespText = "Неверный логин или пароль!";
            this.success = "alert-danger";
          }
        }
      } else {
        this.RespText = "Вы не ввели логин или пароль!";
        this.success = "alert-danger";
      }
    }
  },
  created() {
    document.title = this.$route.meta.title;
  }
};
</script>

<style scoped>
.alert {
  border-top-right-radius: 0px;
  border-top-left-radius: 0px;
}
/*  */
.login {
  width: 320px;
  padding: 5% 0 0;
  margin: auto;
}

.login form {
  margin-top: 20px;
  margin-left: 0;
  padding: 26px 24px 46px;
  font-weight: 400;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.13);
}

.login label {
  font-size: 15px;
}

.login form .input,
.login input[type="text"] {
  background: #fbfbfb;
  font-size: 24px;
  width: 100%;
  padding: 5px;
  margin: 2px 6px 16px 0;
}

input[type="password"],
input[type="text"] {
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
  background-color: #fff;
  color: #32373c;
  outline: 0;
  transition: 50ms border-color ease-in-out;
}

input[type="password"]:focus,
input[type="text"]:focus {
  border-color: #5b9dd9;
  box-shadow: 0 0 2px rgba(30, 140, 190, 0.8);
  outline: 2px solid transparent;
}

.login h1 a {
  background-image: url(../assets/img/logo_cfuv.png);
  background-size: 140px;
  background-position: center top;
  background-repeat: no-repeat;
  color: #444;
  height: 140px;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3em;
  margin: 0 auto 25px;
  padding: 0;
  text-decoration: none;
  width: 140px;
  text-indent: -9999px;
  outline: 0;
  overflow: hidden;
  display: block;
}

.login .btn {
  float: right;
}

.login .custom-control {
  float: left;
}
</style>
