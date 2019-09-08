<template>
  <div>
    <h2>Добавить документ</h2>
    <form enctype="multipart/form-data" class="form-table">
      <table>
        <tbody>
          <tr>
            <th>
              <label for="AddDocFromCPlus">Добавить документ по ссылке (КонсультантПлюс)</label>
            </th>
            <td>
              <input :disabled="doc.file != null" class="regular-text" required type="text"
                :placeholder="'Ссылка на документ'" id="AddDocFromCPlus" v-model="doc.consultant_link" />
              <input type="button" class="btn btn-danger" value="Удалить" v-show="doc.consultant_link != ''"
                @click="DeleteConsultant_linkInput" />
              <input type="button" class="btn btn-success" value="Свойства" v-show="doc.consultant_link != '' " />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad">Загрузить документ</label>
            </th>
            <td>
              <input @change="filesChange" class="regular-text" type="file" id="DocLoad" accept=".docx"
                ref="DocFileInput" :disabled="doc.consultant_link != ''" />
              <input type="button" class="btn btn-danger" value="Удалить" v-show="doc.file != null"
                @click="DeleteDocFileInput" />
              <input type="button" class="btn btn-success" value="Свойства" v-show="doc.file != null" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_ID">ID на главный документ</label>
            </th>
            <td>
              <input class="regular-text" type="number" id="DocLoad_ID" v-model="doc.parentId" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Title">Название</label>
            </th>
            <td>
              <input class="regular-text" required type="text" id="DocLoad_Title" v-model="doc.title"
                @keyup="submitSearch" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Info">Информация</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="DocLoad_Info" v-model="doc.info" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Number">Номер</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="DocLoad_Number" v-model="doc.number" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Status">Статус документа (активный/неактивный)</label>
            </th>
            <td>
              <input type="checkbox" id="DocLoad_Status" v-model="doc.active" />
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
              <label for="DocLoad_Category">Выберите категорию</label>
            </th>
            <td>
              <select class="custom-select regular-text" id="DocLoad_Category" v-model="doc.categoryId">
                <option value disabled>Классификация документа</option>
                <option :value="index+1" v-for="(value, index) in GetDocCategory" :key="index">{{ value }}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th>
              <label for="DocLoad_Renew">Обновляемость</label>
            </th>
            <td>
              <input type="checkbox" id="DocLoad_Renew" v-model="doc.renew" />
            </td>
          </tr>
        </tbody>
      </table>
      <input class="btn btn-outline-primary" type="submit" value="Добавить документ" @click.prevent="AddDoc" />
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
              <router-link :to="'/docview/' + value['id']">{{ value['title'] }}</router-link>
            </td>
            <td>
              <button :disabled="value['title'] != doc.title" class="btn btn-outline-danger"
                @click="ShowModal_replace(value['id'],value['title'])">Заменить</button>
            </td>
            <td>
              <button :disabled="value['title'] != doc.title" class="btn btn-outline-success"
                @click="NewVersion(value['id'],value['title'])">Новая версия</button>
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
    <b-modal id="modal-Replace" ref="modal_Replace">
      <template slot="modal-header">
        <h5>Заменить документ</h5>
      </template>
      <template slot="default">
        <p>Заменить документ с удалением приложений? (прикреплённые документы к главному документу)</p>
        <br>
        <button class="btn btn-outline-success" @click="ChangeDoc(selected_id,selected_title,true)">Заменить с
          удалением</button>
        <button class="btn btn-success" @click="ChangeDoc(selected_id,selected_title,false)">Заменить без
          удаления</button>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">Отмена</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";

