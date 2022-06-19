setInterval(() => {
    updateTime();
}, 950);

function updateTime() {
    let startDate = new Date(2021, 03, 04, 0, 0, 0, 0); //04.04.2020

    let currentDate = new Date();

    console.log(`start: ${startDate}, to: ${currentDate}, ${currentDate-startDate}`)

    document.querySelector('#timefrom').innerHTML = formatDate(Math.abs(currentDate-startDate));
}

function formatDate(dateInMs) {
    let seconds = Math.floor(dateInMs / 1000);
    let minutes = Math.floor(seconds/60);
    let hours = Math.floor(minutes/60);
    let days = Math.floor(hours/24);
    let months = Math.floor(days/30.5);
    let years = Math.floor(months/12);

    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 24;
    days = days % 30.5;
    months = months % 12;

    //1 Jahr 2 Monate 21 Tage 7 Stunden 43 Minuten x Sekunden
    return `${years} ${years > 1 ? "Jahre" : "Jahr"} ${months} ${months > 1 ? "Monate" : "Monat"} ${days} ${days > 1 ? "Tage" : "Tag"} ${hours} ${hours > 1 ? "Stunden" : "Stunde"} ${minutes} ${minutes > 1 ? "Minuten" : "Minute"} ${seconds} ${seconds > 1 ? "Sekunden" : "Sekunde"}`;
}