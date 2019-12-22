import Vue from "vue";
import Router from "vue-router";
import Login from "@/pages/login";
import Main from "@/pages/main";
import _404 from "@/pages/404";
import Console from "@/pages/console";
import Account from "@/pages/account";
import User_list from "@/pages/user_list";
import Add_user from "@/pages/add_user";
import Document_list from "@/pages/document_list";
import Document_management from "@/pages/document_management";
import Messages from "@/pages/message";
import Bookmark from "@/pages/bookmark";
import _Search from "@/pages/result_of_search";
import Document_view from "@/pages/document_view";
import Document_load from "@/pages/document_load";
import Logs from "@/pages/view_logs";
import Document_types from "@/pages/document_types";
import Document_compare from "@/pages/document_compare";
import Document_view_compare from "@/pages/document_view_compare";

Vue.use(Router);

const router = new Router({
  routes: [{
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        title: "Авторизация"
      }
    },
    {
      path: "/",
      name: "Main",
      component: Main,
      meta: {
        title: "Главная страница"
      }
    },
    {
      path: "/console",
      redirect: "/console/account",
      name: "Console",
      component: Console,
      children: [{
          path: "account",
          name: "Account",
          component: Account,
          meta: {
            requiresAuth: true,
            title: "Ваш профиль | Личный кабинет"
          }
        },
        {
          path: "user-list/:page?",
          name: "User-list",
          component: User_list,
          meta: {
            requiresAuth: true,
            title: "Управление пользователями | Личный кабинет"
          }
        },
        {
          path: "add-user",
          name: "Add-user",
          component: Add_user,
          meta: {
            requiresAuth: true,
            title: "Добавить пользователя | Личный кабинет"
          }
        },
        {
          path: "document-list/:page?",
          name: "Document-list",
          component: Document_list,
          meta: {
            requiresAuth: true,
            title: "Список документов | Личный кабинет"
          }
        },
        {
          path: "document-management/:page?",
          name: "Document-management",
          component: Document_management,
          meta: {
            requiresAuth: true,
            title: "Управление документами | Личный кабинет"
          }
        },
        {
          path: "document-types/:page?",
          name: "Document-types",
          component: Document_types,
          meta: {
            requiresAuth: true,
            title: "Управление категориями | Личный кабинет"
          }
        },
        {
          path: "document-compare/:page?",
          name: "Document-compare",
          component: Document_compare,
          meta: {
            requiresAuth: true,
            title: "Сравнить документы | Личный кабинет"
          }
        },
        {
          path: "document-view-compare/",
          name: "Document-view-compare",
          component: Document_view_compare,
          meta: {
            requiresAuth: true,
            title: "(Просмотр) Сравнить документы | Личный кабинет"
          }
        },
        {
          path: "document-load",
          name: "Document-load",
          component: Document_load,
          meta: {
            requiresAuth: true,
            title: "Добавить документ | Личный кабинет"
          }
        },
        {
          path: "messages/:page?",
          name: "Messages",
          component: Messages,
          meta: {
            requiresAuth: true,
            title: "Ваши уведомления | Личный кабинет"
          }
        },
        {
          path: "logs/:page?",
          name: "Logs",
          component: Logs,
          meta: {
            requiresAuth: true,
            title: "Журнал событий | Личный кабинет"
          }
        },
        {
          path: "bookmark/:page?",
          name: "Bookmark",
          component: Bookmark,
          meta: {
            requiresAuth: true,
            title: "Ваши закладки | Личный кабинет"
          }
        },
        {
          path: "*",
          redirect: "/unknown"
        }
      ],
      meta: {
        requiresAuth: true,
        title: "Личный кабинет"
      }
    },
    {
      path: "/search/:page?/:simple?",
      name: "search",
      component: _Search,
      meta: {
        title: "Результат поиска | Поиск"
      }
    },
    {
      path: "/docview/:id?/",
      name: "docview",
      component: Document_view,
      meta: {
        title: "Просмотр документа"
      }
    },
    {
      path: "*",
      name: "404",
      component: _404,
      meta: {
        title: "404 - Страница не найдена!"
      }
    }
  ],
  mode: 'history',
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") === null || localStorage.getItem("jwt") === undefined) {
      next({
        path: "/login/",
        params: {
          nextUrl: to.fullPath
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
