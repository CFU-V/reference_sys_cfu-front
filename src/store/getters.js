// !--------------[ User ]---------------
// * GetUsers Получить список пользователей (массив данных
// * GetUser Получить юзер данные (свои)
// !--------------[ The names of month/weeks ]---------------
// * GetmonthNames Получить массив (наименование) месяцев
// * GetWeekNames Получить массив (наименование) дней недели
// !--------------[ BookMarks ]---------------
// * GetBookMarks Получить список закладок
// !--------------[ Document ]---------------
// * GetDocList Получить список документов
// * GetDocCategory Получить массив категорий документа (наименование)
// !--------------[ Search ]---------------
// * GetSearchResult Получить результат поиска (массив)
// !--------------[ Other ]---------------
// * GetBaseURL Получить base url
// * GetApiURL Получить api url
// !--------------[ Logs ]---------------
// * GetLogs Получить Logs (массив)


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
 * Получить список документов
 * @param {*} state
 */
export const GetDocList = state => {
  return state.DocList;
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

/**
 * Получить base url
 */
export const GetBaseURL = state => {
  return state.sate_baseURL;
};

/**
 * Получить api url
 */
export const GetApiURL = state => {
  return state.sate_apiURL;
};

// !--------------[ Logs ]---------------

/**
 * Получить Logs
 */
export const GetLogs = state => {
  return state.Logs;
};
