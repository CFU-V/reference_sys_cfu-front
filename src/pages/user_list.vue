<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Управление пользователями</h2>
    <form class="form-inline search-box">
      <div class="input-group">
        <input
          type="search"
          class="form-control"
          id="inlineFormInputName2"
          :placeholder="'ФИО пользователя'"
          v-model="DataSearch.FIO"
        />
        <select class="custom-select" v-model="DataSearch.roleId">
          <option value disabled>Фильтр по роли</option>
          <option value="0">Все</option>
          <option value="3">Пользователь</option>
          <option value="2">Менеджер</option>
          <option value="1">Администратор</option>
        </select>
      </div>
      <button type="submit" class="btn btn-success" @click.prevent="StartSearch">Поиск</button>
    </form>
    <button
      v-show="IsSearch"
      class="btn btn-outline-primary"
      style="margin-top: 50px"
      @click="StartInfo"
    >Показать всех пользователей</button>
    <p class="table_caption">Список пользователей</p>
    <!-- Table of List user -->
    <div class="OverflowY_scroll">
      <table class="table_blur">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Имя пользователя</th>
            <th>Роль</th>
            <th>Должность</th>
            <th>Действие</th>
          </tr>
        </thead>
        <transition-group name="Animation_ViewItems" tag="tbody">
          <tr v-if="IsLoadingItems" :key="1">
            <td colspan="5">
              <loadingsmall :IsLoading="IsLoadingItems" :center="true" style="width:100%"></loadingsmall>
            </td>
          </tr>
          <tr v-else-if="Items.user.length <= 0 && IsLoadingItems == false" :key="2">
            <td colspan="5" style="text-align: center;">Пользователей не найдено</td>
          </tr>
          <tr v-else v-for="(value, index) in Items.user" :key="index + 2">
            <td>{{ value['login'] }}</td>
            <td>{{ (value['lastName'] ? value['lastName'] : '') + ' ' + (value['firstName'][0] ? value['firstName'][0] + '.' : '') + (value['surName'][0] ? value['surName'][0] : '') }}</td>
            <td>{{ value['role'] }}</td>
            <td>{{ value['position'] }}</td>
            <td>
              <button
                :disabled="Myuser.id == value['id']"
                class="btn btn-success"
                @click="ShowModalWindow_change((value['lastName'] ? value['lastName'] : '') + ' ' + (value['firstName'][0] ? value['firstName'][0] + '.' : '') + (value['surName'][0] ? value['surName'][0] : ''),value['id'],index)"
              >Редактировать</button>
              <button
                :disabled="Myuser.id == value['id']"
                class="btn btn-outline-danger"
                @click="ShowModalWindow_delete((value['lastName'] ? value['lastName'] : '') + ' ' + (value['firstName'][0] ? value['firstName'][0] + '.' : '') + (value['surName'][0] ? value['surName'][0] : ''),value['id'],index)"
              >Удалить</button>
            </td>
          </tr>
        </transition-group>
        <tfoot>
          <tr>
            <th colspan="5">Показано {{ Items.user.length }} из {{ Items.total }} пользователей</th>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- PageNavigator -->
    <page-nav
      @click="GetStartInfo"
      url="/console/user-list/"
      :maxPage="Items.pages"
      :Page="$route.params.page"
    ></page-nav>
    <!-- Modal Window Delete user -->
    <b-modal
      size="lg"
      ref="modal_delete"
      id="modal-scoped"
      @hidden="resetModal_change_user"
      @ok="handleOk"
    >
      <template slot="modal-header">
        <h5>Подтверждение</h5>
      </template>
      <template slot="default">
        <p>
          Вы уверены, что хотите удалить этого пользователя
          <b>{{ TheUser }}</b>?
        </p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="md" variant="success" @click="ok()">Удалить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- Modal Window Change user -->
    <b-modal
      size="lg"
      id="modal-prevent-closing"
      :title="'Редактирование пользователя: ' + TheUser"
      @hidden="resetModal_change_user"
      @ok="handleOk_change_user"
    >
      <form ref="form" class="form-table">
        <h2>Персональные настройки пользователя</h2>
        <table>
          <tbody>
            <tr>
              <th>
                <label for="_login">
                  Логин
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="text"
                  id="_login"
                  placeholder="Логин"
                  v-model="user.login"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="first-name">
                  Имя
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="text"
                  id="first-name"
                  placeholder="Имя"
                  v-model="user.firstName"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="second-name">
                  Фамилия
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="text"
                  id="second-name"
                  placeholder="Фамилия"
                  v-model="user.lastName"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="middle-name">Отчество</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="middle-name"
                  placeholder="Отчество"
                  v-model="user.surName"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="phone">
                  Телефон
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="tel"
                  id="phone"
                  placeholder="+7978 111-22-33"
                  pattern="\+\d\d{3} \d{3}-\d{2}-\d{2}"
                  v-model="user.phone"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="status">
                  Должность
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="text"
                  id="status"
                  placeholder="Разработчик"
                  v-model="user.position"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="rule">
                  Роль
                  <span style="color:red">*</span>
                </label>
              </th>
              <td>
                <select id="rule" v-model="user.roleId">
                  <option value disabled>Выберите роль</option>
                  <option value="3">Пользователь</option>
                  <option value="2">Менеджер</option>
                  <option value="1">Администратор</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>
                <label for="pass">Пароль</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="password"
                  id="pass"
                  autocomplete="off"
                  v-model="user.password_1"
                  placeholder="Пароль (новый)"
                />
                <span class="description">пароль (минимум 8 символов)</span>
                <br />
                <input
                  class="regular-text"
                  type="password"
                  autocomplete="off"
                  v-model="user.password_2"
                  placeholder="Пароль (повторите)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </form>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button
          :disabled="IsLoading"
          size="md"
          variant="success"
          @click="ok()"
        >Редактировать (сохранить)</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import * as api from "../api";
