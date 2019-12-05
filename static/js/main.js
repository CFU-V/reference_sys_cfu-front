var MainSocket = null;

window.onload = function () {
  if (MainSocket === null) {
    try {
      MainSocket = io("https://doctracker.cfuv-it.ru/");
    } catch (error) {}
  }
}

window.onbeforeunload = function () {
  const id = JSON.parse(localStorage.getItem('user')).id;
  if (id !== null && id !== undefined && (MainSocket !== null && MainSocket !== undefined)) {
    try {
      MainSocket.emit('log_out', id);
    } catch {}
  }
}

$(window).on('load', function () {
  $('#js-wrap-preloader').delay(200).fadeOut('slow');
});
