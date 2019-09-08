/**
 *
 * @param {*} state
 * @param {*} data
 */
export const SetUserData = (state, data) => {
  state.user.data = data;
  state.user.authenticated = true;
}
