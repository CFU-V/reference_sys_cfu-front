<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Добавить пользователя</h2>
    <form class="form-table">
      <h2>Персональные настройки</h2>
      <table>
        <tbody>
          <tr>
            <th>
              <label for="email">Почта</label>
            </th>
            <td>
              <input required class="regular-text" type="email" id="email" placeholder="test@gmail.com"
                v-model="user.email" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="login">Логин</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="login" placeholder="test" v-model="user.login" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="first-name">Имя</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="first-name" placeholder="Игорь"
                v-model="user.firstName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="second-name">Фамилия</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="second-name" placeholder="Фортис"
                v-model="user.lastName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="middle-name">Отчество</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="middle-name" placeholder="Сереевич" v-model="user.surName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="birth">Дата рождения</label>
            </th>
            <td>
              <input required class="regular-text" type="date" id="birth" v-model="user.birth" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="phone">Телефон</label>
            </th>
            <td>
              <input required class="regular-text" type="tel" id="phone" placeholder="+7978 111-22-33"
                pattern="\+\d\d{3} \d{3}-\d{2}-\d{2}" v-model="user.phone" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="status">Должность</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="status" placeholder="Разработчик"
                v-model="user.position" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="rule">Роль</label>
            </th>
            <td>
              <select id="rule" required v-model="user.role">
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
              <input required class="regular-text" type="password" id="pass" autocomplete="off"
                v-model="user.password_1" />
              <span class="description">пароль (минимум 8 символов)</span>
              <br />
              <input required class="regular-text" type="password" autocomplete="off" v-model="user.password_2" />
              <span class="description">повторите пароль</span>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-outline-primary" type="submit" @click.prevent="OnClickButton">Добавить
        пользователя</button>
    </form>
    <div class="alert" :class="success" role="alert">{{ RespText }}</div>
    <loadingsmall :IsLoading="IsLoading" :center="false"></loadingsmall>
  </div>
</template>

<script>
import * as api from "../api";
import LoginCheck from "../components/logincheck.vue";
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      IsLoading: false,
      user: {
        email: "",
        login: "",
        firstName: "",
        lastName: "",
        surName: "",
        birth: "",
        phone: "",
        position: "",
        role: "",
        password_1: "",
        password_2: ""
      },
      RespText: "",
      success: ""
    };
  },
  components: {
    LoginCheck,
    loadingsmall
  },
  methods: {
    async OnClickButton() {
      if (
        !(
          this.user.email != "" &&
          this.user.login != "" &&
          this.user.firstName != "" &&
          this.user.lastName != "" &&
          this.user.surName != "" &&
          this.user.birth != "" &&
          this.user.phone != "" &&
          // this.user.position != '' &&
          this.user.role != "" &&
          this.user.password_1 != "" &&
          this.user.password_2 != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }

      if (this.user.password_1.length < 8) {
        this.RespText = "Ошибка! Должно быть минимум 8 символов (пароль)";
        this.success = "alert-danger";
        return;
      }

      if (this.user.password_1 != this.user.password_2) {
        this.RespText = "Ошибка! Пароли не совподают";
        this.success = "alert-danger";
        return;
      }

      var valide_date = /\d{4}[\.-]{1}\d{2}[\.-]{1}\d{2}/;
      if (!this.user.birth.match(valide_date)) {
        this.RespText = "Ошибка! Вы не правильно ввели дату";
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
        const res = await api.CreateUser(
          this.user.login,
          this.user.password_1,
          this.user.role,
          this.user.lastName,
          this.user.firstName,
          this.user.surName,
          this.user.email,
          this.user.birth,
          this.user.position,
          this.user.phone
        );
        this.RespText = "Вы успешно добавили пользователя!";
        this.success = "alert-success";

        this.user.email = "";
        this.user.login = "";
        this.user.firstName = "";
        this.user.lastName = "";
        this.user.surName = "";
        this.user.birth = "";
        this.user.phone = "";
        this.user.position = "";
        this.user.role = "";
        this.user.password_1 = "";
        this.user.password_2 = "";
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
        console.log(error);
      }
      this.IsLoading = false;
    }
  },
  created() {
    document.title = this.$route.meta.title;
  }
};
</script>

<style scoped>
.form-table {
  border-collapse: collapse;
  margin-top: 50px;
  width: 100%;
  font-size: 14px;
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
  font-size: 14px;
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

input:not([type="submit"]),
select,
textarea {
  font-size: 14px;
  padding: 3px 5px;
  border-radius: 0;
}

button {
  margin-bottom: 50px;
}

p.description,
span.description {
  font-size: 13px;
  font-style: italic;
}

.regular-text {
  width: 25em;
  margin-bottom: 15px;
}
</style>
