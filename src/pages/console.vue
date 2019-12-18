<template>
  <div id="TheBodyTemplate">
    <div id="container">
      <div id="top-menu">
        <h1 @click="GoHome" class="top-menu-title">
          Справочно-правовая система КФУ
        </h1>
        <ul class="right-side">
          <li class="right-side">
            <button class="top-menu-item exit" @click="OnClickExit"></button>
          </li>
          <li class="right-side">
            <router-link class="top-menu-item home" to="/"></router-link>
          </li>
          <li class="right-side">
            <div v-show="Aletrs > 0" class="notifications">{{ Aletrs }}</div>
            <router-link
              class="top-menu-item bell"
              to="/console/messages/1"
            ></router-link>
          </li>
          <li class="right-side">
            <router-link
              class="top-menu-item bookmark"
              to="/console/bookmark/1"
            ></router-link>
          </li>
          <li class="right-side">
            <router-link class="top-menu-item avatar" to="/console/account/">{{
              MyName
            }}</router-link>
          </li>
        </ul>
      </div>
      <div id="left-menu-fon"></div>
      <div id="left-menu-container">
        <ul id="left-menu">
          <li>
            <p class="left-menu-item left-menu-name left-menu-title">
              Личный кабинет
            </p>
          </li>
          <li>
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/document-list/1"
              >Список документов</router-link
            >
          </li>
          <li v-if="WhoIs === 'admin' || WhoIs === 'manager'">
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/document-management/1"
              >Управление документами</router-link
            >
          </li>
          <li v-if="WhoIs === 'admin' || WhoIs === 'manager'">
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/document-types/1"
              >Управление категориями</router-link
            >
          </li>
          <li v-if="WhoIs === 'admin' || WhoIs === 'manager'">
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/document-load/"
              >Добавить документ</router-link
            >
          </li>
          <li v-if="WhoIs === 'admin'">
            <router-link
              disabled
              class="left-menu-item left-menu-name"
              to="/console/logs/1"
              >Журнал событий</router-link
            >
          </li>
          <!-- <li>
            <router-link class="left-menu-item left-menu-name" to="#">Управление БД</router-link>
          </li>-->
          <li v-if="WhoIs === 'admin'">
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/add-user/"
              >Добавить пользователя</router-link
            >
          </li>
          <li v-if="WhoIs === 'admin'">
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/user-list/1"
              >Управление пользователями</router-link
            >
          </li>
          <li>
            <router-link
              class="left-menu-item left-menu-name"
              to="/console/account/"
              >Ваш профиль</router-link
            >
          </li>
        </ul>
      </div>
      <div id="content">
        <section>
          <router-view></router-view>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "../api";

export default {
  data() {
    return {
      getname: null,
      WhoIs: ""
    };
  },
  created() {
    document.title = this.$route.meta.title;
  },
  computed: {
    MyName() {
      this.getname !== null
        ? this.getname
        : JSON.parse(localStorage.getItem("user"));
      return this.getname !== null
        ? (this.getname.lastName ? this.getname.lastName + " " : "") +
            (this.getname.firstName[0] ? this.getname.firstName[0] + "." : "") +
            (this.getname.surName[0] ? this.getname.surName[0] : "")
        : "";
    },
    Aletrs() {
      return api.CheckUserIsLoggin() ? this.$store.getters.GetCountAlert : 0;
    },
    IsLogged() {
      return api.CheckUserIsLoggin();
    }
  },
  methods: {
    OnClickExit() {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      localStorage.removeItem("_date");
      this.$router.push("/");
    },
    GoHome() {
      this.$router.push("/");
    }
  },
  beforeMount() {
    if (api.CheckUserIsLoggin()) {
      this.$store.dispatch("SetCountOfAlerts");
      const res = JSON.parse(localStorage.getItem("user"));
      this.getname = res;
      this.WhoIs = res["role"];
    }
  }
};
</script>

<style scoped>
#TheBodyTemplate {
  padding-top: 64px;
  min-width: 800px;
}

a,
li {
  text-decoration: none;
  list-style: none;
}

a:hover {
  text-decoration: none;
}

/* TOP Menu */
#top-menu {
  direction: ltr;
  font-size: 13px;
  font-weight: 400;
  line-height: 32px;
  height: 64px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 600px;
  z-index: 100;
  background-color: #ffffff;
}

#top-menu ul,
#top-menu ul li {
  background: 0 0;
  clear: none;
  margin: 0;
  padding: 0;
  position: relative;
  text-indent: 0;
  z-index: 100;
}

#top-menu li:not(:last-child) {
  border-left: solid 1px #ededed;
}

#top-menu ul li:hover {
  background-color: #fafafa;
}

.right-side {
  float: right;
}

.left-side {
  float: left;
}

.top-menu-title {
  width: 250px;
  background-color: #0073aa;
  float: left;
  height: 64px;
  color: white;
  text-align: center;
  line-height: 64px;
  cursor: pointer;
}

.top-menu-item {
  height: 64px;
  display: block;
  padding: 0 30px;
  margin: 0;
  color: #4e4e4e;
  line-height: 64px;
  font-weight: 600;
}

.top-menu-item:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -15px;
  margin-right: 15px;
  opacity: 1;
  display: inline-block;
  width: 29px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 29px 30px;
  transition: opacity 0.3s linear;
}

.avatar {
  padding-right: 50px;
}

.exit {
  border: 0;
  background-color: rgba(255, 255, 255, 0);
}

.avatar:before {
  background-image: url("../assets/img/avatar.png");
}

.exit:before {
  background-image: url("../assets/img/exit-1.png");
}

.bell:before {
  background-image: url("../assets/img/bell.png");
}

.home:before {
  background-image: url("../assets/img/home3.png");
}

.message:before {
  background-image: url("../assets/img/message.png");
}

.bookmark:before {
  background-image: url("../assets/img/Bookmark.png");
}

/* notifications */
.notifications {
  line-height: 14px;
  position: absolute;
  border-radius: 14px;
  font-size: 15px;
  background-color: #fd5d47;
  color: #fff;
  padding: 2px 5px;
  top: 5px;
  right: 9px;
  z-index: 5;
}

/* Left Menu */
#left-menu-fon {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 250px;
  background-color: #23282d;
}

#left-menu-container {
  position: fixed;
  float: left;
  z-index: 99;
  width: 250px;
  background-color: #23282d;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

#left-menu {
  clear: left;
  padding: 0;
  width: inherit;
  margin-left: 0;
  background-color: #23282d;
  margin-bottom: 80px;
}

#left-menu li {
  border: none;
  min-height: 34px;
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.left-menu-item {
  color: #ffffff;
  position: relative;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  padding: 0;
  display: block;
  border-bottom: 1px solid #31383f;
}

#left-menu li:hover:not(:first-child) {
  background: #191e23;
}

#left-menu a:hover {
  color: white;
}

#left-menu .left-menu-name {
  padding: 25px 0;
  padding-left: 15px;
}

.left-menu-title {
  font-size: 26px;
}

/* Content */
#container {
  height: auto;
  min-height: 100%;
  width: 100%;
  position: relative;
  -webkit-font-smoothing: subpixel-antialiased;
}

#content {
  margin: 10px 20px 0px 250px;
  padding-left: 20px;
  padding-bottom: 65px;
  height: 100%;
  position: relative;
  overflow: visible !important;
}
</style>
