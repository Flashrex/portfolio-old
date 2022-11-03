var darkmode = true;

checkCookies();
function checkCookies() {
    var cookiesEnabled = getCookie('cookieEnabled');

    switch(cookiesEnabled) {
        case "true":
            //cookies enabled
            darkmode = getCookie('darkmode') === "" ? true : getCookie('darkmode') === "true";
            applyDarkmode();
            break;

        default:
            //first time visit or cookies declined
            createCookieDiv(); 
            break;
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString};SameSite=Lax;path=/`;
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
  
function createCookieDiv() {
    const div = document.createElement("div");
    div.classList.add('cookieDiv');
    div.classList.add('bg-dark-contrast');
    
  
    const headline = document.createElement("h3");
    headline.innerHTML = "Wir lieben Cookies!";
    headline.classList.add('font-darkmode-white');
    headline.classList.add('headline-text');
    headline.style.marginTop = "4rem";
  
    const text = document.createElement("p");
    text.innerHTML = "Auf dieser Website werden Cookies zur Verbesserung des Nutzungserlebnisses verwendet. <br>Die Cookies dienen lediglich zur Speicherung von visuellen Präferenzen. Es werden keine nutzerbezogenen Daten gespeichert!";
    text.classList.add('font-darkmode-white');
    text.style.width = "80%";
    text.style.marginLeft = "10%";
  
    const buttonAccept = document.createElement("input");
    buttonAccept.classList.add('button');
    buttonAccept.value = "Akzeptieren";
    buttonAccept.onclick = onUserAcceptedCookies;
    buttonAccept.style.textAlign = "center";
  
    const buttonDecline = document.createElement("input");
    buttonDecline.classList.add('button');
    buttonDecline.value = "Ablehnen";
    buttonDecline.onclick = onUserDeclinedCookies;
    buttonDecline.style.textAlign = "center";
  
    const buttonContainer = document.createElement("div");
    buttonContainer.appendChild(buttonAccept);
    buttonContainer.appendChild(buttonDecline);
  
    div.appendChild(headline);
    div.appendChild(text);
    div.appendChild(buttonContainer);
  
    document.body.append(div);
}
  
function removeCookieDiv() {
    const cookieDiv = document.querySelector('.cookieDiv');
    cookieDiv.remove();
}
  
function onUserAcceptedCookies() {
    removeCookieDiv();
  
    setCookie("cookieEnabled", "true", 30);
}
  
function onUserDeclinedCookies() {
    removeCookieDiv();
}

/* Darkmode */
function toggleDarkMode() {
    darkmode = !darkmode;
    setCookie('darkmode', darkmode, 30);
    applyDarkmode();
}

function applyDarkmode() {

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



