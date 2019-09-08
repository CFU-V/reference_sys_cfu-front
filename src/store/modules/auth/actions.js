// import * as api from '../../../api'

/**
 * Добавить информацию о пользователе в хранилище
 * @param {*} commit
 * @param {array} data The array of data user
 */
export const SetUserData = ({ commit }, data) =>
{
  commit('SetUserData', data);
}
