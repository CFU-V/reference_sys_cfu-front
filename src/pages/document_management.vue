<template>
  <div>
    <!-- Check login -->
    <login-check :viewMW="true"></login-check>
    <!-- /Check login -->
    <h2>Управление документами</h2>
    <switch-toggle
      class="SwicthTG"
      :checked="ViewAdvanceSearch"
      first_text="Расширенный поиск"
      last_text="Быстрый поиск"
      @IsChanged="OnClickSwitchButton"
    ></switch-toggle>
    <transition name="Animation_SwitchSimpleSearch">
      <form class="form-inline search-box" v-show="(ViewAdvanceSearch == false)">
        <div class="input-group">
          <input
            type="search"
            class="form-control"
            id="inlineFormInputName2"
            :placeholder="'Быстрый поиск документов'"
            v-model="SimpleSearchText"
          />
        </div>
        <button type="submit" class="btn btn-success" @click.prevent="GetSimpleSearch">Поиск</button>
      </form>
    </transition>
    <transition name="Animation_SwitchAdvanceSearch">
      <form class="form-table" v-show="ViewAdvanceSearch">
        <h2>Расширенный поиск</h2>
        <table>
          <tbody>
            <tr>
              <th>
                <label for="text-of-document">Текст документа</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="text-of-document"
                  placeholder="контент документа"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="name-of-document">Название документа</label>
              </th>
              <td>
                <textarea
                  class="regular-text"
                  type="text"
                  id="name-of-document"
                  v-model="AdvanceDataSearch.title"
                  placeholder="Проект приказа № 335 от 29.02.2016..."
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>
                <label for="number-of-document">Номер (приказа/документа и тд)</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="number-of-document"
                  v-model="AdvanceDataSearch.number"
                  placeholder="335"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="dateReg">Дата регистрации</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="date"
                  id="dateReg"
                  v-model="AdvanceDataSearch.dateReg"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="dateAdd">Дата добавления</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="date"
                  id="dateAdd"
                  v-model="AdvanceDataSearch.dateAdd"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="category-of-document">Вид документа</label>
              </th>
              <td>
                <select
                  class="custom-select"
                  id="category-of-document"
                  v-model="AdvanceDataSearch.category"
                >
                  <option value disabled>Фильтр по классификации документа</option>
                  <option value="Все">Все</option>
                  <option
                    v-for="(value, index) in GetDocCategory"
                    :key="index"
                    :value="value"
                  >{{value}}</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>
                <label for="status-of-document">Статус</label>
              </th>
              <td>
                <select
                  class="custom-select"
                  id="status-of-document"
                  v-model="AdvanceDataSearch.active"
                >
                  <option value disabled>(Активный/Неактивный)</option>
                  <option value="Все">Все</option>
                  <option value="true">Активный</option>
                  <option value="false">Неактивный</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="btn btn-success" @click.prevent="GetAdvanceSearch" type="submit">Поиск</button>
      </form>
    </transition>
    <button
      v-show="IsSearch"
      class="btn btn-outline-primary"
      style="margin-top: 50px"
      @click="GetViewAllDoc(PageNum)"
    >Показать все документы</button>
    <p class="table_caption">Список документов</p>
    <div class="OverflowY_scroll">
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
        <transition-group name="Animation_ViewItems" tag="tbody">
          <tr v-if="IsLoadingItems" :key="1">
            <td colspan="8">
              <loadingsmall :IsLoading="IsLoadingItems" :center="true" style="width:100%"></loadingsmall>
            </td>
          </tr>
          <tr v-else-if="GetDocumentList.items.length <= 0 && IsLoadingItems == false" :key="2">
            <td colspan="8" style="text-align: center;">Документов не найдено</td>
          </tr>
          <tr v-else v-for="(value, index) in GetDocumentList.items" :key="index + 2">
            <td>
              <img
                v-show="value.consultant_link !== null && value.consultant_link !== ''"
                src="../assets/img/KSPlust-icon.png"
                alt
              />
              <router-link :to="'/docview/' + value['id']">{{ value['title'] }}</router-link>
            </td>
            <td>{{ String(value['active']) == 'true' ? 'Активный' : 'Неактивный' }}</td>
            <td>{{ value['visibility'] == true ? 'Да' : 'Нет' }}</td>
            <td>{{ value['number'] }}</td>
            <td>{{ String(value['renew']) == 'true' ? 'Да' : 'Нет' }}</td>
            <td>{{ GetDocCategory[value['categoryId']-1] }}</td>
            <td>{{ IsSearch ? convert_unix(value['createdAt']) : convert(value['createdAt']) }}</td>
            <td>
              <button
                class="btn btn-success"
                @click="ShowMWChoose(value['title'],value['id'], index)"
              >Редактировать</button>
              <button
                class="btn btn-outline-danger"
                @click="ShowMWDelete(value['title'],value['id'], index)"
              >Удалить</button>
            </td>
          </tr>
        </transition-group>
        <tfoot>
          <tr>
            <th
              colspan="8"
            >Показано {{ GetDocumentList.items.length }} из {{ GetDocumentList.total }} документов</th>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- PageNavigator -->
    <page-nav
      @click="DocList"
      url="/console/document-management/"
      :maxPage="GetDocumentList.pages"
      :Page="$route.params.page"
    ></page-nav>
    <!-- Modal Window Delete Doc -->
    <b-modal
      size="lg"
      ref="modal_delete"
      id="modal-prevent-delete"
      @hidden="OnResetModal"
      @ok="OnClickDelete"
    >
      <template slot="modal-header">
        <h5>Подтверждение</h5>
      </template>
      <template slot="default">
        <p>
          Название документа:
          <b>{{ doc.title }}</b>
        </p>
        <p>Вы уверены, что хотите удалить этот документ?</p>
        <div class="alert" :class="success" role="alert">{{ RespText }}</div>
        <loadingsmall :IsLoading="IsLoading" :center="true"></loadingsmall>
      </template>
      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button :disabled="IsLoading" size="md" variant="success" @click="ok()">Удалить</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- MW Show choose -->
    <b-modal size="lg" id="modal-choose" ref="modal_choose">
      <template slot="modal-header">
        <h5>Выберите, что редактировать</h5>
      </template>
      <template slot="default">
        <button
          :disabled="doc.item.consultant_link !== null && doc.item.consultant_link !== ''"
          style="width:50%"
          class="btn btn-success"
          @click="ShowMWProp()"
        >Свойства</button>
        <button
          style="width:49%"
          class="btn btn-outline-success"
          @click="ShowMWParam()"
        >Параметры документа</button>
      </template>
      <template slot="modal-footer" slot-scope="{ cancel }">
        <b-button size="md" variant="danger" @click="cancel()">Отмена</b-button>
      </template>
    </b-modal>
    <!-- MW Change Proparty -->
    <b-modal
      size="lg"
      ref="modal_proparty"
      id="modal-prevent-proparty"
      @hidden="OnResetModal"
      @ok="OnClickProparty"
    >
      <template slot="modal-header">
        <h5>Свойства документа</h5>
      </template>
      <p>
        Документ:
        <b>{{ doc.title }}</b>
      </p>
      <form ref="form" class="form-table">
        <table>
          <tbody>
            <tr>
              <th>
                <label for="prop-creator">Автор</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="prop-creator" v-model="prop.creator" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-lastModifiedBy">Кем сохранен</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="prop-lastModifiedBy"
                  v-model="prop.lastModifiedBy"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-revision">Редакция</label>
              </th>
              <td>
                <input
                  disabled
                  class="regular-text"
                  type="text"
                  id="prop-revision"
                  :value="prop.revision"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-createdAt">Дата создания документа</label>
              </th>
              <td>
                <input
                  disabled
                  class="regular-text"
                  type="text"
                  id="prop-createdAt"
                  :value="convert(prop.createdAt)"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-updatedAt">Дата последнего сохранения</label>
              </th>
              <td>
                <input
                  disabled
                  class="regular-text"
                  type="text"
                  id="prop-updatedAt"
                  :value="convert(prop.updatedAt)"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-title">Название</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="prop-title" v-model="prop.title" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-subject">Тема</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="prop-subject" v-model="prop.subject" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="prop-keywords">Теги</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="prop-keywords" v-model="prop.keywords" />
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
        >Редактировать (сохранить)</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
    <!-- MW Change Doc parametres -->
    <b-modal
      size="lg"
      ref="modal_parametres"
      id="modal-prevent-parametres"
      @hidden="OnResetModal"
      @ok="OnClickParametres"
    >
      <template slot="modal-header">
        <h5>Параметры документа</h5>
      </template>
      <p>
        Документ:
        <b>{{ doc.title }}</b>
      </p>
      <form ref="form" class="form-table">
        <table>
          <tbody>
            <tr>
              <th>
                <label for="param-consultant_link">Ссылка на "КонсультантПлюс"</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="param-consultant_link"
                  :value="doc.item.consultant_link"
                  disabled="true"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-title">Название</label>
              </th>
              <td>
                <textarea
                  class="regular-text"
                  type="text"
                  id="param-title"
                  v-model="doc.item.title"
                  placeholder="Проект приказа № 335 от 29.02.2016..."
                ></textarea>
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-parentId">ID на главный документ</label>
              </th>
              <td>
                <input
                  class="regular-text"
                  type="text"
                  id="param-parentId"
                  v-model="doc.item.parentId"
                />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-info">Информация</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="param-revision" v-model="doc.item.info" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-categoryId">Классификация</label>
              </th>
              <td>
                <select class="regular-text" id="param-categoryId" v-model="doc.item.categoryId">
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
                <label for="param-number">Номер</label>
              </th>
              <td>
                <input class="regular-text" type="text" id="param-number" v-model="doc.item.number" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-date">Дата регистрации документа</label>
              </th>
              <td>
                <input class="regular-text" type="date" id="param-date" v-model="doc.item.date" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-active">Статус документа (активный/неактивный)</label>
              </th>
              <td>
                <input type="checkbox" id="param-active" v-model="doc.item.active" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-visibility">Видимость (видимый/невидимый)</label>
              </th>
              <td>
                <input type="checkbox" id="param-visibility" v-model="doc.item.visibility" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-renew">Обновляемость</label>
              </th>
              <td>
                <input type="checkbox" id="param-renew" v-model="doc.item.renew" />
              </td>
            </tr>
            <tr>
              <th>
                <label for="param-renew">Очистить прикрепленные файлы к этому документу?</label>
              </th>
              <td>
                <select class="regular-text" id="param-deleteChilds" v-model="deleteChilds">
                  <option value disabled>(Очистить прикрепленные файлы)</option>
                  <option :value="false">Нет</option>
                  <option :value="true">Да</option>
                </select>
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
        >Редактировать (сохранить)</b-button>
        <b-button size="md" variant="danger" @click="cancel()">Закрыть</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import * as api from "../api";
