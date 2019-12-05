import * as api from "../api";

// !--------------[ User ]---------------
// * GetUsers() Добавить пользователей в хранилище
// * DeleteUserFromList() Удалить пользователя в хранилище
// * GetUser() Получить информацию о пользователе
// * ChangeUserInfo() Изменить информацию о пользователе в общем списке
// !--------------[ BookMarks ]---------------
// * SetBookMarks() Получить список закладок и заполнить хранилище
// * UpdateBookMarks() Обновить закладку
// * DeleteBookMarkFromList() Удалить закладку в хранилище
// !--------------[ Document ]---------------
// * SetDocuments() Получить список документов и заполнить хранилище
// * DeleteDocFromList() Удалить документ в хранилище
// * SetDocumentCategories() Составить список категорий документа
// !--------------[ Search ]---------------
// * SetSearchList() Выполнить поиск
// * DeleteSearchList() Удалить документ в хранилище
// !--------------[ Logs ]---------------
// * GetListLogs() Получить список логов
// !--------------[ Others ]---------------
// !--------------[ Message ]---------------
// !--------------[ Notifications ]---------------
// * SetCountOfAlerts() Установить кол-во непрочитанных сообщений
// * ChangeCountOfAlert() Изменить кол-во непрочитанных сообщений

// !--------------[ User ]---------------

/**
 * Добавить пользователей в хранилище
 * @param {*} commit
 */
export async function GetUsers({
  commit
}, payload) {
  try {
    const res = payload.search == false ?
      await api.GetUsers(payload.page) :
      await api.GetSearchUser(payload.page, payload.dataSearch.FIO, payload.dataSearch.roleId);
    commit("UserListClear");
    commit("UserList", res);
    return res;
  } catch (error) {
    console.log(`[Action/GetUsers] - ${error}`);
    throw error;
  }
}

/**
 * Удалить пользователя в хранилище
 * @param {*} commit
 */
export async function DeleteUserFromList({
  commit
}, payload) {
  try {
    await api.DeleteUser(payload.id);
    commit("UserListDeleteANUser", payload.index);
  } catch (error) {
    console.log(`[Action/DeleteUserFromList] - ${error}`);
    throw error;
  }
}

/**
 * Получить информацию о пользователе
 * @param {*} commit
 */
export async function GetUser({
  commit
}, _id) {
  try {
    const res = await api.GetUserInfo(_id);
    commit("UserInfoClear");
    commit("UserInfo", res);
    return res;
  } catch (error) {
    console.log(`[Action/GetUser] - ${error}`);
    throw error;
  }
}

/**
 * Изменить информацию о пользователе в общем списке
 * @param {*} commit
 */
export async function ChangeUserInfo({
  commit
}, payload) {
  try {
    await api.ChangeUser(payload.user);
    commit("ChangeUserInfo_m", payload);
  } catch (error) {
    console.log(`[Action/ChangeUserInfo] - ${error}`);
    throw error;
  }
}

// !--------------[ BookMarks ]---------------

/**
 * Получить список закладок и заполнить хранилище
 * @param {*} commit
 */
export async function SetBookMarks({
  commit
}, payload) {
  try {
    const res = await api.GetBookMark(payload.page);
    commit("ClearBookMarksList");
    commit("SetBookMarksList", res);
  } catch (error) {
    console.log(`[Action/GetBookMarks] - ${error}`);
    throw error;
  }
}

/**
 * Обновить закладку
 * @param {*} commit
 */
export async function UpdateBookMarks({
  commit
}, payload) {
  try {
    await api.ChangeBookMark(payload.id, payload.control);
    commit("UpdateBookMark", payload);
  } catch (error) {
    console.log(`[Action/UpdateBookMarks] - ${error}`);
    throw error;
  }
}

/**
 * Удалить закладку в хранилище
 * @param {*} commit
 */
export async function DeleteBookMarkFromList({
  commit
}, payload) {
  try {
    await api.DeleteBookMark(payload.TheBookMarkID);
    commit("DeleteBookMarkItem", payload.index);
  } catch (error) {
    console.log(`[Action/DeleteUserFromList] - ${error}`);
    throw error;
  }
}

// !--------------[ Document ]---------------

/**
 * Получить список документов и заполнить хранилище
 * @param {*} commit
 * @param {{}} payload
 */
