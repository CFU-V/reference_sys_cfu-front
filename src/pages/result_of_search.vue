<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- Header -->
    <header class="container-image-fon">
      <div class="image-fon"></div>
      <div class="container">
        <nav class="navbar top-info-text">
          <p>Сегодня: {{ GetNowDate }}</p>
          <div class="btn-group">
            <div v-if="IsLogged" class="btn notifications-box">
              <div v-show="Aletrs > 0" class="notifications-number">{{Aletrs}}</div>
              <router-link class="notifications-bell" to="/console/messages/"></router-link>
            </div>
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="OnClickConsole"
            >{{ TheTitleBTConsole }}</button>
            <button
              type="button"
              class="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              v-if="IsLogged"
            ></button>
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
                <router-link class="dropdown-item" to="/console/messages/">Уведомления</router-link>
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
            <li>
              <router-link class="btn" to="/search/1/">Расширенный поиск</router-link>
            </li>
            <li data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <a class="btn dropdown-toggle">Классификация документов</a>
              <ul class="dropdown-menu dropdown-menu-right">
                <li v-for="(value, index) in GetDocCategory" :key="index">
                  <button class="dropdown-item" @click="GetViewOnlyCategory(value)">{{value}}</button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="container-search">
          <img src="../assets/img/logo_cfuv.png" alt />
        </div>
      </div>
    </header>
    <!-- Content -->
    <div class="content-wrapper">
      <section class="container section-news">
        <h2>Результат поиска</h2>
        <switch-toggle
          :checked="ViewAdvanceSearch"
          first_text="Расширенный поиск"
          last_text="Быстрый поиск"
          @IsChanged="OnClickSwitchButton"
        ></switch-toggle>
        <transition name="Animation_SwitchSimpleSearch">
          <form class="form-inline search-box" v-show="(ViewAdvanceSearch == false)">
            <div class="input-group">
              <input
                type="search"
                class="form-control"
                id="inlineFormInputName2"
                v-model="SimpleSearchText"
                :placeholder="'Быстрый поиск документов'"
              />
            </div>
            <button type="submit" class="btn btn-success" @click.prevent="GetSimpleSearch">Поиск</button>
          </form>
        </transition>
        <transition name="Animation_SwitchAdvanceSearch">
          <form class="form-table" v-show="ViewAdvanceSearch">
            <h2>Расширенный поиск</h2>
            <table>
              <tbody>
                <tr>
                  <th>
                    <label for="text-of-document">Текст документа</label>
                  </th>
                  <td>
                    <input class="regular-text" type="text" id="text-of-document" />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="name-of-document">Название документа</label>
                  </th>
                  <td>
                    <input
                      class="regular-text"
                      type="text"
                      id="name-of-document"
                      v-model="AdvanceDataSearch.title"
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="number-of-document">Номер (приказа/документа и тд)</label>
                  </th>
                  <td>
                    <input
                      class="regular-text"
                      type="text"
                      id="number-of-document"
                      v-model="AdvanceDataSearch.number"
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="dateReg">Дата регистрации</label>
                  </th>
                  <td>
                    <input
                      class="regular-text"
                      type="date"
                      id="dateReg"
                      v-model="AdvanceDataSearch.dateReg"
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="dateAdd">Дата добавления</label>
                  </th>
                  <td>
                    <input
                      class="regular-text"
                      type="date"
                      id="dateAdd"
                      v-model="AdvanceDataSearch.dateAdd"
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="category-of-document">Вид документа</label>
                  </th>
                  <td>
                    <select
                      class="custom-select"
                      id="category-of-document"
                      v-model="AdvanceDataSearch.category"
                    >
                      <option value disabled>Фильтр по классификации документа</option>
                      <option value="Все">Все</option>
                      <option
                        v-for="(value, index) in GetDocCategory"
                        :key="index"
                        :value="value"
                      >{{value}}</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <th>
                    <label for="status-of-document">Статус</label>
                  </th>
                  <td>
                    <select
                      class="custom-select"
                      id="status-of-document"
                      v-model="AdvanceDataSearch.active"
                    >
                      <option value disabled>(Активный/Неактивный)</option>
                      <option value="Все">Все</option>
                      <option value="true">Активный</option>
                      <option value="false">Неактивный</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="submit" class="btn btn-success" @click.prevent="GetAdvanceSearch">Поиск</button>
          </form>
        </transition>
        <p class="table_caption">Таблица документов</p>
        <table class="table_blur">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип документа</th>
              <th>Дата регистрации</th>
              <th>Действие</th>
            </tr>
          </thead>
          <transition-group name="Animation_ViewItems" tag="tbody">
            <tr v-if="IsLoadingItems" :key="1">
              <td colspan="4">
                <loadingsmall :IsLoading="IsLoadingItems" :center="true" style="width:100%"></loadingsmall>
              </td>
            </tr>
            <tr v-else-if="GetDocumentList.items.length <= 0 && IsLoadingItems == false" :key="2">
              <td colspan="4" style="text-align: center;">Документов не найдено</td>
            </tr>
            <tr v-else v-for="(value, index) in GetDocumentList.items" :key="index + 2">
              <td>
                <img
                  v-show="value.consultant_link !== null && value.consultant_link !== ''"
                  src="../assets/img/KSPlust-icon.png"
                  alt
                />
                <router-link :to="'/docview/' + value.id">{{ value.title }}</router-link>
              </td>
              <td>{{ value.category }}</td>
              <td>{{ convert(value.registeredAt) }}</td>
              <td>
                <button
                  :disabled="!IsLogged || (value.consultant_link !== null && value.consultant_link !== '')"
                  class="btn btn-success"
                  @click="ShowModal(value.title, value.id, index)"
                >Свойства</button>
              </td>
            </tr>
          </transition-group>
          <tfoot>
            <tr>
              <th
                colspan="4"
              >Показано {{ GetDocumentList.items.length }} из {{ GetDocumentList.total }} документов</th>
            </tr>
          </tfoot>
        </table>
        <!-- PageNavigator -->
        <page-nav
          @click="GetSearch"
          url="/search/"
          :maxPage="GetDocumentList.pages"
          :Page="$route.params.page"
        ></page-nav>
      </section>
    </div>
    <!-- Footer -->
    <footer class="footer-wrapper">
      <h3>Справочно-правовая система КФУ 2019{{TheNextFooterYear}} (с)</h3>
    </footer>
    <!-- MW View prop -->
    <b-modal size="lg" id="modal-scoped">
      <template slot="modal-header">
        <h5>Свойства документа: {{ SelectDoc_title }}</h5>
      </template>
      <template slot="default" v-if="Property != null">
        <p>Автор: {{ Property.creator }}</p>
        <p>Кем сохранен: {{ Property.lastModifiedBy }}</p>
        <p>Редакция: {{ Property.revision }}</p>
        <p>Дата создания документа: {{ convert_date(Property.createdAt) }}</p>
        <p>Дата последнего сохранения: {{ convert_date(Property.updatedAt) }}</p>
        <p>Название: {{ Property.title }}</p>
        <p>Тема: {{ Property.subject }}</p>
        <p>Теги: {{ Property.keywords }}</p>
        <p>Информация: {{ GetInfoProp }}</p>
      </template>
      <template v-else>
        <p>Свойства документа не обнаружены!</p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- /MW View prop -->
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import LoginCheck from "../components/logincheck.vue";
import switchToggle from "../components/switch_toggle";
import loadingsmall from "../components/loading_small.vue";
import * as api from "../api";
import mnt, { isDate, invalid } from "moment";

