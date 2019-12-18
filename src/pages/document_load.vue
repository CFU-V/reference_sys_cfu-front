<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- Loading -->
    <loading :IsLoading="IsLoadingFile"></loading>
    <!-- /Loading -->
    <h2>Добавить документ</h2>
    <form enctype="multipart/form-data" class="form-table" @submit="AddDoc">
      <table>
        <tbody>
          <tr>
            <th>
              <label for="AddDocFromCPlus">Добавить документ по ссылке (КонсультантПлюс)</label>
            </th>
            <td>
              <input
                :disabled="doc.file != null"
                class="regular-text"
                type="text"
                :placeholder="'Ссылка на документ'"
                id="AddDocFromCPlus"
                v-model="doc.consultant_link"
              />
              <input
                type="button"
                class="btn btn-danger"
                value="Удалить"
                v-show="doc.consultant_link != ''"
                @click="DeleteConsultant_linkInput"
              />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad">Загрузить документ</label>
            </th>
            <td>
              <input
                @change="filesChange"
                class="regular-text"
                type="file"
                id="DocLoad"
                accept=".docx"
                ref="DocFileInput"
                :disabled="doc.consultant_link != ''"
              />
              <input
                type="button"
                class="btn btn-danger"
                value="Удалить"
                v-show="doc.file != null"
                @click="DeleteDocFileInput"
              />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_ID">Введите имя гл. Документа</label>
            </th>
            <td>
              <input
                :disabled="doc.consultant_link != ''"
                class="regular-text"
                type="search"
                id="DocLoad_ID"
                v-model="doc.parentId"
                @input="submitSearch_parentId(doc.parentId)"
                list="dataList_maindoc"
                :placeholder="'Введите имя/ID документа'"
                autocomplete="off"
              />
              <datalist id="dataList_maindoc">
                <option
                  v-for="(value, index) in Response_parentId"
                  :value="value['id']"
                  :key="index"
                  :label="value['title']"
                ></option>
              </datalist>
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Title">
                Название документа
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <textarea
                class="regular-text"
                required
                type="text"
                id="DocLoad_Title"
                v-model="doc.title"
                @keyup="submitSearch_title"
                placeholder="Проект приказа № 335 от 29.02.2016..."
              ></textarea>
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Info">
                Информация
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <textarea
                required
                class="regular-text"
                type="text"
                id="DocLoad_Info"
                v-model="doc.info"
                placeholder="Информация о документе"
              ></textarea>
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Number">
                Номер
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <input
                required
                class="regular-text"
                type="text"
                id="DocLoad_Number"
                v-model="doc.number"
                placeholder="335"
                autocomplete="off"
              />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Date">
                Введите дату регистрации документа
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <input
                  required
                  class="regular-text"
                  type="date"
                  id="DocLoad_Date"
                  placeholder="2019-12-04"
                  autocomplete="off"
                  v-model="doc.date"
                />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Category">
                Выберите категорию
                <span style="color:red">*</span>
              </label>
            </th>
            <td>
              <select
                required
                class="custom-select regular-text"
                id="DocLoad_Category"
                v-model="doc.categoryId"
              >
                <option value disabled>Классификация документа</option>
                <option
                  :value="index+1"
                  v-for="(value, index) in GetDocCategory"
                  :key="index"
                >{{value}}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_View">Видимость (видимый/невидимый)</label>
            </th>
            <td>
              <input type="checkbox" id="DocLoad_View" v-model="doc.visibility" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Renew">Обновляемость</label>
            </th>
            <td>
              <input
                :disabled="doc.consultant_link == ''"
                type="checkbox"
                id="DocLoad_Renew"
                v-model="doc.renew"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <input class="btn btn-primary" type="submit" value="Добавить документ" />
    </form>
    <div class="alert" :class="success" role="alert">{{ RespText }}</div>
    <!--  -->
    <p class="table_caption">Список совпадений</p>
    <table class="table_blur">
      <thead>
        <tr>
          <th>Название документа</th>
        </tr>
      </thead>
    </table>
    <div class="table_scroll">
      <table class="table_blur">
        <tbody v-show="(doc.consultant_link == '') || (ResponseSQ.length > 0 && ResponseSQ != '')">
          <tr v-for="(value, index) in ResponseSQ" :key="index">
            <td>
              <p @click="OnClickTitle(value['title'])" class="TitleOfTable">{{ value['title'] }}</p>
            </td>
            <td>
              <button
                :disabled="value['title'] != doc.title"
                class="btn btn-outline-danger"
                @click="ShowModal_replace(value['id'],value['title'])"
              >Заменить</button>
            </td>
            <td>
              <button
                :disabled="value['title'] != doc.title"
                class="btn btn-outline-success"
                @click="NewVersion(value['id'],value['title'])"
              >Новая версия</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="table_blur">
      <tfoot>
        <tr>
          <th>Всего совпадений: {{ ResponseSQ.length }}</th>
        </tr>
      </tfoot>
    </table>
    <!--  -->
    <!-- MW Replace doc -->
    <b-modal size="lg" id="modal-Replace" ref="modal_Replace" @ok="OnClickOK_replace">
      <template slot="modal-header">
        <h5>Заменить документ</h5>
      </template>
      <template slot="default">
        <p>После замены все дочерние документы будут удалены.</p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="md" variant="success" @click="ok()">Заменить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Отмена</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";
