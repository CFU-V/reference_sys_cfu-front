<template>
  <div id="Fon">
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <div id="left-menu-fon"></div>
    <div id="left-menu-container">
      <ul class="Container left-menu-test">
        <li class="left-menu-title left-menu">
          <p class="left-menu-item left-menu-name">Меню</p>
        </li>
        <li class="hover-item">
          <router-link class="left-menu-item left-menu-name home" to="/">На главную страницу</router-link>
        </li>
        <li class="hover-item">
          <button
            v-show="IsLogin != null"
            :class="'left-menu-item left-menu-name bookmark ' + (doc.bookmarks != null ? 'bookmark-delete' : 'bookmark-add')"
            @click="AddOrDeleteBookMark"
          >{{ doc.bookmarks != null ? 'Удалить из закладок' : 'Добавить в закладки' }}</button>
        </li>
        <li class="hover-item">
          <button
            v-show="IsLogin != null"
            class="left-menu-item left-menu-name info"
            @click="ShowModalProparty()"
          >
            Свойства
            документа
          </button>
        </li>
        <li class="hover-item">
          <button
            v-show="IsLogin != null"
            class="left-menu-item left-menu-name shr"
            @click="ShowModal"
          >Поделиться</button>
        </li>
      </ul>
    </div>
    <!-- The DocViewer [FRAME] -->
    <div id="content" class="scrollViewDoc">
      <iframe class="theFrameOfDoc" name="contentBlock" id="IFarmeTest" ref="TestF" :src="FileURL"></iframe>
    </div>
    <!-- Modal Window Proparty -->
    <b-modal size="lg" id="modal-scoped">
      <template slot="modal-header">
        <h5>Свойства документа</h5>
      </template>
      <template slot="default" v-if="Property != null">
        <p>Автор: {{ Property.creator }}</p>
        <p>Кем сохранен: {{ Property.lastModifiedBy }}</p>
        <p>Редакция: {{ Property.revision }}</p>
        <p>Дата создания документа: {{ convert(Property.createdAt) }}</p>
        <p>Дата последнего сохранения: {{ convert(Property.updatedAt) }}</p>
        <p>Название: {{ Property.title }}</p>
        <p>Тема: {{ Property.subject }}</p>
        <p>Теги: {{ Property.keywords }}</p>
        <p>Информация: {{ GetInfoProp }}</p>
      </template>
      <template v-else>
        <p>Свойства документа не обнаружены!</p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- Modal Window BookMark -->
    <b-modal size="lg" id="modal-bookmark" ref="modal_addbookmark" @ok="OnClickOk_addBookMark">
      <template slot="modal-header">
        <h5>Добавить закладку</h5>
      </template>
      <template slot="default">
        <input type="checkbox" name="isControl" id="isControl" v-model="IsControl" />
        <label for="isControl">Уведомлять об изменениях в документе?</label>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="md" variant="success" @click="ok()">Добавить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Отмена</b-button>
      </template>
    </b-modal>
    <!-- MW Change user -->
    <b-modal
      size="lg"
      ref="modal_share"
      id="modal-prevent-share"
      title="Отправить документ на почту"
      @hidden="resetModal"
      @ok="handleOk_share"
    >
      <form ref="form" class="form-table">
        <table>
          <tbody>
            <tr>
              <th>
                <label for="share-em">Email получателя</label>
              </th>
              <td>
                <input
                  required
                  class="regular-text"
                  type="text"
                  id="share-em"
                  placeholder="test@test.com"
                  v-model="share.email"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="share-cnt">Сообщение</label>
              </th>
              <td>
                <textarea
                  class="regular-text"
                  type="text"
                  id="share-cnt"
                  placeholder="сообщение"
                  v-model="share.content"
                  cols="30"
                  rows="10"
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </form>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button :disabled="IsLoading" size="md" variant="success" @click="ok()">Отправить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
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
      IsControl: false,
      TypeView: null,
      PageID: -1,
      ViewerURL: "https://view.officeapps.live.com/op/view.aspx?src=",
      FileURL: "",
      RespText: "",
      success: "",
      doc: {},
      share: {
        email: "",
        content: ""
      },
      docDate: null,
      Property: null
    };
  },
  computed: {
    IsLogin() {
      return localStorage.getItem("jwt");
    },
    GetInfoProp() {
      return this.ObjectHasKey(this.doc, "info") ? this.doc.info : "";
    }
  },
  components: {
    LoginCheck,
    loadingsmall
  },
  methods: {
    ObjectHasKey(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    },
    convert(_date) {
      var date = new Date(_date);
      const res =
        date.toLocaleDateString() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes();
      if (res != "Invalid Date NaN:NaN") return res;
      else return "";
    },
    OnClickOk_addBookMark() {
      this.AddBookMark(this.IsControl);
    },
    ShowModalProparty(_title, _id) {
      this.GetProps();
      if (this.Property != null) this.$bvModal.show("modal-scoped");
    },
    ShowModal() {
      this.$bvModal.show("modal-prevent-share");
    },
    resetModal() {
      this.share.email = "";
      this.share.content = "";
      this.RespText = "";
      this.success = "";
    },
    async handleOk_share(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (this.share.email == "") {
        this.RespText = "Ошибка! Введите почту получателя";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        const res = await api.ShareDocument(
          this.PageID,
          this.share.email,
          this.share.content
        );
        this.RespText = "";
        this.success = "";
        this.$nextTick(() => {
          this.$refs.modal_share.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при отправки сообщения!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    async AddOrDeleteBookMark() {
      if (this.doc.bookmarks != null) {
        try {
          const res = await api.DeleteBookMark(this.doc.bookmarks.docId);
          this.doc.bookmarks = null;
        } catch (error) {
          console.log("[Delete bookMark] - ERROR");
        }
      } else {
        this.$bvModal.show("modal-bookmark");
      }
    },
    async AddBookMark(_IsControl) {
      this.IsLoading = true;
      try {
        const res = await api.AddBookMark(this.PageID, _IsControl);
        this.GetDocument(this.PageID);
        this.$nextTick(() => {
          this.$refs.modal_addbookmark.hide();
        });
      } catch (error) {
        console.log("[Add bookMark] - ERROR");
      }
      this.IsLoading = false;
    },
    async GetProps() {
      try {
        const res = await api.GetProperty(this.PageID);
        this.Property = {};
        this.Property = res;
      } catch (error) {
        this.Property = null;
      }
    },
    async GetDocument(_id, _date, _type) {
      try {
        const res = await api.GetDocument({id: _id, date: _date, type: _type});
        this.doc = {};
        this.doc = res;
        //https://view.officeapps.live.com/op/view.aspx?src=
        //https://view.officeapps.live.com/op/embed.aspx?src=
        //https://docs.google.com/gview?url=
        //if(this.doc.consultant_link !== null && this.doc.consultant_link !== '') this.ViewerURL = "https://docs.google.com/gview?url=";
        //else this.ViewerURL = "https://view.officeapps.live.com/op/view.aspx?src=";
        //this.FileURL = this.ViewerURL + process.env.BASE_URL_API + "document/download/" + _id;
        if (_date === undefined || _date === null) this.FileURL = this.ViewerURL + process.env.BASE_URL_API + `document/download?id=${_id}`;
        else this.FileURL = this.ViewerURL + process.env.BASE_URL_API + `document/download?id=${_id}&date='${_date}'`;
      } catch (error) {
        this.doc = null;
      }
    }
  },
  created() {
    document.title = this.$route.meta.title;
    this.docDate = this.$route.query.date;
    this.PageID = this.$route.params.id;
    this.TypeView = this.$route.query.source;
    if (this.PageID !== null && this.PageID > 0) {
      try {
        this.GetDocument(this.PageID, this.docDate,  this.TypeView);
      } catch (error) {

      }
    }
  }
};
</script>

<style scoped>
#Fon {
  padding-top: 0px;
  box-sizing: border-box;
  background-color: rgb(119, 119, 119);
  min-width: 1080px;
}

a:hover {
  text-decoration: none;
}

/* Left Menu */

#left-menu-fon {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1;
  min-width: 250px;
  background-color: #23282d;
}

#left-menu-container {
  position: fixed;
  float: left;
  z-index: 99;
  width: 250px;
  background-color: #23282d;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.left-menu-test {
  clear: left;
  width: inherit;
  background-color: #23282d;
  margin-bottom: 50px !important;
}

