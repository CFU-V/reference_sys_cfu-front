<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Управление категориями</h2>
    <form enctype="multipart/form-data" class="form-table" @submit="AddTypeDoc">
      <table>
        <tbody>
          <tr>
            <th>
              <label for="DocType_Title">
                Добавить новую категорию:
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <textarea
                class="regular-text"
                required
                type="text"
                id="DocType_Title"
                v-model="InputTypeDoc"
                placeholder="Наименование..."
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
      <input class="btn btn-primary" type="submit" value="Добавить" />
    </form>
    <loadingsmall
      :IsLoading="IsLoadingAdd"
      :center="false"
      style="width:100%"
    ></loadingsmall>
    <div class="alert" :class="successAddType" role="alert">
      {{ RespTextAddType }}
    </div>
    <p class="table_caption">Таблица категорий</p>
    <div class="OverflowY_scroll">
      <table class="table_blur">
        <thead>
          <tr>
            <th>Название</th>
            <th>Действие</th>
          </tr>
        </thead>
        <transition-group name="Animation_ViewItems" tag="tbody">
          <tr v-if="IsLoadingItems" :key="1">
            <td colspan="2">
              <loadingsmall
                :IsLoading="IsLoadingItems"
                :center="true"
                style="width:100%"
              ></loadingsmall>
            </td>
          </tr>
          <tr
            v-else-if="
              GetCategories.items.length <= 0 && IsLoadingItems === false
            "
            :key="2"
          >
            <td colspan="8" style="text-align: center;">
              Категорий не найдено
            </td>
          </tr>
          <tr
            v-else
            v-for="(value, index) in GetCategories.items"
            :key="index + 2"
          >
            <td>{{ value.title }}</td>
            <td>
              <button
                style="min-width:130px"
                class="btn btn-outline-success"
                @click="ShowMWParam(value.title, value.id, index)"
              >
                Редактировать
              </button>
              <button
                class="btn btn-danger"
                @click="ShowModalWindowDelete(value.title, value.id, index)"
              >
                Удалить
              </button>
            </td>
          </tr>
        </transition-group>

        <tfoot>
          <tr>
            <th colspan="2">
              Показано {{ GetCategories.items.length }} из
              {{ GetCategories.total }} категорий
            </th>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- PageNavigator -->
    <page-nav
      @click="GetCategoriesTotal"
      url="/console/document-types/"
      :maxPage="GetCategories.pages"
      :Page="$route.params.page"
    ></page-nav>
    <!-- Delete Modal Window -->
    <b-modal
      size="lg"
      ref="modal_delete"
      id="modal-prevent-delete"
      @hidden="ResetModal"
      @ok="handleOk_delete"
    >
      <template slot="modal-header">
        <h5>Подтверждение</h5>
      </template>
      <template slot="default">
        <p>Наименование категории: {{ Type_data.title }}</p>
        <br />
        <p>Вы уверены, что хотите удалить этот категорию?</p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button
          :disabled="IsLoading"
          size="md"
          variant="success"
          @click="ok()"
          >Удалить</b-button
        >
        <b-button size="md" variant="danger" @click="cancel()"
          >Закрыть</b-button
        >
      </template>
    </b-modal>
    <!-- /Delete Modal Window -->
    <!-- MW Change parametres -->
    <b-modal
      size="lg"
      ref="modal_parametres"
      id="modal-prevent-parametres"
      @hidden="ResetModal"
      @ok="OnClickParametres"
    >
      <template slot="modal-header">
        <h5>Параметры документа</h5>
      </template>
      <form ref="form" class="form-table">
        <table>
          <tbody>
            <tr>
              <th>
                <label for="param-title">Наименование</label>
              </th>
              <td>
                <textarea
                  class="regular-text"
                  type="text"
                  id="param-title"
                  v-model="Type_data.title"
                  placeholder="Наименование..."
                ></textarea>
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
          >Редактировать (сохранить)</b-button
        >
        <b-button size="md" variant="danger" @click="cancel()"
          >Закрыть</b-button
        >
      </template>
    </b-modal>
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import * as api from "../api";
import mnt from "moment";
import LoginCheck from "../components/logincheck.vue";
import switchToggle from "../components/switch_toggle";
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      PageNum: 1,
      IsLoading: false,
      IsLoadingItems: false,
      IsLoadingAdd: false,
      Type_data: {
        id: -1,
        index: -1,
        title: ""
      },
      RespText: "",
      success: "",
      RespTextAddType: "",
      successAddType: "",
      InputTypeDoc: ""
    };
  },
  components: {
    PageNav: Navigator,
    LoginCheck,
    switchToggle,
    loadingsmall
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageNum = parseInt(
      this.$route.params.page === undefined ? 1 : this.$route.params.page
    );
    this.GetCategoriesTotal(this.PageNum);
  },
  methods: {
    async OnClickParametres(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (
        this.Type_data.id < 0 &&
        this.Type_data.index < 0 &&
        this.Type_data.title === ""
      ) {
        this.RespText = "Ошибка! Неверный ID/Index";
        this.success = "alert-danger";
        return;
      }
      if (this.Type_data.title.length < 3) {
        this.RespText = "Ошибка! Длина строки меньше 3";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        await api.UpdateCategory(this.Type_data.id, this.Type_data.title);
        await this.$store.dispatch("UpdateCategoriesTotal", {
          text: this.Type_data.title,
          id: this.Type_data.id,
          index: this.Type_data.index
        });
        this.RespText = "Вы успешно обновили наименование категории!";
        this.success = "alert-success";
      } catch (error) {
        this.RespText = "Неизвестная ошибка!";
        this.success = "alert-danger";
        console.log(error);
      }
      this.IsLoading = false;
    },
    ShowMWParam(_text, _id, _index) {
      this.Type_data.title = _text;
      this.Type_data.id = _id;
      this.Type_data.index = _index;
      this.$bvModal.show("modal-prevent-parametres");
    },
    async AddTypeDoc(e) {
      e.preventDefault();
      if (!(this.InputTypeDoc != "")) {
        this.RespTextAddType = "Ошибка! Вы не все поля заполнили.";
        this.successAddType = "alert-danger";
        return;
      }
      this.IsLoadingAdd = true;
      try {
        const res = await this.$store.dispatch("AddCategoriesTotal", {
          text: this.InputTypeDoc
        });
        await this.GetCategoriesTotal(this.PageNum);
      } catch (error) {
        this.RespTextAddType =
          "Ошибка! Невозможно добавить категорию";
        this.successAddType = "alert-danger";
      }
      this.IsLoadingAdd = false;
      this.InputTypeDoc = "";
    },
    ResetModal() {
      this.Type_data.title = "";
      this.Type_data.id = -1;
      this.Type_data.index = -1;
    },
    handleOk_delete(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.IsLoading = true;
      try {
        this.DeleteTypes(
          this.Type_data.id,
          this.Type_data.index,
          this.Type_data.title
        );
        this.RespText = "";
        this.success = "";
        this.Type_data.title = "";
        this.Type_data.id = -1;
        this.Type_data.index = -1;
        this.$nextTick(() => {
          this.$refs.modal_delete.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении категории!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    ShowModalWindowDelete(_text, _id, _index) {
      this.Type_data.title = _text;
      this.Type_data.id = _id;
      this.Type_data.index = _index;
      this.$bvModal.show("modal-prevent-delete");
    },
    async DeleteTypes(_id, _index, _title) {
      if (_id === null || _id === undefined || isNaN(_id)) {
        console.error(`[CategoriesTotal|DeleteTypes] - Неверный ID`);
        return;
      }
      try {
        const res = await this.$store.dispatch("DeleteCategoriesTotal", {
          id: _id,
          index: _index,
          title: _title
        });
      } catch (error) {}
    },
    async GetCategoriesTotal(_page) {
      this.IsLoadingItems = true;
      try {
        const res = await this.$store.dispatch("SetCategoriesTotal", {
          page: _page - 1
        });
      } catch (error) {}
      this.IsLoadingItems = false;
    }
  },
  computed: {
    GetCategories() {
      return this.$store.getters.GetCategoriesTotal;
    }
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

/* Advance Search */

.Animation_SwitchAdvanceSearch-enter-active {
  transition: all 0.6s ease;
  -moz-transition: all 0.6s ease;
  -o-transition: all 0.6s ease;
  -webkit-transition: all 0.6s ease;
}

.Animation_SwitchAdvanceSearch-leave-active {
  transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}

.Animation_SwitchAdvanceSearch-enter,
.Animation_SwitchAdvanceSearch-leave-to {
  opacity: 0;
}

.Animation_SwitchSimpleSearch-enter-active {
  transition: all 0.6s ease;
  -moz-transition: all 0.6s ease;
  -o-transition: all 0.6s ease;
  -webkit-transition: all 0.6s ease;
}

.Animation_SwitchSimpleSearch-leave-active {
  transition: all 0.4s ease;
  -moz-transition: all 0.4s ease;
  -o-transition: all 0.4s ease;
  -webkit-transition: all 0.4s ease;
}

.Animation_SwitchSimpleSearch-enter,
.Animation_SwitchSimpleSearch-leave-to {
  opacity: 0;
}

/*  */

.form-table {
  border-collapse: collapse;
  margin-top: 50px;
  width: 100%;
  font-size: 15px;
  max-width: 800px;
}

.form-table > table {
  position: relative;
  width: 100%;
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
  width: 100%;
  margin-bottom: 15px;
  max-height: 300px;
  min-height: 30px;
}

.regular-text textarea {
  min-height: 80px;
}

/* Search */
.search-box {
  margin-top: 20px;
}

.search-box input[type="search"] {
  width: 400px;
}

.search-box .input-group select {
  width: 330px;
}

.input-group {
  margin-right: 30px;
}

.search-box button {
  min-width: 160px;
  margin-right: 10px;
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
  max-width: 600px;
}

.table_blur th:first-child {
  max-width: 600px;
}

/* PageNav */

.PageNavigator {
  clear: both;
  height: 130px;
  border-top: 1px solid #cfcfcf;
  padding-top: 50px;
  margin-top: 40px;
}

.PageNavigator button {
  background-color: white;
  color: #333;
  font-size: 18px;
  border: 1px solid #cfcfcf;
  float: left;
  width: 150px;
  height: 45px;
}

.PageNavigator button:first-child {
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
}

.PageNavigator button:last-child {
  border-bottom-right-radius: 2px;
  border-top-right-radius: 2px;
}

#current {
  /* font-weight: 700; */
  color: #fff;
  background-color: #0073a2;
  border: 1px solid #0073a2;
}

.PageNavigator button:hover {
  background-color: #2ea1cd;
  color: #fff;
  border: 1px solid #2ea1cd;
}

/* SwitchToggle */

.SwicthTG {
  margin-top: 20px;
}
</style>
