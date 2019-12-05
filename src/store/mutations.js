// !--------------[ User ]---------------
// * UserList Добавить список пользователей
// * UserListClear Очистить список пользователей
// * UserListDeleteANUser Удалить пользователя (информацию) из списка пользователей
// * UserInfo Добавить информацию о пользователе в хранилище
// * UserInfoClear Очистить информацию пользователе
// * ChangeUserInfo_m Изменить информацию о пользователе в общем списке
// !--------------[ BookMarks ]---------------
// * SetBookMarksList Заполнить список закладок
// * ClearBookMarksList Очистить список закладок
// * DeleteBookMarkItem Удалить закладку из списка
// * UpdateBookMark Обновить закладку
// !--------------[ Document ]---------------
// * SetDocList Заполнить список закладок
// * ClearDocList Очистить список документов
// * DeleteDocListItem Удалить документ из списка
// * MSetDocumentCategories Заполнить список категорий
// !--------------[ Search ]---------------
// * SetSearchResult Заполнить результат поиска
// * ClearSearchResult Очистить результат поиска
// * DeleteSearchResult Удалить элемент из списка (результат поиска)
// !--------------[ Logs ]---------------
// * SetLogsResult Заполнить результат Logs
// * ClearLogsResult Очистить результат Logs
// * DeleteLogsResult Удалить элемент из списка (Logs)
// !--------------[ Message ]---------------
// !--------------[ Notifications ]---------------
// * SetCountOfAlerts Заполнить перменную кол-во непрочитанных сообщений
// * ClearCountOfAlerts Очистить перменную
// * ChangeCountOfAlert Изменить кол-во непрочитанных сообщений



// !--------------[ User ]---------------

/**
 * Добавить список пользователей
 * @param {*} state
 * @param {*} data Массив пользователей
 */
export const UserList = (state, data) => {
  state.GetUsers_data.user = data.items;
  state.GetUsers_data.total = data.total;
  state.GetUsers_data.page = data.page;
  state.GetUsers_data.pageSize = data.pageSize;
  state.GetUsers_data.pages = data.pages;
};

/**
 * Очистить список пользователей
 * @param {*} state
 */
export const UserListClear = state => {
  state.GetUsers_data.user = [];
  state.GetUsers_data.total = 0;
  state.GetUsers_data.page = 0;
  state.GetUsers_data.pageSize = "0";
  state.GetUsers_data.pages = 0;
};

/**
 * Удалить пользователя (информацию) из списка пользователей
 * @param {*} state
 */
export const UserListDeleteANUser = (state, index) => {
  state.GetUsers_data.user.splice(index, 1);
  state.GetUsers_data.total -= 1;
};

/**
 * Добавить информацию о пользователе в хранилище
 * @param {*} state
 * @param {*} data Информацию о пользователе пользователей
 */
export const UserInfo = (state, data) => {
  state.GetUser_data.user = data.items;
  state.GetUser_data.total = data.total;
  state.GetUser_data.page = data.page;
  state.GetUser_data.pageSize = data.pageSize;
  state.GetUser_data.pages = data.pages;
};

/**
 * Очистить информацию пользователе
 * @param {*} state
 */
export const UserInfoClear = state => {
  state.GetUser_data.user = [];
  state.GetUser_data.total = 0;
  state.GetUser_data.page = 0;
  state.GetUser_data.pageSize = "0";
  state.GetUser_data.pages = 0;
};

/**
 * Изменить информацию о пользователе в общем списке
 * @param {*} state
 */
export const ChangeUserInfo_m = (state, payload) => {
  try {
    let buff = "";
    if (payload.user.roleId == 1) buff = "admin";
    else if (payload.user.roleId == 2) buff = "manager";
    else buff = "common";
    //
    state.GetUsers_data.user[payload.index].login = payload.user.login;
    state.GetUsers_data.user[payload.index].phone = payload.user.phone;
    state.GetUsers_data.user[payload.index].lastName = payload.user.lastName;
    state.GetUsers_data.user[payload.index].firstName = payload.user.firstName;
    state.GetUsers_data.user[payload.index].surName = payload.user.surName;
    state.GetUsers_data.user[payload.index].position = payload.user.position;
    state.GetUsers_data.user[payload.index].role = buff;
    //
    state.GetUser_data.user[0].login = payload.user.login;
    state.GetUser_data.user[0].phone = payload.user.phone;
    state.GetUser_data.user[0].lastName = payload.user.lastName;
    state.GetUser_data.user[0].firstName = payload.user.firstName;
    state.GetUser_data.user[0].surName = payload.user.surName;
    state.GetUser_data.user[0].position = payload.user.position;
    state.GetUser_data.user[0].role = buff;
  } catch (error) {
    console.log(`[Mutation/ChangeUserInfo_m] - ${error}`);
    throw error;
  }
};

