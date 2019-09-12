<template>
  <div id="Fon">
    <!-- Pre loader -->
    <page-loader></page-loader>
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
          <button v-show="IsLogin != null"
            :class="'left-menu-item left-menu-name bookmark ' + (doc.bookmarks != null ? 'bookmark-delete' : 'bookmark-add')"
            @click="AddOrDeleteBookMark">{{ doc.bookmarks != null ? 'Удалить из закладок' : 'Добавить в закладки' }}</button>
        </li>
        <li class="hover-item">
          <button class="left-menu-item left-menu-name info" @click="ShowModalProparty()">
            Свойства
            документа
          </button>
        </li>
        <li class="hover-item">
          <button v-show="IsLogin != null" class="left-menu-item left-menu-name shr"
            @click="ShowModal">Поделиться</button>
        </li>
      </ul>
    </div>
    <!-- The DocViewer [FRAME] -->
    <div id="content" class="scrollViewDoc">
      <iframe class="theFrameOfDoc" name="contentBlock" id="IFarmeTest" ref="TestF" :src="FileURL"></iframe>
    </div>
    <!-- Modal Window Proparty -->
    <b-modal id="modal-scoped">
      <template slot="modal-header">
        <h5>Свойства документа</h5>
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
        <p>Информация: {{ doc.info }}</p>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- Modal Window BookMark -->
    <b-modal id="modal-bookmark" ref="modal_addbookmark" @ok="OnClickOk_addBookMark">
      <template slot="modal-header">
        <h5>Добавить закладку</h5>
      </template>
      <template slot="default">
        <input type="checkbox" name="isControl" id="isControl" v-model="IsControl" >
        <label for="isControl">Уведомлять об изменениях в документе?</label>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">Добавить</b-button>
        <b-button size="sm" variant="danger" @click="cancel()">Отмена</b-button>
      </template>
    </b-modal>
    <!-- MW Change user -->
    <b-modal ref="modal_share" id="modal-prevent-share" title="Отправить документ на почту" @hidden="resetModal"
      @ok="handleOk_share">
      <form ref="form" class="form-table">
        <table>
          <tbody>
            <tr>
              <th>
                <label for="share-em">Email получателя</label>
              </th>
              <td>
                <input required class="regular-text" type="text" id="share-em" placeholder="test@test.com"
                  v-model="share.email" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="share-cnt">Сообщение</label>
              </th>
              <td>
                <textarea class="regular-text" type="text" id="share-cnt" placeholder="контент" v-model="share.content"
                  cols="30" rows="10"></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </form>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button :disabled="IsLoading" size="sm" variant="success" @click="ok()">Отправить</b-button>
        <b-button size="sm" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";
import Loader from "../components/PageLoader";
import LoginCheck from "../components/logincheck.vue";
import loadingsmall from "../components/loading_small.vue";

export default {
  data() {
    return {
      IsLoading: false,
      IsControl: false,
      PageID: -1,
      ViewerURL: 'https://view.officeapps.live.com/op/view.aspx?src=',
      FileURL:
        "https://view.officeapps.live.com/op/view.aspx?src=ejudge.cfuv.ru/problems/practice2.docx",
      RespText: "",
      success: "",
      doc: {},
      share: {
        email: "",
        content: ""
      },
      Property: {}
    };
  },
  computed: {
    IsLogin() {
      return localStorage.getItem("jwt");
    }
  },
  components: {
    LoginCheck,
    loadingsmall,
    PageLoader: Loader
  },
  methods: {
    convert(_date) {
      var date = new Date(_date);
      return (
        date.toLocaleDateString() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes()
      );
    },
    async GetProps() {
      try {
        const res = await api.GetProperty(this.PageID);
        this.Property = res;
      } catch (error) {}
    },
    OnClickOk_addBookMark() {
      this.AddBookMark(this.IsControl);
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
    ShowModalProparty(_title, _id) {
      this.GetProps();
      if (this.Property != null) this.$bvModal.show("modal-scoped");
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
    async GetDocument(_id) {
      try {
        const res = await api.GetDocument(_id);
        this.doc = res;
        this.FileURL = (this.ViewerURL + this.$store.getters.GetApiURL + "/document/download/" + _id);
      } catch (error) {}
    }
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageID = this.$route.params.id;
    if (this.PageID != null && this.PageID > 0) this.GetDocument(this.PageID);
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
  font-size: 14px;
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
