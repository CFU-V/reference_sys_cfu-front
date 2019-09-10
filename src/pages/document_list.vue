<template>
  <div>
    <!-- Pre loader -->
    <page-loader></page-loader>
    	<!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Список документов</h2>
    <form class="form-inline search-box">
      <div class="input-group">
        <input type="search" class="form-control" id="inlineFormInputName2" :placeholder="'Быстрый поиск документов'"
          v-model="SimpleSearchText" />
      </div>
      <button type="submit" class="btn btn-info" @click.prevent="GetSimpleSearch">Поиск</button>
      <button class="btn btn-outline-primary" @click.prevent="OnClickButton_advSearch">Расширенный поиск</button>
    </form>
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
              <input class="regular-text" type="text" id="name-of-document" v-model="AdvanceDataSearch.title" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="number-of-document">Номер (приказа/документа и тд)</label>
            </th>
            <td>
              <input class="regular-text" type="text" id="number-of-document" v-model="AdvanceDataSearch.number" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="dateReg">Дата регистрации</label>
            </th>
            <td>
              <input class="regular-text" type="date" id="dateReg" v-model="AdvanceDataSearch.dateReg" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="dateAdd">Дата добавления</label>
            </th>
            <td>
              <input class="regular-text" type="date" id="dateAdd" v-model="AdvanceDataSearch.dateAdd" />
            </td>
          </tr>
          <tr>
            <th>
              <label for="category-of-document">Вид документа</label>
            </th>
            <td>
              <select class="custom-select" id="category-of-document" v-model="AdvanceDataSearch.category">
                <option value disabled>Фильтр по классификации документа</option>
                <option value="Все">Все</option>
                <option value="Законодательство">Законодательство</option>
                <option value="Судебная практика">Судебная практика</option>
                <option value="Финансовые и кадровые консультации">
                  Финансовые и кадровые
                  консультации
                </option>
                <option value="Консультации для бюджетных организаций">
                  Консультации для
                  бюджетных
                  организаций
                </option>
                <option value="Комментарии законодательства">Комментарии законодательства</option>
                <option value="Формы документов">Формы документов</option>
                <option value="Технические нормы и правила">Технические нормы и правила</option>
                <option value="Проекты правовых актов">Проекты правовых актов</option>
                <option value="Международные правовые акты">Международные правовые акты</option>
                <option value="Правовые акты по здравоохранению">
                  Правовые акты по
                  здравоохранению
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <th>
              <label for="status-of-document">Статус</label>
            </th>
            <td>
              <select class="custom-select" id="status-of-document" v-model="AdvanceDataSearch.active">
                <option value disabled>(Активный/Неактивный)</option>
                <option value="Все">Все</option>
                <option value="true">Активный</option>
                <option value="false">Неактивный</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <input class="btn btn-secondary" @click.prevent="GetAdvanceSearch" type="submit"
        value="Поиск документов" />
    </form>
    <button v-show="IsSearch" class="btn btn-success" style="margin-top: 50px" @click="GetViewAllDoc(PageNum)">Показать все документы</button>
    <p class="table_caption">Таблица документов</p>
    <div class="table_scroll">
      <table class="table_blur">
        <thead>
          <tr>
            <th>Название</th>
            <th>Статус документа</th>
            <th>Видимость</th>
            <th>Номер</th>
            <th>Обновляемость</th>
            <th>Тип документа</th>
            <th>Дата добавления</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, index) in GetDocumentList.items" :key="index">
            <td>
              <router-link :to="'/docview/' + value['id']">{{ value['title'] }}</router-link>
            </td>
            <td>{{ value['active'] == true ? 'Активный' : 'Неактивный' }}</td>
            <td>{{ value['visibility'] == true ? 'Да' : 'Нет' }}</td>
            <td>{{ value['number'] }}</td>
            <td>{{ value['renew'] == true ? 'Да' : 'Нет' }}</td>
            <td>{{ GetDocCategory[value['categoryId']-1] }}</td>
            <td>{{ IsSearch ? convert_unix(value['createdAt']) : convert(value['createdAt']) }}</td>
            <td>
              <button class="btn btn-success" @click="ShowModalWindow(value['title'],value['id'])">Свойства</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="table_blur">
      <tfoot>
        <tr>
          <th>Найдено документов: {{ GetDocumentList.total }}</th>
        </tr>
      </tfoot>
    </table>
    <!-- PageNavigator -->
    <page-nav v-if="IsSearch == false" @click="DocList" url='/console/document-list/' :maxPage='GetDocumentList.pages'
      :Page="$route.params.page"></page-nav>
    <div v-else class="PageNavigator">
      <button @click="ClickBack">Назад</button>
      <button @click="ClickNext">Далее</button>
    </div>
    <!-- Modal Window -->
    <b-modal id="modal-scoped">
      <template slot="modal-header">
        <h5>Свойства документа: {{ TheTitleOfDoc }}</h5>
      </template>
      <template slot="default">
        <p>Автор: {{ Property.creator }}</p>
        <p>Кем сохранен: {{ Property.lastModifiedBy }}</p>
        <p>Редакция: {{ Property.revision }}</p>
        <p>Дата создания документа: {{ convert(Property.createdAt) }}</p>
        <p>Дата последнего сохранения: {{ convert(Property.updatedAt) }}</p>
        <p>Название: {{ Property.title }}</p>
        <p>Тема: {{ Property.subject }}</p>
        <p>Теги: {{ Property.keywords }}</p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- /Modal Window -->
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import * as api from "../api";
import Loader from "../components/PageLoader.vue";
import mnt from "moment";
import LoginCheck from "../components/logincheck.vue";

