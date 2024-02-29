function setCookie(cname,cvalue,minutes = 1440) {
  const d = new Date();
  const time = d.getTime() + (1440*60*1000);
  d.setTime(time); //1440 minutes x 60s x 1000ms  = 86400000ms = 1 day
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default {
  getCookie,
  setCookie
};