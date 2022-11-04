/* create random stars */
const starCount = 250;

createStars();
animateStars();

function createStars() {
    const bg = document.querySelector('.background');
    
    const dim = {
        height: window.innerHeight,
        width: window.innerWidth
    }

    for(var i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        star.classList.add('star');
        star.classList.add('star-light');

        star.style.left = `${Math.floor(Math.random() * dim.width)}px`;
        star.style.top =`${Math.floor(Math.random() * dim.height)}px`;

        const size = Math.random() * 2;

        star.style.boxShadow = `${size}px ${size}px ${size}px ${size}px rgb(255, 255, 255)`;

        bg.appendChild(star);
    }
}

function animateStars() {
    setInterval(() => {
        document.querySelectorAll('.star').forEach(e => {
            if(Math.random() > 0.8) {
                if(e.classList.contains('star-dark')) {
                    e.classList.remove('star-dark');
                    e.classList.add('star-light');
                }
                else if(e.classList.contains('star-light')) {
                    e.classList.remove('star-light');
                    e.classList.add('star-dark');
                }
            }
        });
    }, 1000);
}