export default {
  data() {
    return {
      NowDate: new Date(),
      ViewAdvanceSearch: false,
      SimpleSearchText: "",
      PageNum: 1,
      SelectDoc_title: "",
      DataSearch: {
        type: "simple",
        visibility: true,
        data: null
      },
      IsLogin: false,
      AdvanceDataSearch: {
        text: "",
        title: "",
        number: "",
        dateReg: "",
        dateAdd: "",
        category: "",
        active: ""
      },
      Property: null,
      IsLoadingItems: false
    };
  },
  components: {
    LoginCheck,
    switchToggle,
    loadingsmall,
    PageNav: Navigator
  },
  computed: {
    Aletrs() {
      return this.IsLogged ? this.$store.getters.GetCountAlert : 0;
    },
    TheTitleBTConsole() {
      return this.IsLogged ? "Личный кабинет" : "Войти";
    },
    IsLogged() {
      return this.IsLogin;
    },
    GetInfoProp() {
      if (this.Property !== null && this.Property.index > -1) {
        return this.ObjectHasKey(
          this.GetDocumentList.items[this.Property.index],
          "info"
        )
          ? this.GetDocumentList.items[this.Property.index].info
          : "";
      } else return "";
    },
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
    TheNextFooterYear() {
      const year = this.NowDate.getFullYear();
      return year > 2019 ? "-" + year : "";
    },
    GetDocumentList() {
      return this.$store.getters.GetDocSearchList;
    }
  },
  methods: {
    ObjectHasKey(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    },
    OnClickSwitchButton(e) {
      this.ViewAdvanceSearch = e;
    },
    async GetProps(_id, _index) {
      try {
        const res = await api.GetProperty(_id);
        this.Property = {};
        this.Property = res;
        this.Property.index = _index;
      } catch (error) {
        this.Property = null;
      }
    },
    ShowModal(_title, _id, _index) {
      this.SelectDoc_title = _title;
      this.GetProps(_id, _index);
      this.$bvModal.show("modal-scoped");
    },
    convert(unixtimestamp) {
      const date = new Date(Math.floor(unixtimestamp));
      const res = date.toLocaleDateString();
      if (res != "Invalid Date NaN:NaN") return res;
      else return "";
    },
    convert_date(_date) {
      var date = new Date(_date);
      const res =
        date.toLocaleDateString() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
      if (res != "Invalid Date NaN:NaN") return res;
      else return "";
    },
    OnClickConsole() {
      if (this.IsLogged) {
        this.$router.push("/console/account/");
      } else {
        this.$router.push("/login/");
      }
    },
    OnClickExit() {
      localStorage.removeItem("user");
      localStorage.removeItem("jwt");
      localStorage.removeItem("_date");
      this.IsLogin = false;
    },
    GetAdvanceSearch() {
      try {
        this.DataSearch.data = [];
        this.DataSearch.type = "advance";
        if (this.AdvanceDataSearch.text != "")
          this.DataSearch.data.push({
            query: this.AdvanceDataSearch.text,
            field: "text"
          });
        if (this.AdvanceDataSearch.title != "")
          this.DataSearch.data.push({
            query: this.AdvanceDataSearch.title,
            field: "title"
          });
        if (this.AdvanceDataSearch.number != "")
          this.DataSearch.data.push({
            query: this.AdvanceDataSearch.number,
            field: "number.keyword"
          });
        if (this.AdvanceDataSearch.dateAdd != "")
          this.DataSearch.data.push({
            query: new Date(
              mnt(this.AdvanceDataSearch.dateAdd).format("YYYY.MM.DD")
            ).getTime(),
            field: "createdAt"
          });
        if (this.AdvanceDataSearch.dateReg != "")
          this.DataSearch.data.push({
            query: new Date(
              mnt(this.AdvanceDataSearch.dateReg).format("YYYY.MM.DD")
            ).getTime(),
            field: "registeredAt"
          });
        if (
          this.AdvanceDataSearch.category != "" &&
          this.AdvanceDataSearch.category != "Все"
        )
          this.DataSearch.data.push({
            query: this.AdvanceDataSearch.category,
            field: "category.keyword"
          });
        if (
          this.AdvanceDataSearch.active != "" &&
          this.AdvanceDataSearch.active != "Все"
        )
          this.DataSearch.data.push({
            query: this.AdvanceDataSearch.active,
            field: "active"
          });
        this.GetSearch(this.PageNum, true);
      } catch (error) {
        console.log("[AdvanceSearch] - ERROR!");
      }
    },
    GetViewOnlyCategory(category) {
      try {
        this.DataSearch.data = [];
        this.DataSearch.type = "advance";
        this.AdvanceDataSearch.category = category;
        this.DataSearch.data.push({
          query: category,
          field: "category.keyword"
        });
        this.ViewAdvanceSearch = true;
        this.GetSearch(this.PageNum, true);
      } catch (error) {
        console.log("[AdvanceSearch|GetViewOnlyCategory] - ERROR!");
      }
    },
    GetSimpleSearch() {
      this.DataSearch.type = "simple";
      this.DataSearch.data = this.SimpleSearchText;
      this.GetSearch(this.PageNum, true);
    },
    ViewNotification(_title, _text, _type) {
      this.$notify({
        group: "foo",
        type: _type,
        title: _title,
        text: _text
      });
    },
    async GetSearch(_page) {
      if (this.DataSearch.data === null || this.DataSearch.data === "") {
        if (
          !(
            this.DataSearch.type === "advance" &&
            (this.AdvanceDataSearch.category === "Все" ||
              this.AdvanceDataSearch.active === "Все")
          )
        ) {
          this.ViewNotification(
            "Внимание",
            "Ошибка! Вы ничего не заполнили",
            "error"
          );
          return;
        }
      }
      this.IsLoadingItems = true;
      try {
        const res = await this.$store.dispatch("SetDocuments", {
          search: true,
          type: this.DataSearch.type,
          content: "documents",
          page: _page - 1,
          data: this.DataSearch.data,
          typeState: "search"
        });
      } catch (error) {}
      this.IsLoadingItems = false;
    }
  },
  created() {
    this.PageNum = parseInt(
      this.$route.params.page != null ? this.$route.params.page : 1
    );
    if (isNaN(this.PageNum)) this.PageNum = 1;
    document.title = this.$route.meta.title;
    const text_ = this.$route.params.simple;
    this.$store.dispatch("DeleteAllSearchList");
    if (text_ !== null && text_ !== "" && text_ !== undefined) {
      if (this.GetDocCategory.indexOf(text_) >= 0) {
        this.$router.push("/search/" + this.PageNum);
        this.GetViewOnlyCategory(text_);
      } else {
        try {
          this.DataSearch.data = text_;
          this.SimpleSearchText = text_;
          this.$router.push("/search/" + this.PageNum);
          this.GetSearch(this.PageNum, true);
        } catch (error) {
          console.error("[Simple search - created] - ERROR");
        }
      }
    }
  },
  mounted() {
    if (api.CheckUserIsLoggin()) {
      this.$store.dispatch("SetCountOfAlerts");
      this.IsLogin = true;
    }
    this.$store.dispatch("SetDocumentCategories");
  }
};
</script>