.left-menu li {
  border: none;
  min-height: 34px;
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.left-menu-item {
  color: #ffffff;
  position: relative;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.3;
  padding: 0;
  display: block;
  border-bottom: 1px solid rgba(124, 124, 124, 0.5);
}

.left-menu-name {
  padding: 25px 0;
  padding-left: 15px;
}

.hover-item:hover {
  background: #191e23;
}

.left-menu-title {
  border: none;
  min-height: 34px;
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
}

.left-menu-title p {
  font-size: 26px;
}

.hover-item button {
  padding-right: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  border-top: 0;
  border-left: 0;
  border-right: 0;
  text-align: left;
}

.hover-item button:before,
.hover-item a:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  margin-top: -15px;
  margin-right: 15px;
  display: inline-block;
  width: 29px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 29px 30px;
  transition: opacity 0.3s linear;
}

.bookmark-delete {
  background-color: rgb(253, 93, 71) !important;
}

.bookmark-delete:hover {
  background-color: rgb(221, 81, 62) !important;
}

.bookmark-delete:active {
  background-color: rgb(204, 75, 58) !important;
}

.bookmark-add {
  background-color: rgb(76, 175, 80) !important;
}

.bookmark-add:hover {
  background-color: rgb(68, 158, 71) !important;
}

.bookmark-add:active {
  background-color: rgb(59, 134, 61) !important;
}

