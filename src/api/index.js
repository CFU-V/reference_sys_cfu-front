import axios from "axios";

const base_url = "http://127.0.0.1:7777/";

const axiosInstance = axios.create({
  baseURL: base_url,
  headers: {
    "access-control-allow-origin": "*",
    "Accept-Language": "ru,en-US;q=0.9,en;q=0.8",
    "Content-Type": "application/json"
  }
});

/**
 * TODO Не сделал
 * ? Не протестировал
 * !Список API запросов
 * !--------------[ User ]--------------------
 * * GetUsers() Получить список пользователей
 * * GetUserInfo() Получить информацию о пользователе
 * * DeleteUser() Удалить пользователя
 * * ChangeUser() Редактировать пользователя
 * * ComparePassword() Проверить правильность пароля(current)
 * * UpdateMyUserInfo() Обновить информацию о себе
 * * getMyUserInfo() Получить информацию о себе
 * !--------------[ Auth ]--------------------
 * * SetLogin() Авторизация
 * * CreateUser() Добавить пользователя
 * !--------------[ Document ]----------------
 * * AddDocument() Добавить документ
 * * ChangeParamDocument() Редактировать параметры документа
 * * ChangePropDocument() Редактировать свойства документа
 * * DeleteDocument() Удалить документ
 * * GetDocument() Получить документ
 * * GetDocumentList() Получить список документов
 * * GetProperty() Получить свойства документа
 * * ShareDocument() Поделиться документом
 * * GetNewsDocument() Получить документы (created|updated) за 7 дней
 * !--------------[ BookMarks ]---------------
 * * AddBookMark() Добавить закладку
 * * ChangeBookMark() Редактировать закладку
 * * GetBookMark() Получить список закладок
 * * DeleteBookMark() Удалить закладку
 * !--------------[ Messages ]----------------
 * !--------------[ Logs ]--------------------
 * * GetLogList() Получить список (файлов) логов
 * * GetContentFileLog() Скачать лог-файл
 * !--------------[ DB ]----------------------
 * !--------------[ Search ]------------------
 * * GetSearch() Быстрый поиск
 * * GetSearchByFiled() Расширенный поиск
 * * GetSearchUser() Поиск пользователей
 */

export async function Default() {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "",
      url: "",
      data: {},
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/Default] - ${error}`);
    throw error;
  }
}

// ------------------------------[ User ]-----------------------------------
/**
 * Получить список пользователей
 * @async
 * @returns {{birthDate: string,email: string,firstName: string,id: number,
 * lastName: string,login: string,phone: string,position: string,role: string,surName: string}[]}
 * Возвращает массив пользователей
 * @version 0.0.0.1
 */
export async function GetUsers(_page) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "user",
      params: {
        pageSize: "20",
        page: _page,
        id: "0"
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetUsers] - ${error}`);
    throw error;
  }
}

/**
 * Получить информацию о пользователе
 * @async
 * @returns {{birthDate: string,email: string,firstName: string,id: number,
 * lastName: string,login: string,phone: string,position: string,role: string,surName: string}}
 * @version 0.0.0.1
 */
export async function GetUserInfo(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "user",
      params: {
        pageSize: 0,
        page: 0,
        id: _id
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetUserInfo] - ${error}`);
    throw error;
  }
}

/**
 * Удалить пользователя
 * @async
 * @version 0.0.0.1
 */
export async function DeleteUser(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "DELETE",
      url: "user",
      params: {
        userId: _id
      },
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/DeleteUser] - ${error}`);
    throw error;
  }
}

/**
 * Редактировать пользователя
 * @async
 * @version 0.0.0.1
 */
export async function ChangeUser(_id, _password, _roleId, _phone, _lastName, _firstName, _surName, _position) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    let form = {
      id: _id,
      roleId: _roleId,
      phone: _phone,
      lastName: _lastName,
      firstName: _firstName,
      surName: _surName,
      position: _position
    };

    if (_password.length > 7) form.password = _password;
    //-------------------
    const response = await axiosInstance({
      method: "PUT",
      url: "user",
      data: form,
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/ChangeUser] - ${error}`);
    throw error;
  }
}

/**
 * Проверить правильность пароля (current)
 * @async
 * @version 0.0.0.1
 */
export async function ComparePassword(_password) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "user/comparePassword",
      data: {
        password: _password
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/ComparePassword] - ${error}`);
    throw error;
  }
}

/**
 * Обновить информацию о себе
 * @async
 * @param {string} pass Пароль
 * @param {string} lname Фамилия
 * @param {string} fname Имя
 * @param {string} sname Отчество
 * @param {string} ph Телефон
 * @param {string} pos Должность
 * @version 0.0.0.1
 */