<style scoped>
a,
li {
  text-decoration: none;
  list-style-type: none;
}

/* Animation_ViewItems */

.Animation_ViewItems-enter-active {
  transition: all 0.8s ease;
}

.Animation_ViewItems-leave-active {
  transition: all 0.1s ease;
}

.Animation_ViewItems-enter,
.Animation_ViewItems-leave-to {
  opacity: 0;
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
  color: white;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: 0 0 0 0rem rgba(0, 0, 0, 0);
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
  margin-top: 100px;
}

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

/* Footer */
.footer-wrapper {
  padding-bottom: 50px;
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

/* Advance Search */
.Animation_SwitchAdvanceSearch-enter-active {
  transition: all 0.6s ease;
}

.Animation_SwitchAdvanceSearch-leave-active {
  transition: all 0.4s ease;
}

.Animation_SwitchAdvanceSearch-enter,
.Animation_SwitchAdvanceSearch-leave-to {
  opacity: 0;
}

.Animation_SwitchSimpleSearch-enter-active {
  transition: all 0.6s ease;
}

.Animation_SwitchSimpleSearch-leave-active {
  transition: all 0.4s ease;
}

.Animation_SwitchSimpleSearch-enter,
.Animation_SwitchSimpleSearch-leave-to {
  opacity: 0;
}

.form-table {
  border-collapse: collapse;
  margin-top: 50px;
  width: 100%;
  font-size: 15px;
}

.form-table button {
  min-width: 160px;
  margin-right: 20px;
}

.form-table th {
  vertical-align: top;
  text-align: left;
  padding: 20px 10px 20px 0;
  width: 200px;
  line-height: 1.3;
  font-weight: 600;
  color: #23282d;
  text-shadow: none;
  vertical-align: baseline;
}

.form-table,
.form-table td,
.form-table td p,
.form-table th {
  font-size: 15px;
}

.form-table td {
  margin-bottom: 9px;
  padding: 15px 10px;
  line-height: 1.3;
  vertical-align: middle;
}

input[type="checkbox"],
input[type="color"],
input[type="date"],
input[type="datetime-local"],
input[type="datetime"],
input[type="email"],
input[type="month"],
input[type="number"],
input[type="password"],
input[type="radio"],
input[type="search"],
input[type="tel"],
input[type="text"],
input[type="time"],
input[type="url"],
input[type="week"],
select,
textarea {
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
  background-color: #fff;
  color: #32373c;
  outline: 0;
  transition: 50ms border-color ease-in-out;
}

input.disabled,
input:disabled {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(222, 222, 222, 0.75);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  color: rgba(51, 51, 51, 0.5);
}

input[type="checkbox"]:focus,
input[type="color"]:focus,
input[type="date"]:focus,
input[type="datetime-local"]:focus,
input[type="datetime"]:focus,
input[type="email"]:focus,
input[type="month"]:focus,
input[type="number"]:focus,
input[type="password"]:focus,
input[type="radio"]:focus,
input[type="search"]:focus,
input[type="tel"]:focus,
input[type="text"]:focus,
input[type="time"]:focus,
input[type="url"]:focus,
input[type="week"]:focus,
select:focus,
textarea:focus {
  border-color: #5b9dd9;
  box-shadow: 0 0 2px rgba(30, 140, 190, 0.8);
  outline: 2px solid transparent;
}

input[type="checkbox"],
input[type="color"],
input[type="date"],
input[type="datetime-local"],
input[type="datetime"],
input[type="email"],
input[type="month"],
input[type="number"],
input[type="password"],
input[type="radio"],
input[type="tel"],
input[type="text"],
input[type="time"],
input[type="url"],
input[type="week"],
textarea {
  font-size: 15px;
  padding: 3px 5px;
  border-radius: 0;
}

p.description,
span.description {
  font-size: 13px;
  font-style: italic;
}

.regular-text {
  width: 26em;
  margin-bottom: 15px;
}

/* Search */
.search-box {
  width: 100%;
  margin: 50px auto;
}

.search-box input[type="search"] {
  width: 400px;
}

.search-box .input-group select {
  width: 330px;
}

.search-box button {
  min-width: 160px;
  margin-right: 20px;
}

.input-group {
  margin-right: 30px;
}

.search-box input,
.search-box select,
.search-box button {
  margin-top: 20px;
}

/* Table */
.table_blur {
  background-color: #f5ffff;
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}

.table_caption {
  margin-top: 20px;
}

.table_blur th {
  border-top: 1px solid #2980b9;
  border-bottom: 1px solid #2980b9;
  background-color: #2980b9;
  color: white;
  padding: 10px 15px;
  position: relative;
}

.table_blur th:after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 25%;
  height: 25%;
  width: 100%;
}

.table_blur tr:nth-child(odd) {
  background-color: #ebf3f9;
}

.table_blur th:first-child {
  border-left: 1px solid #2980b9;
  border-bottom: 1px solid #2980b9;
}

.table_blur th:last-child {
  border-right: 1px solid #2980b9;
  border-bottom: 1px solid #2980b9;
}

.table_blur td {
  border: 1px solid #d1e6f7;
  padding: 10px 15px;
  position: relative;
  transition: all 0.3s ease;
}

.table_blur td > img {
  width: 28px;
  height: 28px;
}

.table_blur td:first-child {
  max-width: 400px;
}

.table_blur th:first-child {
  max-width: 400px;
}
</style>
