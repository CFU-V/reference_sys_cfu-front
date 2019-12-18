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
          <th>Сообщение</th>
          <th>Дата</th>
          <th>Удалить уведомление</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="IsLoadingItems">
          <td colspan="4">
            <loadingsmall :IsLoading="IsLoadingItems" :center="true" style="width:100%"></loadingsmall>
          </td>
        </tr>
        <tr v-else-if="messages.data.length <= 0 && IsLoadingItems == false">
          <td colspan="4" style="text-align: center;">Уведомлений не найдено</td>
        </tr>
        <tr
          v-else
          v-for="(value, index) in messages.data"
          :key="index"
          :style="value.IsView || value.IsRead ? 'background-color: white;' : ''"
        >
          <td>{{ value['sender'] }}</td>
          <td class="collapsible">
            <div>
              <p
                :class="value['IsView'] == true ? 'table_blur-content' : 'table_blur-content-pre'"
              >{{ GetText(value['IsView'], value['text']) }}</p>
            </div>
            <button
              @click="IsDoubleClick(index, value['id'])"
              :class="value['IsView'] == true ? 'btn btn-open-close close-icon' : 'btn btn-open-close open-icon'"
            ></button>
          </td>
          <td>{{ value['date'] }}</td>
          <td>
            <button
              class="btn btn-danger"
              @click="ShowModalWindowDelete(value['text'], value['id'], index)"
            >Х</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="4">Показано {{ messages.data.length }} из {{ messages.total }} уведомлений</th>
        </tr>
      </tfoot>
    </table>

    <!-- PageNavigator -->
    <page-nav
      @click="GetMessages"
      url="/console/messages/"
      :maxPage="messages.pages"
      :Page="$route.params.page"
    ></page-nav>
    <!-- Modal Window -->
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
        <p>{{ DelMessage_data.text }}</p>
        <br />
        <p>Вы уверены, что хотите удалить это уведомление?</p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok,cancel }">
        <b-button :disabled="IsLoading" size="md" variant="success" @click="ok()">Удалить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
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
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      PageNum: 0,
      DelMessage_data: {
        text: "",
        index: "",
        id: -1
      },
      RespText: "",
      success: "",
      messages: {
        data: [],
        total: 0,
        page: 0,
        pageSize: 20,
        pages: 1
      },
      IsLoading: false,
      IsLoadingItems: false,
    };
  },
  components: {
    LoginCheck,
    PageNav: Navigator,
    loadingsmall
  },
  methods: {
    ResetModal() {
      this.RespText = "";
      this.success = "";
      this.DelMessage_data.text = "";
      this.DelMessage_data.id = -1;
      this.DelMessage_data.index = -1;
    },
    handleOk_delete(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.IsLoading = true;
      try {
        this.DeleteMessage(this.DelMessage_data.id, this.DelMessage_data.index);
        this.RespText = "";
        this.success = "";
        this.DelMessage_data.text = "";
        this.DelMessage_data.id = -1;
        this.DelMessage_data.index = -1;
        this.$nextTick(() => {
          this.$refs.modal_delete.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении сообщения!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    ShowModalWindowDelete(_text, _id, _index) {
      this.DelMessage_data.text = _text.length > 120 ? _text.substring(0, _text.length >= 120 ? 120 : _text.length).trim() +  "..." : _text;
      this.DelMessage_data.id = _id;
      this.DelMessage_data.index = _index;
      this.$bvModal.show("modal-prevent-delete");
    },
    IsDoubleClick(_index, id) {
      if (!this.messages.data[_index].IsRead) {
        this.messages.data[_index].IsRead = true;
        this.OnReadMessage(id);
      }
      this.messages.data[_index].IsView = !this.messages.data[_index].IsView;
    },
    GetText(_view, _text) {
      return _view || _text.length < 60
        ? _text.trim()
        : _text.substring(0, _text.length >= 60 ? 60 : _text.length).trim() + "...";
    },
    async GetMessages(_page) {
      //Временно
      this.IsLoadingItems = true;
      const res = await api.GetMessages(_page - 1);
      this.messages.data = [];
      for (const item of res.items) {
        this.messages.data.push({
          id: item.message.id,
          IsRead: item.isRead,
          sender: item.message.author.lastName,
          date: this.convert(item.message.createdAt),
          text: item.message.text,
          IsView: false
        });
      }
      this.messages.page = res.page;
      this.messages.pageSize = res.pageSize;
      this.messages.pages = res.pages;
      this.messages.total = res.total;
      this.IsLoadingItems = false;
    },
    convert(_date) {
      return moment(_date).format("MM.DD.YYYY HH:mm");
    },
    async DeleteMessage(id, index) {
      if (id === null || id === undefined || isNaN(id)) {
        console.error(`[Message|DeleteMessage] - Неверный ID`);
        return;
      }
      try {
        if (!this.messages.data[index].IsRead) {
          this.$store.dispatch(
            "ChangeCountOfAlert",
            this.$store.getters.GetCountAlert - 1
          );
        }
        const response = await api.DeleteMessage(id);
        this.messages.data.splice(index, 1);
        this.messages.total -= 1;
      } catch (error) {
        console.error(error);
      }
    },
    async OnReadMessage(id) {
      try {
        const response = await api.ReadMessage(id);
        this.$store.dispatch(
          "ChangeCountOfAlert",
          this.$store.getters.GetCountAlert - 1
        );
      } catch (error) {}
    }
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageNum = parseInt(
      this.$route.params.page === undefined ? 1 : this.$route.params.page
    );
    this.GetMessages(this.PageNum);
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
  /* background-color: #f5ffff; */
  background-color: #ebf3f9;
  border-collapse: collapse;
  text-align: left;
  width: 100%;
}

.table_blur tfoot > tr {
  text-align: center;
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

.table_blur th {
  width: 450px;
}

.table_blur td:first-child {
  width: 160px;
}

.table_blur th:first-child {
  width: 160px;
}

.table_blur td:last-child {
  width: 100px;
}

.table_blur th:last-child {
  width: 100px;
}

.table_blur th:nth-child(3) {
  width: 100px;
}

.table_blur td:nth-child(3) {
  width: 100px;
}

.table_blur tr:hover td {
  box-shadow: 0px 4px 4px -2px rgba(0, 0, 0, 0.3);
}

.table_blur tbody:hover tr:hover td {
  background-color: white;
  cursor: pointer;

}

.table_blur td {
  border: 1px solid #d1e6f7;
  padding: 10px 15px;
  position: relative;
}

.table_blur td div {
  float: left;
}

.table_blur td h3 {
  line-height: 1.2;
  display: inline;
}

.table_blur-content-pre {
  opacity: 0.8;
  line-height: 1.2;
  display: inline;
}

.table_blur-content {
  display: inline;
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