// !--------------[ BookMarks ]---------------

/**
 * Заполнить список закладок
 * @param {*} state
 */
export const SetBookMarksList = (state, payload) => {
  try {
    state.BookMarks.list = payload.items;
    state.BookMarks.total = payload.total;
    state.BookMarks.page = payload.page;
    state.BookMarks.pageSize = payload.pageSize;
    state.BookMarks.pages = payload.pages;
  } catch (error) {
    console.log(`[Mutation/SetBookMarksList] - ${error}`);
    throw error;
  }
};

/**
 * Очистить список закладок
 * @param {*} state
 */
export const ClearBookMarksList = (state) => {
  try {
    state.BookMarks.list = [];
    state.BookMarks.total = "";
    state.BookMarks.page = "";
    state.BookMarks.pageSize = "";
    state.BookMarks.pages = "";
  } catch (error) {
    console.log(`[Mutation/ClearBookMarksList] - ${error}`);
    throw error;
  }
};

/**
 * Удалить закладку из списка
 * @param {*} state
 */
export const DeleteBookMarkItem = (state, index) => {
  try {
    state.BookMarks.list.splice(index, 1);
    state.BookMarks.total -= 1;
  } catch (error) {
    console.log(`[Mutation/DeleteBookMarkItem] - ${error}`);
    throw error;
  }
};

/**
 * Обновить закладку
 * @param {*} state
 */
export const UpdateBookMark = (state, payload) => {
  try {
    state.BookMarks.list[payload.index].control = payload.control;
  } catch (error) {
    console.log(`[Mutation/UpdateBookMark] - ${error}`);
    throw error;
  }
};

// !--------------[ Document ]---------------

/**
 * Заполнить список закладок
 * @param {*} state
 */
export const SetDocList = (state, payload) => {
  try {
    if (payload.typeState.toLowerCase().trim() === 'simple') {
      state.TheDocSimpleList.items = payload.items;
      state.TheDocSimpleList.total = payload.total;
      state.TheDocSimpleList.page = payload.page;
      state.TheDocSimpleList.pageSize = payload.pageSize;
      state.TheDocSimpleList.pages = payload.pages;
    } else if (payload.typeState.toLowerCase().trim() === 'advanced') {
      state.TheDocAdvancedList.items = payload.items;
      state.TheDocAdvancedList.total = payload.total;
      state.TheDocAdvancedList.page = payload.page;
      state.TheDocAdvancedList.pageSize = payload.pageSize;
      state.TheDocAdvancedList.pages = payload.pages;
    } else if (payload.typeState.toLowerCase().trim() === 'search') {
      state.TheDocSearchList.items = payload.items;
      state.TheDocSearchList.total = payload.total;
      state.TheDocSearchList.page = payload.page;
      state.TheDocSearchList.pageSize = payload.pageSize;
      state.TheDocSearchList.pages = payload.pages;
    } else {
      console.log(`[Mutation/SetDocList] - Unknown type state`);
      throw 'Unknown type state';
    }
  } catch (error) {
    console.log(`[Mutation/SetDocList] - ${error}`);
    throw error;
  }
};

/**
 * Очистить список документов
 * @param {*} state
 */
export const ClearDocList = (state, payload) => {
  try {
    if (payload.typeState.toLowerCase().trim() === 'simple') {
      state.TheDocSimpleList.items = [];
      state.TheDocSimpleList.total = 0;
      state.TheDocSimpleList.page = 0;
      state.TheDocSimpleList.pageSize = 0;
      state.TheDocSimpleList.pages = 0;
    } else if (payload.typeState.toLowerCase().trim() === 'advanced') {
      state.TheDocAdvancedList.items = [];
      state.TheDocAdvancedList.total = 0;
      state.TheDocAdvancedList.page = 0;
      state.TheDocAdvancedList.pageSize = 0;
      state.TheDocAdvancedList.pages = 0;
    } else if (payload.typeState.toLowerCase().trim() === 'search') {
      state.TheDocSearchList.items = [];
      state.TheDocSearchList.total = 0;
      state.TheDocSearchList.page = 0;
      state.TheDocSearchList.pageSize = 0;
      state.TheDocSearchList.pages = 0;
    } else {
      console.log(`[Mutation/SetDocList] - Unknown type state`);
      throw 'Unknown type state';
    }
  } catch (error) {
    console.log(`[Mutation/ClearDocList] - ${error}`);
    throw error;
  }
};