export async function UpdateMyUserInfo(pass, lname, fname, sname, ph, pos) {
  try {

    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    let form = {
      lastName: lname,
      firstName: fname,
      surName: sname,
      phone: ph,
      position: pos
    };

    if (pass.length > 7) form.password = pass;
    //-------------------
    const response = await axiosInstance({
      method: "PUT",
      url: "user/me",
      data: form,
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/UpdateMyUserInfo] - ${error}`);
    // throw new TypeError(error);
    throw error;
  }
}

/**
 * Получить информацию о себе
 * @async
 * @return {{birthDate: string,email: string,firstName: string,id: number,
 * lastName: string,login: string,phone: string,position: string,role: string,surName: string}}
 * Возвращает информацию о пользователе
 * @version 0.0.0.1
 */
export async function getMyUserInfo() {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "user/me",
      headers: auth
    });
    //-------------------
    return response.data.items[0];
  } catch (error) {
    console.log(`[API/getMyUserInfo] - ${error}`);
    // throw new TypeError(error);
    throw error;
  }
}

// ------------------------------[ Auth ]-----------------------------------

/**
 * Авторизация
 * @async
 * @param {string} _login Логин пользователя
 * @param {string} _pass Пароль пользователя
 * @return {{token: string, user: {}}}
 * Возвращает информацию о пользователе и токен
 * @version 0.0.0.1
 */
export async function SetLogin(_login, _pass) {
  try {
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "auth/login",
      data: {
        login: _login,
        password: _pass
      }
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/SetLogin] - ${error}`);
    // throw new TypeError(error);
    throw error;
  }
}

/**
 * Добавить (создать) пользователя
 * @async
 * @version 0.0.0.1
 */
export async function CreateUser(_login, _password, _roleId, _lastName, _firstName, _surName, _email, _birthDate, _position, _phone) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "auth/registration",
      data: {
        login: _login,
        password: _password,
        roleId: _roleId,
        lastName: _lastName,
        firstName: _firstName,
        surName: _surName,
        email: _email,
        birthDate: _birthDate,
        position: _position,
        phone: _phone
      },
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/CreateUser] - ${error}`);
    throw error;
  }
}

// ------------------------------[ Document ]-----------------------------------

/**
 * Добавить документ
 * @async
 * @version 0.0.0.1
 */
export async function AddDocument(_title, _parentId, _info, _number, _categoryId, _active, _visibility, _consultant_link, _renew, _file) {
  try {
    const formData = new FormData();
    formData.append("title", _title);
    if (_parentId != null) formData.append("parentId", _parentId);
    formData.append("info", _info);
    formData.append("number", _number);
    formData.append("categoryId", _categoryId);
    formData.append("active", _active);
    formData.append("visibility", _visibility);
    formData.append("consultant_link", _consultant_link);
    formData.append("renew", _renew);
    formData.append("file", _file);
    //-------------------
    const response = await axios.post(base_url + "document", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/AddDocument] - ${error}`);
    throw error;
  }
}

/**
 * Редактировать параметры документа
 * @async
 * @version 0.0.0.1
 */
export async function ChangeParamDocument(_data, _deleteChilds, _file) {
  try {
    const formData = new FormData();
    formData.append("id", _data.id);
    formData.append("title", _data.title);
    if (_data.parentId != null) formData.append("parentId", _data.parentId);
    formData.append("info", _data.info);
    formData.append("categoryId", _data.categoryId);
    formData.append("number", _data.number);
    formData.append("active", _data.active);
    formData.append("visibility", _data.visibility);
    formData.append("renew", _data.renew);
    formData.append("deleteChilds", _deleteChilds);
    //formData.append("old_version", null);
    //formData.append("consultant_link", null);
    if(_file != null) formData.append("file", _file);
    //-------------------
    const response = await axios.put(base_url + "document", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/ChangeParamDocument] - ${error}`);
    throw error;
  }
}

/**
 * Редактировать свойства документа
 * @async
 * @version 0.0.0.1
 */
export async function ChangePropDocument(_data) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "document/props",
      data: _data,
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/ChangePropDocument] - ${error}`);
    throw error;
  }
}


/**
 * Удалить документ
 * @async
 * @param {number} _id
 * @version 0.0.0.1
 */
export async function DeleteDocument(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "DELETE",
      url: "document",
      params: {
        id: _id
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/DeleteDocument] - ${error}`);
    throw error;
  }
}

/**
 * Получить документ
 * @async
 * @version 0.0.0.1
 * @param {number} _id Ид документа
 */
export async function GetDocument(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document",
      params: {
        id: _id
      },
      headers: auth
	});
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetDocument] - ${error}`);
    throw error;
  }
}

/**
 * Получить список документов
 * @async
 * @version 0.0.0.1
 * @param {number} _page Номер страницы
 * @return {{items:
 * {id: number,title: string,info: string,categoryId: number,active: boolean,visibility: boolean,link: string,
 * consultant_link: null,renew: boolean,createdAt: string,updatedAt: string,ownerId: number,parentId: null}[],
 * total:number, page: number, pageSize: number, pages: number}}
 */
export async function GetDocumentList(_page, _autocmpl, _s) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    let form = {
      pageSize: 20,
      page: _page,
    };

    if (_autocmpl != null && _autocmpl == true) {
      form.autocomplete = true;
      form.s = _s;
    }
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document/list",
      params: form,
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetDocumentList] - ${error}`);
    throw error;
  }
}

/**
 * Получить документ
 * @async
 * @version 0.0.0.1
 * @param {number} _id Ид документа
 * @returns {{}}
 */
export async function GetProperty(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document/props",
      params: {
        id: _id
      },
      headers: auth
	});
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetProperty] - ${error}`);
    throw error;
  }
}

