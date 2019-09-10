<template>
  <div>
    <!-- Header -->
    <header class="container-image-fon">
      <div class="image-fon"></div>
      <div class="container">
        <nav class="navbar top-info-text">
          <p>Сегодня: {{ GetNowDate }}</p>
          <div class="btn-group">
            <div v-if="IsLogged" class="btn notifications-box">
              <div class="notifications-number">3</div>
              <router-link class="notifications-bell" to="/console/messages/"></router-link>
            </div>
            <button type="button" class="btn btn-outline-primary"
              @click="OnClickConsole">{{ TheTitleBTConsole }}</button>
            <button type="button" class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-if="IsLogged"></button>
            <ul class="dropdown-menu" v-if="IsLogged">
              <li>
                <router-link class="dropdown-item" to="/console/account/">Ваш профиль</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/console/document-list/">Список документов</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/console/bookmark/">Закладки</router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/console/messages/">Сообщения</router-link>
              </li>
              <li>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="OnClickExit">Выйти</button>
              </li>
            </ul>
          </div>
        </nav>
        <nav class="navbar">
          <h1>Справочно-правовая система КФУ</h1>
          <ul class="btn-group">
            <li>
              <router-link class="btn" to="/">Главная</router-link>
            </li>
            <!-- <li>
              <router-link class="btn" to="#">Новости</router-link>
            </li>-->
            <li>
              <router-link class="btn" to="/search/1/">Расширенный поиск</router-link>
            </li>
            <li data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <router-link class="btn dropdown-toggle" to="">Класификация документов</router-link>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <router-link class="dropdown-item" to="/search/1/Законодательство">Законодательство</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Судебная практика">Судебная практика</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Финансовые и кадровые консультации">Финансовые и
                    кадровые консультации</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Консультации для бюджетных организаций">Консультации
                    для бюджетных организаций</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Комментарии законодательства">Комментарии
                    законодательства</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Формы документов">Формы документов</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Технические нормы и правила">Технические нормы и
                    правила</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Проекты правовых актов">Проекты правовых актов
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Международные правовые акты">Международные правовые
                    акты</router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/search/1/Правовые акты по здравоохранению">Правовые акты по
                    здравоохранению</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="container-search">
          <img src="../assets/img/logo_cfuv.png" alt />
          <div class="search-box">
            <div class="form-group has-search">
              <span class="fa fa-search form-control-feedback"></span>
              <span class="form-control-feedback-close" v-show="searchQuery" @click="removeSearchQuery">+</span>
              <input @keyup.enter="enterClicked()" v-model="searchQuery" @keyup="submitSearch" type="text"
                class="form-control"
                :class="ResponseSQ.length > 0 ? 'del-border-radius-bottom' : 'add-border-radius-bottom'"
                :placeholder="'Быстрый поиск документов..'" />
              <div v-show="ResponseSQ.length > 0 && ResponseSQ != ''" class="ResponseSQ add-border-radius-bottom">
                <article @click="GoPush(value['id'])" v-for="(value, index) in ResponseSQ" :key="index">
                  <span>
                    <h3>{{ value['title'] }}</h3>
                    <p>Вид: {{ GetDocCategory[value['categoryId']-1] }} </p>
                  </span>
                  <span>
                    <p>{{ convert(value['createdAt']) }}</p>
                    <img v-show="value['consultant_link'] != null" src="../assets/img/KSPlust-icon.png" alt="">
                  </span>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
import * as api from "../api";
import moment from "moment";

export default {
  data() {
    return {
      NowDate: new Date(),
      IsLogged: localStorage.getItem("jwt"),
      searchQuery: "",
      ResponseSQ: []
    };
  },
  computed: {
    GetDocCategory() {
      return this.$store.getters.GetDocCategory;
    },
    GetNowDate() {
      return (
        this.$store.getters.GetWeekNames[this.NowDate.getDay()] +
        ", " +
        this.NowDate.getDate() +
        " " +
        this.$store.getters.GetmonthNames[this.NowDate.getMonth()] +
        " " +
        this.NowDate.getFullYear()
      );
    },
    TheTitleBTConsole() {
      return this.IsLogged != null ? "Личный кабинет" : "Войти";
    }
  },
  methods: {
    convert(_date) {
      var date = new Date(_date);
      return date.toLocaleDateString() + ' ' + date.getHours() + ":" + date.getMinutes();
    },
    GoPush(_id) {
      if(!(_id != null && parseInt(_id) > -1)) {
        console.log('[GoPush-HEADER] - Unknown ID');
        return;
      }
      this.$router.push("/docview/" + _id);
    },
    removeSearchQuery() {
      this.searchQuery = "";
      this.ResponseSQ = [];
    },
    async submitSearch() {
      if(!(this.searchQuery.length > 0)) {
        this.removeSearchQuery();
        return;
      }
      try {
        const res = await api.GetDocumentList(0,true,this.searchQuery);
        this.ResponseSQ = res.items;
      } catch (error) {

      }
    },
    OnClickConsole() {
      if (this.IsLogged != null) {
        this.$router.push("/console/account/");
      } else {
        this.$router.push("/login/");
      }
    },
    OnClickExit() {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      this.IsLogged = null;
    },
    ViewNotification(_title,_text,_type) {
      this.$notify({
        group: 'foo',
        type: _type,
        title: _title,
        text: _text,
      });
    },
    enterClicked() {
      if(!(this.searchQuery.length > 0)) {
        this.ViewNotification('Внимание','Ошибка! Вы ничего не ввели','error');
        return;
      }
      this.$router.push("/search/1/" + this.searchQuery);
    }
  }
};
</script>