import Navigator from "../components/PageNavigator";
import mnt from "moment";
import LoginCheck from "../components/logincheck.vue";
import loadingsmall from "../components/loading_small.vue";
import switchToggle from "../components/switch_toggle";

export default {
  data() {
    return {
      IsLoading: false,
      IsLoadingItems: false,
      ViewAdvanceSearch: false,
      deleteChilds: false,
      RespText: "",
      success: "",
      SimpleSearchText: "",
      PageNum: 1,
      doc: {
        id: null,
        index: null,
        title: null,
        item: {}
      },
      prop: {
        id: null,
        title: null,
        subject: null,
        creator: null,
        keywords: null,
        lastModifiedBy: null,
        revision: null,
        createdAt: null,
        updatedAt: null
      },
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
      }
    };
  },
  created() {
    document.title = this.$route.meta.title;
    this.PageNum = parseInt(
      this.$route.params.page == "undefined" ? 1 : this.$route.params.page
    );
    this.DocList(this.PageNum);
  },
  components: {
    PageNav: Navigator,
    LoginCheck,
    loadingsmall,
    switchToggle
  },
  methods: {
    ObjectHasKey(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    },
    OnClickSwitchButton(e) {
      this.ViewAdvanceSearch = e;
    },
    ViewNotification(_title, _text, _type) {
      this.$notify({
        group: "foo",
        type: _type,
        title: _title,
        text: _text
      });
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
            query: new Date(
              mnt(this.AdvanceDataSearch.dateAdd).format("YYYY.MM.DD")
            )
              .getTime()
              .toFixed(0),
            field: "createdAt"
          });
        if (this.AdvanceDataSearch.dateReg != "")
          this.DataSearch.data.push({
            query: new Date(
              mnt(this.AdvanceDataSearch.dateReg).format("YYYY.MM.DD")
            )
              .getTime()
              .toFixed(0),
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
      this.IsLoadingItems = true;
      if (this.PageNum > 1) this.$router.push("/console/document-management/1");
      this.PageNum = 1;
      this.IsSearch = false;
      try {
        const res = await this.$store.dispatch("SetDocuments", {
          page: 0,
          search: this.IsSearch,
          typeState: "advanced"
        });
      } catch (error) {}
      this.IsLoadingItems = false;
    },
    async GetSearch(_page) {
      if (this.DataSearch.data === null || this.DataSearch.data === "") {
        if (
          !(
            this.DataSearch.type === "advance" &&
            (this.AdvanceDataSearch.category === "Все" ||
              this.AdvanceDataSearch.active === "Все")
          )
        ) {
          this.ViewNotification(
            "Внимание",
            "Ошибка! Вы ничего не заполнили",
            "error"
          );
          return;
        }
      }
      this.IsSearch = true;
      this.IsLoadingItems = true;
      try {
        const res = await this.$store.dispatch("SetDocuments", {
          search: this.IsSearch,
          type: this.DataSearch.type,
          content: "documents",
          page: _page - 1,
          data: this.DataSearch.data,
          typeState: "advanced"
        });
      } catch (error) {}
      this.IsLoadingItems = false;
    },
    async GetProps(_id) {
      try {
        const res = await api.GetProperty(_id);
        this.prop = res;
        this.prop.id = _id;
        this.prop.createdAt = mnt(
          this.prop.createdAt,
          "YYYY-MM-DD HH:mm:ss"
        ).valueOf();
        this.prop.updatedAt = mnt(
          this.prop.updatedAt,
          "YYYY-MM-DD HH:mm:ss"
        ).valueOf();
      } catch (error) {}
    },
    convert(_date) {
      var date = new Date(_date);
      return date.toLocaleDateString();
    },
    convert_unix(unixtimestamp) {
      const date = new Date(Math.floor(unixtimestamp));
      return date.toLocaleDateString();
    },
    OnResetModal() {
      this.RespText = "";
      this.success = "";
      //
      this.doc.id = null;
      this.doc.title = null;
      this.doc.index = null;
      this.doc.item = {};
      //
      this.prop.title = null;
      this.prop.subject = null;
      this.prop.creator = null;
      this.prop.keywords = null;
      this.prop.lastModifiedBy = null;
      this.prop.revision = null;
      this.prop.createdAt = null;
      this.prop.updatedAt = null;
      //
    },
    async OnClickDelete(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!(this.doc.id != null && this.doc.id >= 0)) {
        this.RespText = "Ошибка! Неверный ID";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        await this.$store.dispatch("DeleteDocFromList", {
          index: this.doc.index,
          id: this.doc.id,
          typeState: "advanced"
        });
        if (this.DataSearch.data == null || this.DataSearch.data == "") {
          await this.DocList(this.PageNum);
        } else {
          if (this.IsSearch) await this.GetSearch(this.PageNum);
          else await this.DocList(this.PageNum);
        }
        this.doc.title = "";
        this.doc.id = -1;
        this.doc.index = -1;
        this.$nextTick(() => {
          this.$refs.modal_delete.hide();
        });
      } catch (error) {
        this.RespText = "Ошибка при удалении документа!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    async OnClickProparty(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (!(this.prop != null)) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        const res = await api.ChangePropDocument(this.prop);
        this.RespText = "Вы успешно обновили свойства документа!";
        this.success = "alert-success";
      } catch (error) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
      }
      this.IsLoading = false;
    },
    async OnClickParametres(bvModalEvt) {
      bvModalEvt.preventDefault();
      if (
        !(this.doc.item != null) &&
        !(this.doc.item.title != "") &&
        !(this.doc.item.categoryId > -1)
      ) {
        this.RespText = "Ошибка!";
        this.success = "alert-danger";
        return;
      }
      this.IsLoading = true;
      try {
        this.doc.item.date = mnt(this.doc.item.date).format("YYYY-MM-DD");
        const res = await api.ChangeParamDocument(this.doc.item, this.deleteChilds, null);
        this.RespText = "Вы успешно обновили параметры документа!";
        this.success = "alert-success";
      } catch (error) {
        this.RespText = "Неизвестная ошибка!";
        this.success = "alert-danger";
        console.log(error);
      }
      this.IsLoading = false;
    },
    ShowMWDelete(_title, _id, _index) {
      this.doc.title = _title;
      this.doc.id = _id;
      this.doc.index = _index;
      this.$bvModal.show("modal-prevent-delete");
    },
    ShowMWProp() {
      this.GetProps(this.doc.id);
      this.$bvModal.show("modal-prevent-proparty");
      this.$nextTick(() => {
        this.$refs.modal_choose.hide();
      });
    },
    ShowMWParam() {
      this.$bvModal.show("modal-prevent-parametres");
      this.$nextTick(() => {
        this.$refs.modal_choose.hide();
      });
    },
    ShowMWChoose(_title, _id, _index) {
      this.doc.title = _title;
      this.doc.id = _id;
      this.doc.index = _index;
      this.doc.item = this.GetDocumentList.items[_index];
      this.doc.item.date = mnt(this.doc.item.date).format("YYYY-MM-DD");
      this.$bvModal.show("modal-choose");
    },
    async DocList(_page) {
      if (this.IsSearch === false) {
        this.IsLoadingItems = true;
        try {
          const res = await this.$store.dispatch("SetDocuments", {
            page: _page - 1,
            search: false,
            typeState: "advanced"
          });
        } catch (error) {}
        this.IsLoadingItems = false;
      } else {
        await this.GetSearch(_page);
      }
    }
  },
  computed: {
    GetDocumentList() {
      return this.$store.getters.GetDocAdvancedList;
    },
    GetDocCategory() {
      return this.$store.getters.GetDocCategory;
    }
  },
  beforeMount() {
    this.$store.dispatch("SetDocumentCategories");
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
}

.Animation_SwitchAdvanceSearch-leave-active {
  transition: all 0.4s ease;
}

.Animation_SwitchAdvanceSearch-enter,
.Animation_SwitchAdvanceSearch-leave-to {
  opacity: 0;
}

.Animation_SwitchSimpleSearch-enter-active {
  transition: all 0.6s ease;
}

.Animation_SwitchSimpleSearch-leave-active {
  transition: all 0.4s ease;
}

.Animation_SwitchSimpleSearch-enter,
.Animation_SwitchSimpleSearch-leave-to {
  opacity: 0;
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

.table_blur button {
  margin: 3px;
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

/* SwitchToggle */

.SwicthTG {
  margin-top: 20px;
}
</style>
