var darkmode = getCookie('darkmode') === "" ? true : getCookie('darkmode') === "true";
applyDarkmode();

function toggleDarkMode() {
    darkmode = !darkmode;
    document.cookie = `darkmode=${darkmode};SameSite=None;secure`;
    applyDarkmode();
}

function applyDarkmode() {
    console.log("Cookie: " +getCookie('darkmode') +", darkmode: " +darkmode);

    document.querySelectorAll(darkmode ? ".bg-light" : ".bg-dark").forEach(e => {
        e.classList.add(darkmode ? "bg-dark" : "bg-light");
        e.classList.remove(darkmode ? "bg-light" : "bg-dark");
    })

    document.querySelectorAll(darkmode ? ".bg-light-contrast" : ".bg-dark-contrast").forEach(e => {
        e.classList.add(darkmode ? "bg-dark-contrast" : "bg-light-contrast");
        e.classList.remove(darkmode ? "bg-light-contrast" : "bg-dark-contrast");
    })

    document.querySelectorAll(darkmode ? ".font-lightmode-black" : ".font-darkmode-white").forEach(e => {
        e.classList.add(darkmode ? "font-darkmode-white" : "font-lightmode-black");
        e.classList.remove(darkmode ? "font-lightmode-black" : "font-darkmode-white");
    })

    document.querySelectorAll(darkmode ? ".font-lightmode-grey" : ".font-darkmode-grey").forEach(e => {
        e.classList.add(darkmode ? "font-darkmode-grey" : "font-lightmode-grey");
        e.classList.remove(darkmode ? "font-lightmode-grey" : "font-darkmode-grey");
    })

    let icon = document.getElementById("dm-icon");
    icon.classList.add(!darkmode ? "svg-color-dark" : "svg-color-light");
    icon.classList.remove(!darkmode ? "svg-color-light" : "svg-color-dark");
    icon.src = darkmode ? "images/sun.svg" : "images/moon.svg";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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