/**
 * Удалить документ из списка
 * @param {*} state
 */
export const DeleteDocListItem = (state, payload) => {
  try {
    if (payload.typeState.toLowerCase().trim() === 'simple') {
      state.TheDocSimpleList.items.splice(payload.index, 1);
      state.TheDocSimpleList.total -= 1;
      if(state.TheDocSimpleList.total < 0) state.TheDocSimpleList.total = 0;
    } else if (payload.typeState.toLowerCase().trim() === 'advanced') {
      state.TheDocAdvancedList.items.splice(payload.index, 1);
      state.TheDocAdvancedList.total -= 1;
      if(state.TheDocAdvancedList.total < 0) state.TheDocSimpleList.total = 0;
    } else if (payload.typeState.toLowerCase().trim() === 'search') {
      state.TheDocSearchList.items.splice(payload.index, 1);
      state.TheDocSearchList.total -= 1;
      if(state.TheDocSearchList.total < 0) state.TheDocSimpleList.total = 0;
    } else {
      console.log(`[Mutation/SetDocList] - Unknown type state`);
      throw 'Unknown type state';
    }
  } catch (error) {
    console.log(`[Mutation/DeleteDocListItem] - ${error}`);
    throw error;
  }
};

/**
 * Заполнить список категорий
 * @param {*} state
 */
export const MSetDocumentCategories = (state, _res) => {
  try {
    state.GetCategoryOfDoc = [];
    _res.forEach(element => {
      state.GetCategoryOfDoc.push(element.title);
    });
  } catch (error) {
    console.log(`[Mutation/MSetDocumentCategories] - ${error}`);
    throw error;
  }
};

// !--------------[ Search ]---------------

/**
 * Заполнить результат поиска
 * @param {*} state
 */
export const SetSearchResult = (state, payload) => {
  try {
    state.ResultOfSearch_main = payload;
  } catch (error) {
    console.log(`[Mutation/SetResultSearch] - ${error}`);
    throw error;
  }
};

/**
 * Очистить результат поиска
 * @param {*} state
 */
export const ClearSearchResult = (state) => {
  try {
    state.ResultOfSearch_main = [];
  } catch (error) {
    console.log(`[Mutation/ClearSearchResult] - ${error}`);
    throw error;
  }
};

/**
 * Удалить элемент из списка (результат поиска)
 * @param {*} state
 */
export const DeleteSearchResult = (state, index) => {
  try {
    state.ResultOfSearch_main.splice(index, 1);
  } catch (error) {
    console.log(`[Mutation/DeleteSearchResult] - ${error}`);
    throw error;
  }
};

// !--------------[ Logs ]---------------

/**
 * Заполнить результат Logs
 * @param {*} state
 */
export const SetLogsResult = (state, payload) => {
  try {
    state.Logs = payload;
  } catch (error) {
    console.log(`[Mutation/SetLogsResult] - ${error}`);
    throw error;
  }
};

/**
 * Очистить результат Logs
 * @param {*} state
 */
export const ClearLogsResult = (state) => {
  try {
    state.Logs = [];
  } catch (error) {
    console.log(`[Mutation/ClearLogsResult] - ${error}`);
    throw error;
  }
};

/**
 * Удалить элемент из списка (Logs)
 * @param {*} state
 */
export const DeleteLogsResult = (state, index) => {
  try {
    state.Logs.splice(index, 1);
  } catch (error) {
    console.log(`[Mutation/DeleteLogsResult] - ${error}`);
    throw error;
  }
};

// !--------------[ Message ]---------------

// !--------------[ Notifications ]---------------
/**
 * Заполнить перменную кол-во непрочитанных сообщений
 * @param {*} state
 */
export const SetCountOfAlerts = (state, payload) => {
  try {
    state.CountOfAlert = payload;
  } catch (error) {
    console.log(`[Mutation/SetCountOfAlerts] - ${error}`);
    throw error;
  }
};

/**
 * Очистить перменную
 * @param {*} state
 */
export const ClearCountOfAlerts = (state) => {
  try {
    state.CountOfAlert = 0;
  } catch (error) {
    console.log(`[Mutation/ClearCountOfAlerts] - ${error}`);
    throw error;
  }
};

/**
 * Изменить кол-во непрочитанных сообщений
 * @param {*} state
 */
export const ChangeCountOfAlert = (state, number) => {
  try {
    state.CountOfAlert = number;
    if (state.CountOfAlert < 0) state.CountOfAlert = 0;
  } catch (error) {
    console.log(`[Mutation/ChangeCountOfAlert] - ${error}`);
    throw error;
  }
};