.bookmark:before {
  background-image: url("../assets/img/DocView/white-Bookmark.png");
}

.shr:before {
  background-image: url("../assets/img/DocView/white-shr.png");
}

.info:before {
  background-image: url("../assets/img/DocView/white-info.png");
}

.home:before {
  background-image: url("../assets/img/white-home3.png");
}

/* Content */
#content {
  margin: 0px 0px 0px 250px;
  height: 100vh;
  position: relative;
  background-color: #ffffff;
}

.theFrameOfDoc {
  width: 100%;
  height: 99vh;
  border: 0;
  margin: 0;
  padding: 0;
}

/* TreeView */

.TextOfSection:hover {
  cursor: pointer;
  color: rgba(255, 255, 255, 0.5);
}

.Container {
  padding: 0;
  margin: 0;
  color: white;
}

.Container li {
  list-style-type: none;
}

/* indent for all tree children excepts root */
.Node {
  background-image: url(../assets/img/tree/i.gif);
  background-position: top left;
  background-repeat: repeat-y;
  margin-left: 18px;
  zoom: 1;
}

.IsRoot {
  margin-left: 0;
}

/* left vertical line (grid) for all nodes */
.IsLast {
  background-image: url(../assets/img/tree/i_half.gif);
  background-repeat: no-repeat;
}

.ExpandOpen .Expand {
  background-image: url(../assets/img/tree/expand_minus.gif);
}

/* closed is higher priority than open */
.ExpandClosed .Expand {
  background-image: url(../assets/img/tree/expand_plus.gif);
}

/* highest priority */
.ExpandLeaf .Expand {
  background-image: url(../assets/img/tree/expand_leaf.gif);
}

.Content {
  min-height: 18px;
  margin-left: 18px;
}

* html .Content {
  height: 18px;
}

.Expand {
  width: 18px;
  height: 18px;
  float: left;
}

.ExpandLoading {
  width: 18px;
  height: 18px;
  float: left;
  background-image: url(../assets/img/tree/expand_loading.gif);
}

.ExpandOpen .Container {
  display: block;
}

.ExpandClosed .Container {
  display: none;
}

.ExpandOpen .Expand,
.ExpandClosed .Expand {
  cursor: pointer;
}

.ExpandLeaf .Expand {
  cursor: auto;
}

/* Form */
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

.regular-text {
  width: 100%;
  margin-bottom: 15px;
  max-height: 300px;
  min-height: 30px;
}

.regular-text textarea {
  min-height: 80px;
}
</style>