<style scoped>
* {
  text-decoration: none;
  list-style-type: none;
}

.dropdown-menu {
  float: right;
  right: 0;
  left: unset;
  margin: 0 0 0;
}

/* notifications */
.notifications-box {
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 20px;
  width: 40px;
  margin-right: 20px;
  border-radius: 40px !important;
}

.notifications-box:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.notifications-number {
  line-height: 13px;
  position: absolute;
  border-radius: 14px;
  font-size: 12px;
  background-color: #fd5d47;
  color: #fff;
  padding: 1px 4px;
  top: -5px;
  right: -1px;
  z-index: 2;
}
.notifications-bell:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -15px;
  margin-right: 8px;
  opacity: 1;
  display: inline-block;
  width: 21px;
  height: 27px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 21px 27px;
  -webkit-transition: opacity 0.3s linear;
  transition: opacity 0.3s linear;
  z-index: 1;
  background-image: url("../assets/img/white-bell.png");
}

/* Image Fon */
.container-image-fon {
  will-change: transform;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: 0;
  background-position: center;
  background-size: cover;
  min-height: 750px;
}

.image-fon {
  background-image: url("../assets/img/main_fon.jpg");
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1;
  background-position: center;
  background-size: cover;
}

.image-fon::before {
  background-color: rgba(0, 0, 0, 0.5);
}

.image-fon:before,
.image-fon:after {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: "";
}

/* Menu */
header {
  color: white;
}

.top-info-text {
  margin-top: 25px;
  margin-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.top-info-text p {
  opacity: 0.6;
}

.btn-group > button {
  color: white;
}

.btn {
  color: white;
}

.btn:hover {
  /* background-color: #007bff; */
  color: white;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: 0 0 0 0rem rgba(0, 0, 0, 0);
  /* background-color: #007bff; */
}

.btn-group > li > a {
  position: relative;
}

.btn-group > li:not(.btn):hover a:before {
  color: inherit;
  -webkit-transform: scaleX(1);
  -ms-transform: scaleX(1);
  transform: scaleX(1);
}

.btn-group > li:not(.btn) > a:before {
  position: absolute;
  z-index: -1;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  content: "";
  transition: all 300ms cubic-bezier(0.34, 0.9, 0.7, 1);
  -webkit-transform: scaleX(0);
  -ms-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transform-origin: 50%;
  -ms-transform-origin: 50%;
  transform-origin: 50%;
}

/* Search */
.container-search {
  width: 100%;
  text-align: center;
  margin-top: 50px;
}

.search-box {
  width: 60%;
  margin: 50px auto;
}

.form-control {
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.add-border-radius-bottom {
  border-bottom-right-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.del-border-radius-bottom {
  border-bottom-right-radius: 0rem;
  border-bottom-left-radius: 0rem;
}

.ResponseSQ {
  overflow-y: auto;
  width: 100%;
  max-height: 200px;
  background-color: #fff;
  border: 1px solid #ced4da;
}

.ResponseSQ article {
  color: black;
  text-align: left;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  padding: 1.6rem;
  margin-bottom: 0.8rem;
  transition: .4s ease-out;
  display: flex;
}

.ResponseSQ article:hover {
  background: lightgray;
  cursor: pointer;
}

.ResponseSQ article img {
  width: 25px;
  float: right;
}

.ResponseSQ article span:first-child {
  width: 80%;
}

.ResponseSQ article span:last-child {
  width: 20%;
}

.has-search {
  position: relative;
}

.has-search .form-control {
  padding-left: 2.375rem;
  padding-right: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
}

.form-control-feedback-close {
  font-size: 43px;
  color: #ddd;
  cursor: pointer;
  top: -15px;
  right: 0;
  position: absolute;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.form-control-feedback-close:hover {
  color: #007bff;
  -moz-text-shadow: 0 0 5px #007bff;
  -webkit-text-shadow: 0 0 5px #007bff;
  text-shadow: 0 0 5px #007bff;
}

/* Tips For Search */
</style>
