<template>
  <div>
    <h2>Ваш профиль</h2>
    <form class="form-table">
      <h2>Персональные настройки</h2>
      <table>
        <tbody>
          <tr>
            <th>
              <label for="first-name">Имя</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="first-name" placeholder="Игорь"
                :disabled="state_of_but" v-model="user.firstName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="second-name">Фамилия</label>
            </th>
            <td>
              <input required class="regular-text" type="text" id="second-name" placeholder="Фортис"
                :disabled="state_of_but" v-model="user.lastName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="middle-name">Отчество</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="middle-name" placeholder="Сереевич" :disabled="state_of_but"
                v-model="user.surName" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="phone">Телефон</label>
            </th>
            <td>
              <input class="regular-text" type="tel" id="phone" placeholder="+7978 111-22-33"
                pattern="\+\d\d{3} \d{3}-\d{2}-\d{2}" :disabled="state_of_but" v-model="user.phone" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="status">Должность</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="status" placeholder="Разработчик" :disabled="state_of_but"
                v-model="user.position" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="rule">Роль</label>
            </th>
            <td>
              <input type="text" disabled id="rule" v-bind:value="user.role" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="pass">Пароль</label>
            </th>
            <td>
              <input required class="regular-text" type="password" id="pass" autocomplete="off" :disabled="state_of_but"
                v-model="pass.PastPass" />
              <span class="description">Старый пароль</span>
              <br />
              <input required class="regular-text" type="password" autocomplete="off" :disabled="state_of_but"
                v-model="pass.NewPass" />
              <span class="description">Новый пароль (минимум 8 символов)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-outline-primary" type="submit" @click.prevent="OnClickButton">{{ SetValueBut }}</button>
    </form>
    <div class="alert" :class="success" role="alert">{{ RespText }}</div>
  </div>
</template>

<script>
import * as api from "../api";

export default {
  data() {
    return {
      user: [],
      pass: {
        PastPass: "",
        NewPass: ""
      },
      state_of_but: true,
      RespText: "",
      success: ""
    };
  },
  computed: {
    SetValueBut() {
      return this.state_of_but
        ? "Изменить личные данные"
        : "Сохранить изменения";
    }
  },
  methods: {
    async OnClickButton() {
      if (this.state_of_but == false) {
        if (
          !(
            this.user.role != "" &&
            this.user.lastName != "" &&
            this.user.firstName != "" &&
            this.user.phone != "" &&
            this.user.position != ""
          )
        ) {
          this.RespText = "Ошибка! Вы не все поля заполнили";
          this.success = "alert-danger";
          return;
        }

        var valide_ph = /^\+\d\d{3} \d{3}-\d{2}-\d{2}$/;
        if (!this.user.phone.match(valide_ph)) {
          this.RespText = "Ошибка! Вы не правильно заполнили телефон";
          this.success = "alert-danger";
          return;
        }

        if (this.pass.NewPass.length > 0 && this.pass.NewPass.length < 8) {
          this.RespText = "Ошибка! Минимум 8 символов в пароле";
          this.success = "alert-danger";
          return;
        }

        if (this.pass.PastPass.length > 0) {
          try {
            const res_pass = await api.ComparePassword(this.pass.PastPass);
          } catch (error) {
            this.RespText = "Ошибка! Неверный пароль";
            this.success = "alert-danger";
            return;
          }
        }

        try {
          const res = await api.UpdateMyUserInfo(
            this.pass.NewPass,
            this.user.lastName,
            this.user.firstName,
            this.user.surName,
            this.user.phone,
            this.user.position
          );
          this.RespText = "Вы успешно обновили свою информацию о пользователе!";
          this.success = "alert-success";
          this.state_of_but = !this.state_of_but;
          localStorage.setItem("user", JSON.stringify(this.user));
        } catch (error) {
          this.RespText = "Ошибка!";
          this.success = "alert-danger";
        }
        this.pass.NewPass = "";
        this.pass.PastPass = "";
      } else {
        this.state_of_but = false;
      }
    },
  },
  beforeMount() {
    this.user = JSON.parse(localStorage.getItem("user"));
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