export default {
  data() {
    return {
      TheTitleOfDoc: '',
      ViewAdvanceSearch: false,
      SimpleSearchText: "",
      PageNum: 1,
      Property: {},
      IsSearch: false,
      DataSearch: {
        type: "simple",
        visibility: true,
        data: null
      },
      AdvanceDataSearch: {
        text: "",
        title: "",
        number: "",
        dateReg: "",
        dateAdd: "",
        category: "",
        active: ""
      },
    };
  },
  components: {
    PageNav: Navigator,
    LoginCheck,
    PageLoader: Loader
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageNum = parseInt(this.$route.params.page == "undefined" ? 1 : this.$route.params.page);
    this.DocList(this.PageNum);
  },
  methods: {
    ViewNotification(_title,_text,_type) {
      this.$notify({
        group: 'foo',
        type: _type,
        title: _title,
        text: _text,
      });
    },
    ClickNext() {
      if (this.DataSearch.data == null) {
        this.ViewNotification('Внимание','Ошибка! Вы ничего не заполнили','error');
        return;
      }
      this.PageNum += 1;
      this.$router.push("/console/document-list/" + this.PageNum);
      this.GetSearch(this.PageNum);
    },
    ClickBack() {
      if (this.DataSearch.data == null) {
        this.ViewNotification('Внимание','Ошибка! Вы ничего не заполнили','error');
        return;
      }
      if (this.PageNum - 1 >= 1) {
        this.PageNum -= 1;
        this.$router.push("/console/document-list/" + this.PageNum);
        this.GetSearch(this.PageNum);
      }
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
            query:
              (
                new Date(
                  mnt(this.AdvanceDataSearch.dateAdd).format("YYYY.MM.DD")
                ).getTime()
              ).toFixed(0),
            field: "createdAt"
          });
        if (this.AdvanceDataSearch.dateReg != "")
          this.DataSearch.data.push({
            query:
              (
                new Date(
                  mnt(this.AdvanceDataSearch.dateReg).format("YYYY.MM.DD")
                ).getTime()
              ).toFixed(0),
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

        this.GetSearch(this.PageNum);
      } catch (error) {
        console.log("[AdvanceSearch] - ERROR!");
      }
    },
    GetSimpleSearch() {
      this.DataSearch.type = "simple";
      this.DataSearch.data = this.SimpleSearchText;
      this.GetSearch(this.PageNum);
    },
    async GetViewAllDoc(_page) {
      this.IsSearch = false;
      this.ViewAdvanceSearch = false;
      try {
        const res = await this.$store.dispatch("SetDocuments", { page: _page-1, search: this.IsSearch });
      } catch (error) {

      }
    },
    async GetSearch(_page) {
      if (this.DataSearch.data == null || this.DataSearch.data == "" ) {
        if(!(this.DataSearch.type == 'advance' && (this.AdvanceDataSearch.category =='Все' || this.AdvanceDataSearch.active == 'Все'))) {
          this.ViewNotification('Внимание','Ошибка! Вы ничего не заполнили','error');
          return;
        }
      }
      this.IsSearch = true;
      _page -= 1;
      _page *= 10;
      try {
        const res = await this.$store.dispatch("SetDocuments", {
          search: this.IsSearch,
          type: this.DataSearch.type,
          content: "documents",
          from: _page,
          to: _page + 10,
          visibility: this.DataSearch.visibility,
          data: this.DataSearch.data
        });
      } catch (error) {

      }
    },
    async GetProps(_id) {
      try {
        const res = await api.GetProperty(_id);
        this.Property = res;
      } catch (error) {

      }
    },
    convert(_date) {
      var date = new Date(_date);
      return date.toLocaleDateString();
    },
    convert_unix(unixtimestamp) {
      const date = new Date(Math.floor(unixtimestamp));
      return date.toLocaleDateString();
    },
    ShowModalWindow(_title_doc, _id) {
      this.TheTitleOfDoc = _title_doc;
      this.GetProps(_id);
      this.$bvModal.show("modal-scoped");
    },
    OnClickButton_advSearch() {
      this.ViewAdvanceSearch = !this.ViewAdvanceSearch;
    },
    async DocList(_page) {
      this.IsSearch = false;
      try {
        const res = await this.$store.dispatch("SetDocuments", { page: _page-1, search: this.IsSearch });
      } catch (error) {

      }
    }
  },
  computed: {
    GetDocumentList() {
      return this.$store.getters.GetDocList;
    },
    GetDocCategory() {
      return this.$store.getters.GetDocCategory;
    }
  },
};
</script>

<style scoped>
/* Advance Search */
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

/* Search */
.search-box {
  margin-top: 50px;
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
  overflow: scroll;
  height: auto;
  max-height: 800px;
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
  width: 295px;
}

.table_blur th:first-child {
  width: 280px;
}

.table_blur td:last-child {
  width: 230px;
}

.table_blur th:last-child {
  width: 240px;
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
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.PageNavigator button:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
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
  border: 1px solid #0073a2;
}
</style>
