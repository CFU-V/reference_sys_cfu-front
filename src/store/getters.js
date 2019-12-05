// !--------------[ User ]---------------
// * GetUsers Получить список пользователей (массив данных
// * GetUser Получить юзер данные (свои)
// !--------------[ The names of month/weeks ]---------------
// * GetmonthNames Получить массив (наименование) месяцев
// * GetWeekNames Получить массив (наименование) дней недели
// !--------------[ BookMarks ]---------------
// * GetBookMarks Получить список закладок
// !--------------[ Document ]---------------
// * GetDocSimpleList() Get doc simple list
// * GetDocAdvancedList() Get doc advanced list
// * GetDocSearchList() Get doc search list
// * GetDocCategory Получить массив категорий документа (наименование)
// !--------------[ Search ]---------------
// * GetSearchResult Получить результат поиска (массив)
// !--------------[ Other ]---------------
// !--------------[ Logs ]---------------
// * GetLogs Получить Logs (массив)
// !--------------[ Message ]---------------
// !--------------[ Notifications ]---------------
// * GetCountAlert Получить кол-во непрочитанных сообщений




// !--------------[ User ]---------------

/**
 * Получить список пользователей (массив данных)
 * @param {*} state
 * @returns {{users: [], total: number,page: number,pageSize: number,pages: number}} Массив пользователей
 */
export const GetUsers = state => {
  return state.GetUsers_data;
};

/**
 * Получить юзер данные (свои)
 * @param {*} state
 * @returns {{users: [], total: number,page: number,pageSize: number,pages: number}} Массив пользователей
 */
export const GetUser = state => {
  return state.GetUser_data;
};

// !--------------[ The names of month/weeks ]---------------

/**
 * Получить массив (наименование) месяцев
 * @param {*} state
 */
export const GetmonthNames = state => {
  return state.monthNames;
};

/**
 * Получить массив (наименование) дней недели
 * @param {*} state
 */
export const GetWeekNames = state => {
  return state.WeekNames;
};

// !--------------[ BookMarks ]---------------

/**
 * Получить список закладок
 * @param {*} state
 */
export const GetBookMarks = state => {
  return state.BookMarks;
};

// !--------------[ Document ]---------------

/**
 * Get doc simple list
 * @param {*} state
 */
export const GetDocSimpleList = state => {
  return state.TheDocSimpleList;
};

/**
 * Get doc advanced list
 * @param {*} state
 */
export const GetDocAdvancedList = state => {
  return state.TheDocAdvancedList;
};

/**
 * Get doc search list
 * @param {*} state
 */
export const GetDocSearchList = state => {
  return state.TheDocSearchList;
};

/**
 * Получить массив категорий документа (наименование)
 * @param {*} state
 */
export const GetDocCategory = state => {
  return state.GetCategoryOfDoc;
};

// !--------------[ Search ]---------------

/**
 * Получить результат поиска (массив)
 * @param {[{_index: string,_type: string,_id: number,_score: number,_source: {id: string,title: string,info: string,text: string,category: string,visibility: boolean,createdAt: number}}]} state
 */
export const GetSearchResult = state => {
  return state.ResultOfSearch_main;
};

// !--------------[ Other ]---------------


// !--------------[ Logs ]---------------

/**
 * Получить Logs
 */
export const GetLogs = state => {
  return state.Logs;
};

// !--------------[ Message ]---------------

// !--------------[ Notifications ]---------------
/**
 * Получить Count Of Alerts
 */
export const GetCountAlert = state => {
  return state.CountOfAlert;
};