import LoginCheck from "../components/logincheck.vue";
import Loading from "../components/loading_overflow.vue";
import mnt from "moment";

export default {
  data() {
    return {
      IsLoadingFile: false,
      Search_mainfile: "",
      selected_id: -1,
      selected_title: "",
      doc: {
        title: "",
        parentId: null,
        old_version: null,
        info: "",
        categoryId: "",
        active: false,
        number: "",
        visibility: false,
        consultant_link: "",
        renew: false,
        date: mnt(new Date()).format("YYYY-MM-DD"),
        file: null
      },
      RespText: "",
      success: "",
      ResponseSQ: [],
      Response_parentId: []
    };
  },
  components: {
    LoginCheck,
    Loading
  },
  created() {
    document.title = this.$route.meta.title;
  },
  computed: {
    GetDocCategory() {
      return this.$store.getters.GetDocCategory;
    }
  },
  methods: {
    OnClickTitle(title) {
      this.doc.title = title;
    },
    OnClickOK_replace() {
      this.ChangeDoc(this.selected_id, this.selected_title, true);
    },
    ShowModal_replace(_id, _title) {
      this.RespText = "";
      this.success = "";
      this.selected_id = _id;
      this.selected_title = _title;
      this.$bvModal.show("modal-Replace");
    },
    removeSearchQuery() {
      this.doc.title = "";
      this.ResponseSQ = [];
    },
    removeSearchQuery_parentId() {
      this.doc.parentId = null;
      this.Response_parentId = [];
    },
    removeDoc() {
      this.doc.title = "";
      this.doc.parentId = null;
      this.doc.info = "";
      this.doc.categoryId = 0;
      this.doc.active = false;
      this.doc.number = "";
      this.doc.visibility = false;
      this.doc.renew = false;
      this.doc.date = mnt(new Date()).format("YYYY-MM-DD");
      this.doc.file = null;
      this.doc.old_version = null;
      this.$refs.DocFileInput.value = "";
    },
    DeleteConsultant_linkInput() {
      this.doc.consultant_link = "";
    },
    filesChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.doc.file = files[0];
    },
    DeleteDocFileInput() {
      this.doc.file = null;
      this.$refs.DocFileInput.value = "";
    },
    async ChangeDoc(_id, _title, _deleteChild) {
      if (!(_id > -1)) {
        this.RespText = "Ошибка! Неверный ид документа";
        this.success = "alert-danger";
        return;
      }
      if (!(_title != "")) {
        this.RespText = "Ошибка! Неверный документ";
        this.success = "alert-danger";
        return;
      }
      if (!(_deleteChild != null)) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
        return;
      }
      if (!(_title == this.doc.title)) {
        this.RespText = "Ошибка! Неверный документ";
        this.success = "alert-danger";
        return;
      }
      if (this.doc.file == null || this.doc.file == "") {
        this.RespText = "Ошибка! Вы не загрузили документ";
        this.success = "alert-danger";
        return;
      }
      if (
        !(
          this.doc.title != "" &&
          this.doc.categoryId > 0 &&
          this.doc.file != "" &&
          this.doc.date != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText =
          "Ошибка! Вы не все поля заполнили (возможно вы не добавили документ/ссылку)";
        this.success = "alert-danger";
        return;
      }
      if (this.doc.parentId != null && this.doc.parentId != "") {
        const res_cnvr = parseInt(this.doc.parentId);
        if (isNaN(res_cnvr)) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. ID Должен быть числового типа";
          this.success = "alert-danger";
          return;
        } else if (res_cnvr < 0) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. Должен быть больше -1";
          this.success = "alert-danger";
          return;
        }
      }
      this.$nextTick(() => {
        this.$refs.modal_Replace.hide();
      });
      this.IsLoadingFile = true;
      this.doc.number = this.doc.number.replace(/\s+/g, "");
      try {
        this.doc.id = _id;
        this.doc.active = true;
        this.doc.date = mnt(this.doc.date).format("YYYY-MM-DD");
        const res = await api.ChangeParamDocument(
          this.doc,
          _deleteChild,
          this.doc.file
        );
        this.RespText = "Вы успешно заменили документ! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
        this.removeSearchQuery();
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
      this.IsLoadingFile = false;
    },
    async NewVersion(_id, _title) {
      this.RespText = "";
      this.success = "";
      if (!(_id > -1)) {
        this.RespText = "Ошибка! Неверный ид документа";
        this.success = "alert-danger";
        return;
      }
      if (!(_title != "")) {
        this.RespText = "Ошибка! Неверный документ";
        this.success = "alert-danger";
        return;
      }
      if (!(_title == this.doc.title)) {
        this.RespText = "Ошибка! Неверный документ";
        this.success = "alert-danger";
        return;
      }
      if (
        !(
          this.doc.title != "" &&
          this.doc.categoryId > 0 &&
          this.doc.file != "" &&
          this.doc.date != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText =
          "Ошибка! Вы не все поля заполнили (возможно вы не добавили документ/ссылку)";
        this.success = "alert-danger";
        return;
      }
      if (this.doc.parentId != null && this.doc.parentId != "") {
        const res_cnvr = parseInt(this.doc.parentId);
        if (isNaN(res_cnvr)) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. ID Должен быть числового типа";
          this.success = "alert-danger";
          return;
        } else if (res_cnvr < 0) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. Должен быть больше -1";
          this.success = "alert-danger";
          return;
        }
      }
      this.IsLoadingFile = true;
      this.doc.number = this.doc.number.replace(/\s+/g, "");
      this.doc.old_version = parseInt(_id);
      try {
        this.doc.active = true;
        this.doc.date = mnt(this.doc.date).format("YYYY-MM-DD");
        const res = await api.AddDocument(this.doc, this.doc.file);
        this.RespText =
          "Вы успешно добавили новую версию документа! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
        this.removeSearchQuery();
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
      this.IsLoadingFile = false;
    },
    async submitSearch_title() {
      if (this.doc.consultant_link != "") return;
      if (!(this.doc.title.length > 0)) {
        this.removeSearchQuery();
        return;
      }
      try {
        const res = await api.GetDocumentList(0, true, this.doc.title);
        this.ResponseSQ = res.items;
      } catch (error) {}
    },
    async submitSearch_parentId(_text) {
      if (this.doc.consultant_link != "") return;
      if (_text != null) {
        if (!(_text.length > 0)) {
          this.removeSearchQuery_parentId();
          return;
        }
      }
      try {
        const res = await api.GetDocumentList(0, true, _text);
        this.Response_parentId = res.items;
      } catch (error) {}
    },
    async AddDoc(e) {
      e.preventDefault();
      if (
        !(
          this.doc.title != "" &&
          this.doc.categoryId > 0 &&
          this.doc.date != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }
      if (
        (this.doc.file == null || this.doc.file == "") &&
        this.doc.consultant_link == ""
      ) {
        this.RespText =
          "Ошибка! Вы не все поля заполнили (Вы не добавили документ/ссылку)";
        this.success = "alert-danger";
        return;
      }
      this.doc.number = this.doc.number.replace(/\s+/g, "");
      if (this.ResponseSQ != null && this.ResponseSQ.length > -1) {
        const ind = this.ResponseSQ.findIndex(
          i => i.title.toLowerCase() == this.doc.title.toLowerCase()
        );
        if (ind > -1) {
          this.RespText = "Ошибка! В системе уже есть такой документ";
          this.success = "alert-danger";
          return;
        }
      }
      if (this.doc.parentId != null && this.doc.parentId != "") {
        const res_cnvr = parseInt(this.doc.parentId);
        if (isNaN(res_cnvr)) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. ID Должен быть числового типа";
          this.success = "alert-danger";
          return;
        } else if (res_cnvr < 0) {
          this.RespText =
            "Ошибка! Неверный ID гл. Документа!. Должен быть больше -1";
          this.success = "alert-danger";
          return;
        }
      }
      this.IsLoadingFile = true;
      try {
        this.doc.active = true;
        this.doc.date = mnt(this.doc.date).format("YYYY-MM-DD");
        const res = await api.AddDocument(this.doc, this.doc.file);
        this.RespText = "Вы успешно добавили документ! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
        this.removeSearchQuery();
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
      this.IsLoadingFile = false;
    }
  },
  beforeMount() {
    this.$store.dispatch("SetDocumentCategories");
  }
};
</script>