import LoginCheck from "../components/logincheck.vue";
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      IsLoading: false,
      IsLoadingItems: false,
      IsSearch: false,
      Myuser: null,
      DataSearch: {
        FIO: "",
        roleId: 0
      },
      PageNum: 1,
      TheUserID: "",
      TheUser: "",
      TheUserIndex: "",
      RespText: "",
      success: "",
      user: {
        login: "",
        id: "",
        roleId: "",
        phone: "",
        lastName: "",
        firstName: "",
        surName: "",
        position: "",
        password_1: "",
        password_2: ""
      }
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageNum = parseInt(
      this.$route.params.page == "undefined" ? 1 : this.$route.params.page
    );
    this.GetStartInfo(this.PageNum);
  },
  components: {
    LoginCheck,
    loadingsmall,
    PageNav: Navigator,
  },
  methods: {
    StartSearch() {
      if (this.DataSearch.FIO == "") {
        this.ViewNotification(
          "Внимание",
          "Ошибка! Вы не ввели ФИО пользователя",
          "error"
        );
        return;
      }
      this.IsSearch = true;
      if (this.PageNum > 1) this.$router.push("/console/user-list/1");
      this.PageNum = 1;
      this.GetStartInfo(this.PageNum);
    },
    StartInfo() {
      this.IsSearch = false;
      if (this.PageNum > 1) this.$router.push("/console/user-list/1");
      this.PageNum = 1;
      this.GetStartInfo(this.PageNum);
    },
    resetModal_change_user() {
      this.TheUserID = "";
      this.TheUser = "";
      this.TheUserIndex = "";
      this.RespText = "";
      this.success = "";
      this.user.login = "";
      this.user.firstName = "";
      this.user.lastName = "";
      this.user.surName = "";
      this.user.roleId = "";
      this.user.password_1 = "";
      this.user.password_2 = "";
      this.user.phone = "";
      this.user.position = "";
    },
    async handleOk_change_user(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.user.id == this.Myuser.id) {
        this.RespText =
          "Ошибка! Вы не можете редактировать свои данные на этой странице!";
        this.success = "alert-danger";
        return;
      }
      if (
        !(
          this.user.firstName != "" &&
          this.user.lastName != "" &&
          this.user.position != "" &&
          this.user.phone != "" &&
          this.user.login != "" &&
          this.user.roleId != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }

      if (this.user.password_1.length > 0 && this.user.password_1.length < 8) {
        this.RespText = "Ошибка! Должно быть минимум 8 символов (пароль)";
        this.success = "alert-danger";
        return;
      }

      if (this.user.password_1 != this.user.password_2) {
        this.RespText = "Ошибка! Пароли не совподают";
        this.success = "alert-danger";
        return;
      }

      var valide_ph = /^\+\d\d{3} \d{3}-\d{2}-\d{2}$/;
      if (!this.user.phone.match(valide_ph)) {
        this.RespText = "Ошибка! Вы не правильно заполнили телефон";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        this.RespText = "Вы успешно обновили информацию о пользователе!";
        this.success = "alert-success";
        await this.$store.dispatch("ChangeUserInfo", {
          user: this.user,
          index: this.TheUserIndex
        });
        this.user.password_1 = "";
        this.user.password_2 = "";
        if (this.user.id == this.Myuser.id)
          this.ChangeLocalStorageUserInfo(this.user); // Mb to delete this function because it is unusable
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    async handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!(this.TheUserID != null && this.TheUserID >= 0)) {
        this.RespText = "Ошибка! Неверный ID";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        await this.$store.dispatch("DeleteUserFromList", {
          index: this.TheUserIndex,
          id: this.TheUserID
        });
        this.TheUserID = "";
        this.TheUser = "";
        this.TheUserIndex = "";
        this.RespText = "";
        this.success = "";
        this.$nextTick(() => {
          this.$refs.modal_delete.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении пользователя!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    ShowModalWindow_delete(name, id, index) {
      if (this.user.id == this.Myuser.id) {
        this.ViewNotification(
          "Внимание",
          "Вы не можете удалить свой аккаунт на данной странице!",
          "error"
        );
        return;
      }
      this.TheUserID = id;
      this.TheUser = name;
      this.TheUserIndex = index;
      this.$bvModal.show("modal-scoped");
    },
    ViewNotification(_title, _text, _type) {
      this.$notify({
        group: "foo",
        type: _type,
        title: _title,
        text: _text
      });
    },
    async ShowModalWindow_change(name, id, index) {
      if (this.user.id == this.Myuser.id) {
        this.ViewNotification(
          "Внимание",
          "Вы не можете редактировать свои данные на данной странице!",
          "error"
        );
        return;
      }
      try {
        const res = await this.$store.dispatch("GetUser", id);
        if (res.items[0].role === "admin") this.user.roleId = 1;
        else if (res.items[0].role === "manager") this.user.roleId = 2;
        else this.user.roleId = 3;
        this.user.id = id;
        this.user.login = res.items[0].login;
        this.user.phone = res.items[0].phone;
        this.user.lastName = res.items[0].lastName;
        this.user.firstName = res.items[0].firstName;
        this.user.surName = res.items[0].surName;
        this.user.position = res.items[0].position;
        this.TheUserID = id;
        this.TheUser = name;
        this.TheUserIndex = index;
        this.$bvModal.show("modal-prevent-closing");
      } catch (error) {
        this.ViewNotification(
          "Внимание",
          "Ошибка при получении информации о пользователе!",
          "error"
        );
        console.log(error);
      }
    },
    async GetStartInfo(page) {
      this.IsLoadingItems = true;
      try {
        const res = await this.$store.dispatch("GetUsers", {
          page: page - 1,
          search: this.IsSearch,
          dataSearch: this.DataSearch
        });
      } catch (error) {
        console.log(error);
      }
      this.IsLoadingItems = false;
    },
    ChangeLocalStorageUserInfo(_user) {
      let new_role = "";
      if (_user.roleId == 1) new_role = "admin";
      else if (_user.roleId == 2) new_role = "manager";
      else new_role = "common";
      const stLogin = this.Myuser.login;
      this.Myuser.login = _user.login;
      this.Myuser.lastName = _user.lastName;
      this.Myuser.firstName = _user.firstName;
      this.Myuser.surName = _user.surName;
      this.Myuser.phone = _user.phone;
      this.Myuser.role = new_role;
      this.Myuser.position = _user.position;
      localStorage.setItem("user", JSON.stringify(this.Myuser));
      if (stLogin != _user.login) {
        this.ViewNotification(
          "Внимание",
          "Перейдите на страницу авторизации и авторизуйтесь по-новой.",
          "error"
        );
        localStorage.removeItem("jwt");
        localStorage.removeItem("_date");
        localStorage.removeItem("user");
      }
    }
  },
  computed: {
    Items() {
      return this.$store.getters.GetUsers;
    }
  },
  beforeMount() {
    this.Myuser = JSON.parse(localStorage.getItem("user"));
  }
};
</script>

<style scoped>
.OverflowY_scroll {
  overflow-y: auto;
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

/* Search */
.search-box {
  margin-top: 20px;
}

.search-box input[type="search"] {
  width: 400px;
}

.search-box .input-group select {
  width: 210px;
}

.input-group {
  margin-right: 30px;
}

.search-box button {
  width: 160px;
  /* margin-left: 30px; */
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

.table_blur button {
  margin: 3px;
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

.table_blur th {
  width: 150px;
}

.table_blur td {
  width: 150px;
}

.table_blur td:first-child {
  width: 180px;
}

.table_blur th:first-child {
  width: 180px;
}

.table_blur td:last-child {
  width: 200px;
}

.table_blur th:last-child {
  width: 200px;
}

/* Form */
.form-table {
  border-collapse: collapse;
  margin-top: 50px;
  width: 100%;
  font-size: 15px;
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

.form-table input[type="checkbox"],
.form-table input[type="color"],
.form-table input[type="date"],
.form-table input[type="datetime-local"],
.form-table input[type="datetime"],
.form-table input[type="email"],
.form-table input[type="month"],
.form-table input[type="number"],
.form-table input[type="password"],
.form-table input[type="radio"],
.form-table input[type="search"],
.form-table input[type="tel"],
.form-table input[type="text"],
.form-table input[type="time"],
.form-table input[type="url"],
.form-table input[type="week"],
.form-table select,
.form-table textarea {
  border: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.07);
  background-color: #fff;
  color: #32373c;
  outline: 0;
  transition: 50ms border-color ease-in-out;
  margin-top: 0px;
}

.form-table input.disabled,
.form-table input:disabled {
  background: rgba(255, 255, 255, 0.5);
  border-color: rgba(222, 222, 222, 0.75);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  color: rgba(51, 51, 51, 0.5);
}

.form-table input[type="checkbox"]:focus,
.form-table input[type="color"]:focus,
.form-table input[type="date"]:focus,
.form-table input[type="datetime-local"]:focus,
.form-table input[type="datetime"]:focus,
.form-table input[type="email"]:focus,
.form-table input[type="month"]:focus,
.form-table input[type="number"]:focus,
.form-table input[type="password"]:focus,
.form-table input[type="radio"]:focus,
.form-table input[type="search"]:focus,
.form-table input[type="tel"]:focus,
.form-table input[type="text"]:focus,
.form-table input[type="time"]:focus,
.form-table input[type="url"]:focus,
.form-table input[type="week"]:focus,
.form-table select:focus,
.form-table textarea:focus {
  border-color: #5b9dd9;
  box-shadow: 0 0 2px rgba(30, 140, 190, 0.8);
  outline: 2px solid transparent;
}

.form-table input:not([type="submit"]),
.form-table select,
.form-table textarea {
  font-size: 15px;
  padding: 3px 5px;
  border-radius: 0;
}

.form-table button {
  margin-bottom: 50px;
}

.form-table p.description,
.form-table span.description {
  font-size: 13px;
  font-style: italic;
}

.regular-text {
  width: 25em;
  margin-bottom: 15px;
}
</style>