export default {
  data() {
    return {
      selected_id: -1,
      selected_title: '',
      doc: {
        title: "",
        parentId: null,
        info: "",
        categoryId: 0,
        active: false,
        number: "",
        visibility: false,
        consultant_link: "",
        renew: false,
        file: null
      },
      RespText: "",
      success: "",
      ResponseSQ: []
    };
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
    ShowModal_replace(_id, _title) {
      this.selected_id = _id;
      this.selected_title = _title;
      this.$bvModal.show("modal-Replace");
    },
    async ChangeDoc(_id, _title, _deleteChild) {
      if(!(_id > -1)) {
        this.RespText = "Ошибка! Неверный ид документа";
        this.success = "alert-danger";
        return;
      }
      if(!(_title != '')) {
        this.RespText = "Ошибка! Неверный документ";
        this.success = "alert-danger";
        return;
      }
      if(!(_deleteChild != null)) {
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
          this.doc.info != "" &&
          this.doc.categoryId > 0 &&
          this.doc.file != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }
      this.doc.number = this.doc.number.replace(/\s+/g, '');
      try {
        this.doc.id = _id;
        const res = api.ChangeParamDocument(this.doc, _deleteChild, this.doc.file);
        this.RespText = "Вы успешно заменили документ! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
        this.removeSearchQuery();
        this.$nextTick(() => {
          this.$refs.modal_Replace.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
    },
    async NewVersion(_id, _title) {
      if(!(_id > -1)) {
        this.RespText = "Ошибка! Неверный ид документа";
        this.success = "alert-danger";
        return;
      }
      if(!(_title != '')) {
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
          this.doc.info != "" &&
          this.doc.categoryId > 0 &&
          this.doc.file != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }
      this.doc.number = this.doc.number.replace(/\s+/g, '');
      this.doc.parentId = _id;
      try {
        const res = await api.AddDocument(
          this.doc.title,
          this.doc.parentId,
          this.doc.info,
          this.doc.number,
          this.doc.categoryId,
          this.doc.active,
          this.doc.visibility,
          this.doc.consultant_link,
          this.doc.renew,
          this.doc.file
        );
        this.RespText = "Вы успешно добавили новую версию документа! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
    },
    removeSearchQuery() {
      this.doc.title = "";
      this.ResponseSQ = [];
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
      this.doc.file = null;
      this.$refs.DocFileInput.value = "";
    },
    async submitSearch() {
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
    DeleteConsultant_linkInput() {
      this.doc.consultant_link = "";
    },
    filesChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.doc.file = files[0];
    },
    async AddDoc() {
      if (
        !(
          this.doc.title != "" &&
          this.doc.info != "" &&
          this.doc.categoryId > 0 &&
          this.doc.file != "" &&
          this.doc.number != ""
        )
      ) {
        this.RespText = "Ошибка! Вы не все поля заполнили";
        this.success = "alert-danger";
        return;
      }
      this.doc.number = this.doc.number.replace(/\s+/g, '');
      if(this.ResponseSQ != null && this.ResponseSQ.length > -1) {
        const ind = this.ResponseSQ.findIndex(i => i.title.toLowerCase() == this.doc.title.toLowerCase());
        if(ind > -1) {
          this.RespText = "Ошибка! В системе уже есть такой документ";
          this.success = "alert-danger";
          return;
        }
      }
      try {
        const res = await api.AddDocument(
          this.doc.title,
          this.doc.parentId,
          this.doc.info,
          this.doc.number,
          this.doc.categoryId,
          this.doc.active,
          this.doc.visibility,
          this.doc.consultant_link,
          this.doc.renew,
          this.doc.file
        );
        this.RespText = "Вы успешно добавили документ! " + this.doc.title;
        this.success = "alert-success";
        this.removeDoc();
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
        // console.log(error);
      }
    },
    DeleteDocFileInput() {
      this.doc.file = null;
      this.$refs.DocFileInput.value = "";
    }
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
  font-size: 14px;
}

.form-table tr {
  height: 80px;
}

.form-table th {
  vertical-align: top;
  text-align: left;
  padding: 20px 10px 20px 0;
  width: 400px;
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
  font-size: 14px;
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

/* Table */
.table_blur {
  background-color: #f5ffff;
  border-collapse: collapse;
  text-align: left;
  width: 100%;
  max-width: 1000px;
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
  max-width: 1000px;
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
