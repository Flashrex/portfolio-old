const aboutSection = document.querySelector('.aboutme-section');
const projectSection = document.querySelector('.project-section');
const contactSection = document.querySelector('.contact-section');

const headerItems = document.querySelector('.header-list');

document.addEventListener('scroll', (e) => {
    
    console.log({scrollY: window.scrollY, min: aboutSection.scrollHeight, max: projectSection.scrollHeight - contactSection.scrollHeight})

    if(window.scrollY < aboutSection.scrollHeight) {
        underlineHeaderElement(0);
    }
    else if(window.scrollY >= aboutSection.scrollHeight && window.scrollY <= projectSection.scrollHeight - contactSection.scrollHeight) {
        underlineHeaderElement(1);
    } 
    else if(window.scrollY >= projectSection.scrollHeight && window.scrollY <= document.documentElement.scrollHeight - contactSection.scrollHeight) {
        underlineHeaderElement(2);
    }


})

function underlineHeaderElement(index) {
    headerItems.querySelectorAll('.underlined').forEach(e => e.classList.remove('underlined'));

    headerItems.children[index].children[0].classList.add("underlined");
}

function scrollToSection(index) {
    // underlineHeaderElement(index);

    let top = 0;
    switch(index) {
        
        case 1: //projects
            top = aboutSection.scrollHeight;
            window.scrollTo({top: top, left: 0, behavior: 'smooth'});
            break;

        case 2: //contact
            top = aboutSection.scrollHeight + projectSection.scrollHeight;
            window.scrollTo({top: top, left: 0, behavior: 'smooth'});
            break;

        default: 
            //scroll to top
            window.scrollTo({top: top, left: 0, behavior: 'smooth'});
            // aboutSection.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
            
            break;
    }
}