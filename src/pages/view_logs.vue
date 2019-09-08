<template>
  <div>
    <!-- Pre loader -->
    <page-loader></page-loader>
    <!-- /Pre loader -->
    <h2>Журнал событий (логи)</h2>
    <p class="table_caption">Список логов</p>
    <table class="table_blur">
      <thead>
        <tr>
          <th>Название файла</th>
          <th>Дата</th>
          <th>Действие</th>
        </tr>
      </thead>
    </table>
    <div class="table_scroll">
      <table class="table_blur">
        <tbody>
          <tr v-for="(value, index) in Items" :key="index">
            <td>{{ value }}</td>
            <td>{{ convert((value.substring(5)).substring(0,10)) }}</td>
            <td>
              <button class="btn btn-success" @click="DownloadFile(value)">Скачать</button>
              <button class="btn btn-outline-info" @click="ViewContent(value)">Просмотр</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="table_blur">
      <tfoot>
        <tr>
          <th>Всего логов: {{ Items.length }}</th>
        </tr>
      </tfoot>
    </table>
    <!-- MW View content file -->
    <b-modal id="modal-viewcontent">
      <template slot="modal-header">
        <h5>
          Просмотр файла
          <b>{{ FileName }}</b>
        </h5>
      </template>
      <template slot="default">
        <textarea name="view_content_file" id="view_content_file" cols="63" rows="20" :value="ContentFile"></textarea>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Navigator from "../components/PageNavigator";
import * as api from "../api";
import FileSaver from "file-saver";
import Loader from "../components/PageLoader.vue";

export default {
  data() {
    return {
      RespText: "",
      success: "",
      ContentFile: "",
      FileName: ""
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.GetStartLogs();
  },
  components: {
    PageNav: Navigator,
    PageLoader: Loader
  },
  methods: {
    convert(_date) {
      var date = new Date(_date);
      return date.toLocaleDateString();
    },
    async DownloadFile(name) {
      try {
        const res = await api.GetContentFileLog(name);
        var blob = new Blob([res], {
          type: "text/plain;charset=utf-8"
        });
        FileSaver.saveAs(blob, name);
      } catch (error) {
        console.log("[Logs] - DownloadFile error");
      }
    },
    async GetStartLogs() {
      try {
        const res = await this.$store.dispatch("GetListLogs");
      } catch (error) {
        console.log(error);
      }
    },
    async ViewContent(name) {
      try {
        const res = await api.GetContentFileLog(name);
        this.ContentFile = res;
        this.FileName = name;
        this.$bvModal.show("modal-viewcontent");
      } catch (error) {}
    }
  },
  computed: {
    Items() {
      let view_logs = this.$store.getters.GetLogs;
      view_logs.sort(function(a, b) {
        if (a > b) return -1;
        return 0;
      });
      return view_logs;
    }
  }
};
</script>

<style scoped>
/* Search */
.search-box {
  margin-top: 50px;
}

.search-box input[type="search"] {
  width: 400px;
}

.search-box .input-group select {
  width: 210px;
}

.search-box button {
  width: 160px;
  margin-left: 30px;
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
  overflow-y: scroll;
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
  width: 450px;
}

.table_blur td:last-child {
  width: 260px;
}

.table_blur th:last-child {
  width: 200px;
}

/* Form */
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
  font-size: 14px;
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
