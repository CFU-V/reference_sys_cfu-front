<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Закладки</h2>
    <p class="table_caption">Список ваших закладок</p>
    <table class="table_blur">
      <thead>
        <tr>
          <th>Название документа</th>
          <th>Контроль</th>
          <th>Удалить закладку</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="IsLoadingItems">
          <td colspan="3">
            <loadingsmall :IsLoading="IsLoadingItems" :center="true" style="width:100%"></loadingsmall>
          </td>
        </tr>
        <tr v-else-if="Items.list.length <= 0 && IsLoadingItems == false">
          <td colspan="3" style="text-align: center;">Закладок не найдено</td>
        </tr>
        <tr v-else v-for="(value, index) in Items.list" :key="index">
          <td>
            <router-link :to="'/docview/' + value['docId']">{{ value['document'].title }}</router-link>
          </td>
          <td>
            <button
              :class="value['control'] ? 'btn btn-danger' : 'btn btn-success'"
              @click="AddOrDeleteControl(value['document'].id, index, !value['control'])"
            >{{ value['control'] ? 'Удалить' : 'Добавить' }}</button>
          </td>
          <td>
            <button
              class="btn btn-danger"
              @click="ShowModalWindow_delete(value['document'].title, value['document'].id, index)"
            >X</button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th colspan="3">Показано {{ Items.list.length }} из {{ Items.total }} закладок</th>
        </tr>
      </tfoot>
    </table>
    <!-- PageNavigator -->
    <page-nav
      @click="GetStartInfo"
      url="/console/bookmark/"
      :maxPage="Items.pages"
      :Page="$route.params.page"
    ></page-nav>
    <!-- Modal Window Delete user -->
    <b-modal size="lg" id="modal-prevent-closing" @hidden="resetModal" @ok="handleOk" ref="modal">
      <template slot="modal-header">
        <h5>Подтверждение</h5>
      </template>
      <template slot="default">
        <p>
          Вы уверены, что хотите удалить закладку
          <b>{{ TheBookMark }}</b>?
        </p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="md" variant="success" @click="ok()">Удалить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";
import Navigator from "../components/PageNavigator";
import LoginCheck from "../components/logincheck.vue";
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      RespText: "",
      success: "",
      TheBookMarkID: "",
      TheBookMark: "",
      TheBookMarkIndex: "",
      IsLoadingItems: false
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.GetStartInfo(
      this.$route.params.page === undefined ? 0 : this.$route.params.page - 1
    );
  },
  components: {
    PageNav: Navigator,
    LoginCheck,
    loadingsmall
  },
  methods: {
    async AddOrDeleteControl(_id, _index, _control) {
      if (!(_id >= 0 && _index >= 0)) {
        this.RespText = "Ошибка! Неверный ID";
        this.success = "alert-danger";
        return;
      }
      try {
        await this.$store.dispatch("UpdateBookMarks", {
          id: _id,
          index: _index,
          control: _control
        });
      } catch (error) {}
    },
    resetModal() {
      this.TheBookMarkID = "";
      this.TheBookMark = "";
      this.TheBookMarkIndex = "";
      this.RespText = "";
      this.success = "";
    },
    ShowModalWindow_delete(name, id, index) {
      this.TheBookMarkID = id;
      this.TheBookMark = name;
      this.TheBookMarkIndex = index;
      this.$bvModal.show("modal-prevent-closing");
    },
    async handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!(this.TheBookMarkID >= 0 && this.TheBookMarkIndex >= 0)) {
        this.RespText = "Ошибка! Неверный ID";
        this.success = "alert-danger";
        return;
      }
      try {
        await this.$store.dispatch("DeleteBookMarkFromList",{ TheBookMarkID:this.TheBookMarkID, index: this.TheBookMarkIndex} );
        this.TheBookMarkID = "";
        this.TheBookMark = "";
        this.TheBookMarkIndex = "";
        this.RespText = "";
        this.success = "";
        this.$nextTick(() => {
          this.$refs.modal.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении закладки!";
        this.success = "alert-danger";
      }
    },
    async GetStartInfo(page) {
      this.IsLoadingItems = true;
      try {
        const res = await this.$store.dispatch("SetBookMarks", page - 1);
      } catch (error) {}
      this.IsLoadingItems = false;
    }
  },
  computed: {
    Items() {
      return this.$store.getters.GetBookMarks;
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

.table_blur th {
  width: 450px;
}

.table_blur td:last-child {
  width: 160px;
}

.table_blur th:last-child {
  width: 160px;
}

.table_blur th:nth-child(2) {
  width: 160px;
}

.table_blur td:nth-child(2) {
  width: 160px;
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