<style scoped>
.alert {
  margin-top: 20px;
}
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

.form-table tr {
  height: 80px;
}

.form-table th {
  vertical-align: top;
  text-align: left;
  padding: 20px 10px 20px 0;
  width: 270px;
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
input[type="search"],
input[type="tel"],
input[type="text"],
input[type="time"],
input[type="url"],
input[type="week"],
select,
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

/* Table */
.TitleOfTable {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}

.table_blur {
  background-color: #f5ffff;
  border-collapse: collapse;
  text-align: left;
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

.table_scroll {
  overflow-y: scroll;
  height: auto;
  max-height: 800px;
  width: 100%;
}

.table_blur th:after {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  top: 25%;
  height: 25%;
  width: 100%;
  /* background: linear-gradient(
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.08)
  ); */
}

.table_blur tr:nth-child(odd) {
  background-color: #ebf3f9;
}

.table_blur th:first-child {
  border-left: 1px solid #2980b9;
  border-bottom: 1px solid #2980b9;
}

.table_blur td {
  border: 1px solid #d1e6f7;
  padding: 10px 15px;
  position: relative;
  transition: all 0.3s ease;
  width: 450px;
}

.table_blur td:nth-child(2) {
  width: 130px;
}

.table_blur td:nth-child(3) {
  width: 140px;
}
</style>
