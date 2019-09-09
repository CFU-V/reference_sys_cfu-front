<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Ваши уведомления</h2>
    <p class="table_caption">Список ваших уведомлений</p>
    <table class="table_blur">
      <thead>
        <tr>
          <th>Отправитель</th>
          <th>Тема</th>
          <th>Дата</th>
          <th>Удалить уведомление</th>
        </tr>
      </thead>
    </table>
    <div class="table_scroll">
      <table class="table_blur">
        <tbody>
          <tr v-for="(value, index) in messages.data" :key="index">
            <td>{{ value['sender'] }}</td>
            <td class="collapsible">
              <div>
                <h3>{{ value['title'] }} -</h3>
                <p :class="value['IsView'] == true ? 'table_blur-content' : 'table_blur-content-pre'">
                  {{ GetText(value['IsView'],value['text']) }}</p>
              </div>
              <button @click="IsDoubleClick(index)"
                :class="value['IsView'] == true ? 'btn btn-open-close close-icon' : 'btn btn-open-close open-icon'"></button>
            </td>
            <td>{{ value['date'] }}</td>
            <td>
              <button class="btn btn-danger"
                @click="ShowModalWindowDelete(value['title'],value['text'], value['id'], index)">Х</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <table class="table_blur">
      <tfoot>
        <tr>
          <th>Всего уведомлений: {{ messages.total }}</th>
        </tr>
      </tfoot>
    </table>
    <!-- PageNavigator -->
    <page-nav @click="NextPageMessage" url='/console/messages/' :maxPage='messages.pages' :Page="$route.params.page">
    </page-nav>
    <!-- Modal Window -->
    <b-modal ref="modal_delete" id="modal-prevent-delete" @hidden="ResetModal" @ok="handleOk_delete">
      <template slot="modal-header">
        <h5>Подтверждение</h5>
      </template>
      <template slot="default">
        <b>{{ DelMessage_data.title }} -</b>
        <p>{{ DelMessage_data.text }}</p>
        <br />
        <p>Вы уверены, что хотите удалить это уведомление?</p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok,cancel }">
        <b-button size="sm" variant="success" @click="ok()">Удалить</b-button>
        <b-button size="sm" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- /Modal Window -->
  </div>
</template>

<script>
import moment from "moment";
import * as api from "../api";
import Navigator from "../components/PageNavigator";
import LoginCheck from "../components/logincheck.vue";

export default {
  data() {
    return {
      DelMessage_data: {
        title: "",
        text: "",
        index: "",
        id: -1
      },
      RespText: "",
      success: "",
      messages: {
        data: [
          {
            id: 0,
            sender: "Система",
            title: "(Редактирование)",
            date: "11.08.2019 22:47",
            text:
              "Документ: Правовые акты, приказ №00625 - был изменён пользователем: Фортис И.С.",
            IsView: false
          },
          {
            id: 1,
            sender: "Администратор",
            title: "Важное сообщение",
            date: "10.08.2019 20:12",
            text:
              "Региональный этап Всероссийской олимпиады профессионального мастерства обучающихся по УГС 18.00.00 Химические технологии по специальности 18.02.01 Аналитический контроль качества химических соединений (далее – региональный этап) проводится в целях выявления наиболее одарённых и талантливых студентов, повышения качества профессиональной подготовки",
            IsView: false
          },
          {
            id: 2,
            sender: "Система",
            title: "(Удалён документ)",
            date: "10.08.2019 16:35",
            text:
              "Документ: Правовые акты, приказ №00132 - был удалён из системы пользователем: Фортис И.С.",
            IsView: false
          }
        ],
        total: 3,
        page: 1,
        pageSize: 20,
        pages: 1
      }
    };
  },
  components: {
    LoginCheck,
    PageNav: Navigator
  },
  methods: {
    ResetModal() {
      this.RespText = "";
      this.success = "";
      this.DelMessage_data.title = "";
      this.DelMessage_data.text = "";
      this.DelMessage_data.id = -1;
      this.DelMessage_data.index = -1;
    },
    handleOk_delete(bvModalEvt) {
      bvModalEvt.preventDefault();
      try {
        this.messages.data.splice(this.DelMessage_data.index,1);
        console.log(this.messages.data);
        this.RespText = "";
        this.success = "";
        this.DelMessage_data.title = "";
        this.DelMessage_data.text = "";
        this.DelMessage_data.id = -1;
        this.DelMessage_data.index = -1;
        this.$nextTick(() => {
          this.$refs.modal_delete.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении документа!";
        this.success = "alert-danger";
      }
    },
    ShowModalWindowDelete(_title, _text, _id, _index) {
      this.DelMessage_data.title = _title;
      this.DelMessage_data.text =
        _text.substring(0, _text.length >= 120 ? 120 : _text.length).trim() +
        "...";
      this.DelMessage_data.id = _id;
      this.DelMessage_data.index = _index;
      this.$bvModal.show("modal-prevent-delete");
    },
    IsDoubleClick(_index) {
      this.messages.data[_index].IsView = !this.messages.data[_index].IsView;
    },
    NextPageMessage(_page) {},
    GetText(_view, _text) {
      return _view
        ? _text.trim()
        : _text.substring(0, _text.length >= 60 ? 60 : _text.length).trim() +
            "...";
    }
  },
  created() {
    document.title = this.$route.meta.title;
  },
  filters: {
    formDate(value) {
      return moment(String(value)).format("MM/DD/YYYY hh:mm");
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active в версии ниже 2.1.8 */ {
  opacity: 0;
}

.btn-open-close {
  float: right;
  width: 35px;
  height: 38px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 19px 20px;
}

.close-icon {
  background-image: url("../assets/img/white-close-message.png");
  background-color: #dc3545;
}

.open-icon {
  background-color: #218838;
  background-image: url("../assets/img/white-open-message.png");
}

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

.table_blur th {
  width: 450px;
}

.table_blur td:last-child {
  width: 160px;
}

.table_blur th:last-child {
  width: 160px;
}

.table_blur td:first-child {
  width: 160px;
}

.table_blur th:first-child {
  width: 160px;
}

.table_blur th:nth-child(3) {
  width: 160px;
}

.table_blur td:nth-child(3) {
  width: 160px;
}

.table_blur tbody:hover tr:hover td {
  /* text-shadow: 0 5px 5px #a09f9d; */
  background-color: white;
  cursor: pointer;
}

.table_blur td {
  border: 1px solid #d1e6f7;
  padding: 10px 15px;
  position: relative;
  /* width: 450px; */
}

.table_blur td div {
  float: left;
}

.table_blur td h3 {
  /* margin-right: 10px; */
  line-height: 1.2;
  display: inline;
  /* float: left; */
}

.table_blur-content-pre {
  opacity: 0.4;
  line-height: 1.2;
  display: inline;
  /* float: left; */
}

.table_blur-content {
  display: inline;
  /* float: left; */
}

/* PageNavigator */
.PageNavigator {
  clear: both;
  margin-bottom: 30px;
  border-top: 1px solid #cfcfcf;
  padding-top: 50px;
  margin-top: 30px;
}

.PageNavigator a:first-child {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.PageNavigator a:last-child {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.PageNavigator a,
.PageNavigator span {
  color: #333;
  padding: 5px 25px;
  font-size: 18px;
  border: 1px solid #cfcfcf;
  float: left;
}

.PageNavigator span.current {
  font-weight: 700;
  color: #fff;
  background-color: #0073a2;
  border: 1px solid #0073a2;
}

.PageNavigator a:hover {
  background-color: #2ea1cd;
  color: #fff;
  border: 1px solid #0073a2;
}
</style>