/**
 * Поделиться документом
 * @async
 * @version 0.0.0.1
 * @param {number} _documentId ид документа
 * @param {string} _recipientMail кому
 * @param {string} _message сообщение
 */
export async function ShareDocument(_documentId, _recipientMail, _message) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "document/share",
      data: {
        documentId: _documentId,
        recipientMail: _recipientMail,
        message: _message
      },
      headers: auth
	});
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/ShareDocument] - ${error}`);
    throw error;
  }
}

/**
 * Получить документы (created|updated) за 7 дней
 * @async
 * @version 0.0.0.1
 */
export async function GetNewsDocument() {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document/news",
      data: {},
      headers: auth
	});
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetNewsDocument] - ${error}`);
    throw error;
  }
}
// ------------------------------[ Bookmarks ]-----------------------------------

/**
 * Добавить закладку документа
 * @async
 * @version 0.0.0.1
 */
export async function AddBookMark(_docId, _control) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "bookmarks",
      data: {
        docId: _docId,
        control: _control
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/AddBookMark] - ${error}`);
    throw error;
  }
}

/**
 * Редактировать закладку документа
 * @async
 * @version 0.0.0.1
 */
export async function ChangeBookMark(_docId, _control) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "PUT",
      url: "bookmarks",
      data: {
        docId: _docId,
        control: _control
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/ChangeBookMark] - ${error}`);
    throw error;
  }
}

/**
 * Получить список закладок
 * @async
 * @return {{list:{control: boolean,docId: number, document: {}, id: number, userId: number}[], page: number, pageSize:number, pages: number, total: number}}
 * @version 0.0.0.1
 */
export async function GetBookMark(_page) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "bookmarks",
      params: {
        pageSize: "20",
        page: _page
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetBookMark] - ${error}`);
    throw error;
  }
}

/**
 * Удалить закладку
 * @async
 * @version 0.0.0.1
 */
export async function DeleteBookMark(_docId) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "DELETE",
      url: "bookmarks",
      params: {
        docId: _docId,
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/DeleteBookMark] - ${error}`);
    throw error;
  }
}

// ------------------------------[ Logs ]-----------------------------------

/**
 * Получить список (файлов) логов
 * @async
 * @version 0.0.0.1
 */
export async function GetLogList() {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "logs/list",
      params: {},
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetLogList] - ${error}`);
    throw error;
  }
}

/**
 * Скачать лог-файл
 * @async
 * @param {string} _filename Наименование лог-файла
 * @version 0.0.0.1
 */
export async function GetContentFileLog(_filename) {
  try {
    if(!(_filename.length > 0)) {
      throw 'Unknown File name'
    }
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: `logs/download/${_filename}`,
      params: {
        fileName: _filename
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetContentFileLog] - ${error}`);
    throw error;
  }
}

// ------------------------------[ Search ]-----------------------------------

/**
 * Быстрый поиск
 * @async
 * @param {string} _content Область поиска
 * @param {number} _from Пагинация
 * @param {number} _to Пагинация
 * @param {boolean} _visibility Авторизован или нет
 * @param {string} _search Строка поиска
 * @version 0.0.0.1
 */
export async function GetSearch(_content, _from, _to, _visibility, _search) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "search",
      params: {
        content: _content,
        from: _from,
        to: _to,
        visibility: _visibility,
        search: _search
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetSearch] - ${error}`);
    throw error;
  }
}

/**
 * Расширенный поиск
 * @async
 * @param {string} _content Область поиска
 * @param {number} _from Пагинация
 * @param {number} _to Пагинация
 * @param {[{query: string,field:string},{creategAt: number}]} _search Массив объектов (выборка)
 * @version 0.0.0.1
 */
export async function GetSearchByFiled(_content, _from, _to, _search) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "search",
      data: {
        content: _content,
        from: _from,
        to: _to,
        fieldsQuery: _search
      },
      headers: auth
    });
    //-------------------
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(`[API/GetSearchByFiled] - ${error}`);
    throw error;
  }
}

/**
 * Поиск пользователей
 * @async
 * @param {number} _page
 * @param {string} _fio
 * @param {number} _roleId
 * @returns {{total:number,page:number,pageSize:number,pages:number,
 * items: {id:number,login:string,lastName:string,firstName:string,surName:string,phone:string,email:string,position:string,birthDate:string,role:string}[]}}
 * @version 0.0.0.1
 */
export async function GetSearchUser(_page, _fio, _roleId) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    _roleId = (_roleId == 0 ? -1 : _roleId);
    _page = (_page < 0 ? 0 : _page);
    let form = {
      pageSize: 20,
      page: _page,
    };
    if (_roleId > -1) form.roleId = _roleId;
    if (_fio.length > 0) form.s = _fio;
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "user/find",
      params: form,
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetSearchUser] - ${error}`);
    throw error;
  }
}