export async function SetDocuments({
  commit
}, payload) {
  try {
    let res = null;
    if (payload.search) {
      let res_search = null;
      if (payload.type.toLowerCase().trim() === 'simple') res_search = await api.GetSearch(payload.content, payload.page, payload.data);
      else if (payload.type.toLowerCase().trim() === 'advance') res_search = await api.GetSearchByFiled(payload.content, payload.page, payload.data);
      else {
        console.log('[Action/SetDocuments] - Неверный тип поиска!');
        throw 'Неверный тип поиска!'
      }
      res = {};

      res.total = res_search.total;
      res.page = res_search.page;
      res.pages = res_search.pages;
      res.pageSize = res_search.pageSize;
      res.items = [];
      for (let i = 0; i < res_search.items.length; i++) {
        res_search.items[i]['_source']['active'] = Boolean(res_search.items[i]['_source']['active']);
        res_search.items[i]['_source']['visibility'] = Boolean(res_search.items[i]['_source']['visibility']);
        res_search.items[i]['_source']['renew'] = Boolean(res_search.items[i]['_source']['renew']);
        res.items.push(res_search.items[i]['_source']);
      }
    } else {
      res = await api.GetDocumentList(payload.page);
    }
    if (res !== null && res !== undefined) {
      res.typeState = payload.typeState;
      commit("ClearDocList", { typeState: payload.typeState });
      commit("SetDocList", res);
    } else {
      console.log(`[Action/SetDocuments] - Ошибка! res == null || undefined`);
      throw 'Ошибка! res == null || undefined';
    }
  } catch (error) {
    console.log(`[Action/SetDocuments] - ${error}`);
    throw error;
  }
}

/**
 * Удалить документ в хранилище
 * @param {*} commit
 */
export async function DeleteDocFromList({
  commit
}, payload) {
  try {
    await api.DeleteDocument(payload.id);
    commit("DeleteDocListItem", payload);
  } catch (error) {
    console.log(`[Action/DeleteDocFromList] - ${error}`);
    throw error;
  }
}

/**
 * Составить список категорий документа
 * @param {*} commit
 */
export async function SetDocumentCategories({
  commit
}) {
  try {
    const res = await api.GetCategories();
    commit("MSetDocumentCategories", res);
  } catch (error) {
    console.log(`[Action/SetDocumentCategories] - ${error}`);
    throw error;
  }
}

// !--------------[ Search ]---------------

/**
 * Выполнить поиск
 * @param {*} commit
 */
export async function SetSearchList({
  commit
}, payload) {
  try {
    let res = null;
    if (payload.type.toLowerCase().trim() === 'simple') res = await api.GetSearch(payload.content, payload.from, payload.to, payload.visibility, payload.data);
    else if (payload.type.toLowerCase().trim() === 'advance') res = await api.GetSearchByFiled(payload.content, payload.from, payload.to, payload.data);
    else {
      console.log('[Action/SetSearchList] - Неверный тип поиска!');
      throw 'Неверный тип поиска!'
    }
    commit("ClearSearchResult");
    commit("SetSearchResult", res);
  } catch (error) {
    console.log(`[Action/SetSearchList] - ${error}`);
    throw error;
  }
}

/**
 * Удалить документ в хранилище
 * @param {*} commit
 */
export async function DeleteSearchList({
  commit
}, payload) {
  try {
    await api.DeleteDocument(payload.id);
    commit("DeleteDocListItem", payload.index);
  } catch (error) {
    console.log(`[Action/DeleteSearchList] - ${error}`);
    throw error;
  }
}

/**
 * Очистить список
 * @param {*} commit
 */
export function DeleteAllSearchList({
  commit
}) {
  try {
    commit("ClearSearchResult");
  } catch (error) {
    console.log(`[Action/DeleteAllSearchList] - ${error}`);
    throw error;
  }
}

// !--------------[ Logs ]---------------

/**
 * Получить список логов
 * @param {*} commit
 */
export async function GetListLogs({
  commit
}) {
  try {
    const res = await api.GetLogList();
    commit("ClearLogsResult");
    commit("SetLogsResult", res);
  } catch (error) {
    console.log(`[Action/GetListLogs] - ${error}`);
    throw error;
  }
}


// !--------------[ Message ]---------------
// !--------------[ Notifications ]---------------
/**
 * Установить кол-во непрочитанных сообщений
 * @param {*} commit
 */
export async function SetCountOfAlerts({
  commit
}, payload) {
  try {
    const res = await api.GetUnreadMessages();
    commit("ClearCountOfAlerts");
    commit("SetCountOfAlerts", res);
  } catch (error) {
    console.log(`[Action/SetCountOfAlerts] - ${error}`);
    throw error;
  }
}

/**
 * Изменить кол-во непрочитанных сообщений
 * @param {*} commit
 */
export function ChangeCountOfAlert({
  commit
}, payload) {
  try {
    commit("ChangeCountOfAlert", payload);
  } catch (error) {
    console.log(`[Action/ChangeCountOfAlert] - ${error}`);
    throw error;
  }
}
