import axios from "axios";

const base_url = process.env.BASE_URL_API;

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
 * * GetCategories() Получить список категорий
 * !--------------[ BookMarks ]---------------
 * * AddBookMark() Добавить закладку
 * * ChangeBookMark() Редактировать закладку
 * * GetBookMark() Получить список закладок
 * * DeleteBookMark() Удалить закладку
 * !--------------[ Messages ]----------------
 * * SendMessage() Send a message.
 * * ReadMessage() Read a message.
 * * GetMessages() Get messages of user.
 * * DeleteMessage() Delete message
 * * GetUnreadMessages() Get unread messages of user
 * !--------------[ Logs ]--------------------
 * * GetLogList() Получить список (файлов) логов
 * * GetContentFileLog() Скачать лог-файл
 * !--------------[ DB ]----------------------
 * !--------------[ Search ]------------------
 * * GetSearch() Simple search of document
 * * GetSearchByFiled() Advanced search of document
 * * GetSearchUser() User search
 * !--------------[ Others ]------------------
 * * CheckUserIsLoggin() User authorization check
 * !--------------[ Category ]------------------
 * * AddCategory() add a Category for document
 * * UpdateCategory() Update a Category
 * * DeleteCategory() delete a Category
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
        pageSize: 20,
        page: _page,
        id: 0
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
 * @param {{}} _user
 * @version 0.0.0.1
 */
export async function ChangeUser(_user) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    let form = {
      id: _user.id,
      roleId: _user.roleId,
      phone: _user.phone,
      lastName: _user.lastName,
      firstName: _user.firstName,
      surName: _user.surName,
      position: _user.position,
      login: _user.login
    };

    if (_user.password_2.length > 7) form.password = _user.password_2;
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
 * @param {{}} user
 * @version 0.0.0.1
 */
export async function UpdateMyUserInfo(pass, user) {
  try {

    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    let form = {
      lastName: user.lastName,
      firstName: user.firstName,
      surName: user.surName,
      phone: user.phone,
      position: user.position,
      login: user.login
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
export async function AddDocument(doc, _file) {
  try {
    const formData = new FormData();
    formData.append("title", doc.title.trim());
    if (doc.parentId != null && !isNaN(doc.parentId) && doc.parentId >= 0) formData.append("parentId", doc.parentId);
    if (doc.old_version != null && doc.old_version >= 0) formData.append("old_version", doc.old_version);
    formData.append("info", doc.info.trim());
    formData.append("number", doc.number);
    formData.append("categoryId", doc.categoryId);
    formData.append("active", doc.active);
    formData.append("visibility", doc.visibility);
    formData.append("consultant_link", doc.consultant_link);
    formData.append("renew", doc.renew);
    formData.append("date", doc.date);
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
    formData.append("title", _data.title.trim());
    if (_data.parentId != null && !isNaN(_data.parentId) && _data.parentId >= 0) formData.append("parentId", _data.parentId);
    formData.append("info", _data.info.trim());
    formData.append("categoryId", _data.categoryId);
    formData.append("number", _data.number);
    formData.append("active", _data.active);
    formData.append("visibility", _data.visibility);
    formData.append("renew", _data.renew);
    formData.append("date", _data.date);
    formData.append("deleteChilds", _deleteChilds);
    //formData.append("old_version", null);
    //formData.append("consultant_link", null);
    if (_file != null) formData.append("file", _file);
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
    return response;
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
export async function GetDocument(_data, check) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    let data = {};
    data.id = _data.id;
    if (_data.date !== null && _data.date !== undefined && _data.date.length > 2) data.date = _data.date;
    if (_data.type === 'true') data.source = 'true';
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document",
      params: data,
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

    if (_autocmpl !== null && _autocmpl === true) {
      form.autocomplete = true;
      form.s = _s;
    }
    // console.log(form);
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
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetNewsDocument] - ${error}`);
    throw error;
  }
}

/**
 * Получить категории
 * @async
 * @version 0.0.0.1
 * @param {number} _page The number of page
 * @param {boolean} _total The flag of get all Categories or parts
 * @returns {string[]}
 */
export async function GetCategories(_page, _total) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "document/categories",
      params: {
        pageSize: "20",
        page: _page,
        total: _total,
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetCategories] - ${error}`);
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
        pageSize: 20,
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

// ------------------------------[ Messages ]-----------------------------------

/**
 * Send a message.
 * @async
 * @param {string} _text
 * @param {[]} _recipients
 * @version 0.0.0.1
 */
export async function SendMessage(_text, _recipients) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "POST",
      url: "message/send",
      data: {
        text: _text,
        recipients: _recipients
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/SendMessage] - ${error}`);
    throw error;
  }
}

/**
 * Read a message.
 * @async
 * @param {number} id
 * @version 0.0.0.1
 */
export async function ReadMessage(id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "PUT",
      url: "message/read",
      params: {
        messageId: id
      },
      headers: auth
    });
    //-------------------
    return response;
  } catch (error) {
    console.log(`[API/ReadMessage] - ${error}`);
    throw error;
  }
}

/**
 * Get messages of user.
 * @async
 * @param {number} _page
 * @version 0.0.0.1
 */
export async function GetMessages(_page) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "message",
      params: {
        pageSize: 20,
        page: _page
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/GetMessages] - ${error}`);
    throw error;
  }
}

