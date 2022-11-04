const aboutSection = document.querySelector('.aboutme-section');
const projectSection = document.querySelector('.project-section');
const contactSection = document.querySelector('.contact-section');

const headerItems = document.querySelector('.header-list');

document.addEventListener('scroll', (e) => {
    
    //console.log({scrollY: window.scrollY, min: aboutSection.scrollHeight, max: projectSection.scrollHeight - contactSection.scrollHeight})

    if(window.scrollY < aboutSection.scrollHeight-50) {
        underlineHeaderElement(0);
    }
    else if(window.scrollY >= aboutSection.scrollHeight-250 && window.scrollY <= projectSection.scrollHeight - contactSection.scrollHeight) {
        underlineHeaderElement(1);
    } 
    else if(window.scrollY >= projectSection.scrollHeight+250 && window.scrollY <= document.documentElement.scrollHeight - contactSection.scrollHeight) {
        underlineHeaderElement(2);
    }
})

function underlineHeaderElement(index) {
    headerItems.querySelectorAll('.underlined').forEach(e => e.classList.remove('underlined'));

    headerItems.children[index].children[0].classList.add("underlined");
}

window.onload = (e) => {
    calculateAndSetAge();
}

function calculateAndSetAge() {
    const ageElem = document.getElementById("age");
    var date = new Date();

    var age = date.getFullYear() - 1996;
    if(date.getMonth() < 3 || (date.getMonth() === 4 && date.getDate() < 26)) age -= 1;

    ageElem.innerHTML = age;
}

/* business card, item hover effect */ 
for(const item of document.querySelectorAll('.item')) {
    item.onmousemove = e => handleMouseMovement(e);
}
document.querySelector(".card").onmousemove = e => handleMouseMovement(e);


const handleMouseMovement = e => {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;  

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
}