/**
 * Get unread messages of user
 * @async
 * @returns {number} alerts
 * @version 0.0.0.1
 */
export async function GetUnreadMessages() {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    let countAlerts = 0;
    //-------------------
    const response = await axiosInstance({
      method: "GET",
      url: "message",
      params: {
        pageSize: 50,
        page: 0
      },
      headers: auth
    });

    for (const item of response.data.items) {
      if (!item.isRead) countAlerts++;
    }

    if (response.data.pages > 1) {
      for (let i = 0; i < response.data.pages; i++) {
        const response = await axiosInstance({
          method: "GET",
          url: "message",
          params: {
            pageSize: 50,
            page: i + 1
          },
          headers: auth
        });
        for (const item of response.data.items) {
          if (!item.isRead) countAlerts++;
        }
      }
    }
    //-------------------
    return countAlerts;
  } catch (error) {
    console.log(`[API/GetUnreadMessages] - ${error}`);
    throw error;
  }
}

/**
 * Delete a message
 * @async
 * @param {number} id
 * @version 0.0.0.1
 */
export async function DeleteMessage(id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    //-------------------
    const response = await axiosInstance({
      method: "DELETE",
      url: "message",
      params: {
        messageId: id,
      },
      headers: auth
    });
    //-------------------
    return response.data;
  } catch (error) {
    console.log(`[API/DeleteMessage] - ${error}`);
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
    if (!(_filename.length > 0)) {
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
 * Simple search of document
 * @async
 * @param {string} _content Область поиска
 * @param {number} _from Пагинация
 * @param {number} _to Пагинация
 * @param {boolean} _visibility Авторизован или нет
 * @param {string} _search Строка поиска
 * @version 0.0.0.1
 */
export async function GetSearch(_content, page, _search) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    const response = await axiosInstance({
      method: "GET",
      url: "search",
      params: {
        content: _content,
        page: page,
        pageSize: 20,
        search: _search
      },
      headers: auth
    });

    return response.data;
  } catch (error) {
    console.log(`[API/GetSearch] - ${error}`);
    throw error;
  }
}

/**
 * Advanced search of document
 * @async
 * @param {string} _content Область поиска
 * @param {number} _from Пагинация
 * @param {number} _to Пагинация
 * @param {[{query: string,field:string},{creategAt: number}]} _search Массив объектов (выборка)
 * @version 0.0.0.1
 */
export async function GetSearchByFiled(_content, page, _search) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };

    const response = await axiosInstance({
      method: "POST",
      url: "search",
      data: {
        content: _content,
        page: page,
        pageSize: 20,
        fieldsQuery: _search
      },
      headers: auth
    });
    return response.data;
  } catch (error) {
    console.log(`[API/GetSearchByFiled] - ${error}`);
    throw error;
  }
}

/**
 * User search
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
    _roleId = (_roleId === 0 ? -1 : _roleId);
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

// !--------------[ Others ]------------------

/**
 * User authorization check
 * @returns {boolean}
 */
export function CheckUserIsLoggin() {
  try {
    const unix_date_reg = parseInt(localStorage.getItem("_date"));
    const jwt = localStorage.getItem("jwt");
    if ((unix_date_reg !== null && unix_date_reg !== undefined) && (jwt !== null && jwt !== undefined)) {
      const unix_date_now = new Date().getTime();
      const TTL_Token_hour = 12 * 60 * 60 * 1000;
      if (unix_date_now < (unix_date_reg + TTL_Token_hour)) return true;
    }
    return false;
  } catch (error) {
    console.log(`[CheckUserIsLoggin] - ${error}`);
    return false;
  }
}

// !--------------[ Category ]------------------

/**
 * Add a Category for the documents
 * @returns {void}
 */
export async function AddCategory(text) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    const response = await axiosInstance({
      method: "POST",
      url: "category",
      data: {
        title: text,
      },
      headers: auth
    });
    return response.data;
  } catch (error) {
    console.log(`[API/AddCategory] - ${error}`);
    throw error;
  }
}

/**
 * Update a Category
 * @returns {void}
 */
export async function UpdateCategory(_id, _title) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    const response = await axiosInstance({
      method: "PUT",
      url: "category",
      data: {
        id: _id,
        title: _title,
      },
      headers: auth
    });
    return response.data;
  } catch (error) {
    console.log(`[API/UpdateCategory] - ${error}`);
    throw error;
  }
}

/**
 * Delete a Category
 * @param {Number} _id The id of the category
 * @returns {void}
 */
export async function DeleteCategory(_id) {
  try {
    const auth = {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    };
    const response = await axiosInstance({
      method: "DELETE",
      url: "category",
      params: {
        id: _id,
      },
      headers: auth
    });
    return response.data;
  } catch (error) {
    console.log(`[API/DeleteCategory] - ${error}`);
    throw error;
  }
}
