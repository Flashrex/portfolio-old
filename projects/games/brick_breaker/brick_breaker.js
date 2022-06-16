const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Brick extends Rectangle {
    constructor(x, y, width, height) {
        let rnd = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
        let color = '#ffffff';

        switch(rnd) {
            case 1:
                color = '#00ff00';
                break;

            case 2:
                color = '#ffff00';
                break;

            case 3:
                color = '#ff0000';
                break;
        }

        super(x, y, width, height, color);
        this.lifes = rnd;
        this.color = color;
    }

    damage() {
        //Create Particles
        for(let i = 0; i < 100; i++) {
            particleArr.push(new Particle(this.x + this.width/2, this.y + this.height/2, 2, this.color, new Vector2d(Math.random() * (2 - (-2)) + (-2), Math.random() * (2 - (-2)) + (-2))));
        }

        this.lifes--;
        if(this.lifes <= 0) {
            this.delete();
        } else {
            switch(this.lifes) {
                case 1:
                    this.color = '#00ff00';
                    break;
                
                case 2:
                    this.color = '#ffff00';
                    break;
            }
        }
    }

    delete() {
        brickArr.splice(brickArr.indexOf(this), 1);
        player.score();

        if(brickArr.length === 0) {
            player.gameOver = true;
        }

        //Random Chance to create Item
        if(Math.random() > 0.8) {
            if(Math.random() > 0.5) {
                itemArr.push(new Item(this.x + this.width/2, this.y + this.height/2, 'MoreBalls'));
            } else {
                itemArr.push(new Item(this.x + this.width/2, this.y + this.height/2, 'Laser'));
            }
        }
    }
}

class Player extends Rectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);

        this.lifes = 3;
        this.points = 0;
        this.gameOver = false;
        this.velocity = new Vector2d(0, 0);
        this.laser = false;
        this.cooldown = false;
    }

    draw() {
        if(!this.laser) {
            super.draw();
            return;
        }
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width/5, this.height);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + this.width/5, +this.y, this.width/5*4, this.height);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x + this.width/5*4, this.y, this.width/5, this.height);
    }

    move() {
        if(this.x + this.velocity.x > 5 && this.x + this.velocity.x + this.width < canvas.width-5) {
            this.x += this.velocity.x;
        }
    }

    damage() {
        this.lifes--;
        if(this.lifes <= 0) {
            this.gameOver = true;
        }
    }

    score() {
        this.points += 50;
    }
}

class Laser extends Rectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.velocity = new Vector2d(0, -1);
    }

    move() {
        if(this.y + this.velocity.y < 0) {
            this.delete();
        
        }

        brickArr.forEach(brick => {
            if(this.y + this.velocity.y < brick.y + brick.height && this.x > brick.x && this.x < brick.x + brick.width) {
                brick.damage();
                this.delete();
            }
        })

        this.y += this.velocity.y;
    }

    delete() {
        laserArr.splice(laserArr.indexOf(this), 1);
    }
}

class Star extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height, '#ffffff');
    }

    flash() {
        this.x = Math.floor(Math.random() * (800 - 0) ) + 0;
        this.y = Math.floor(Math.random() * (600 - 0) ) + 0;
    }
}

class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Ball extends Circle {
    constructor(x, y, r, color, velocity, transparent) {
        super(x, y, r, color);
        this.velocity = velocity;
        this.transparent = transparent;
    }

    move() {

        this.doCollideWithWalls();

        this.doCollideWithRect(player);
        
        brickArr.forEach(brick => {
            if(this.doCollideWithRect(brick)) {
                brick.damage();
            }
        })

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    doCollideWithWalls() {
        if(this.x - this.r + this.velocity.x < 0 || this.x + this.r + this.velocity.x > canvas.width) {
            this.velocity.x *= -1;
        }
        
        if(this.y - this.r + this.velocity.y < 0) {
            this.velocity.y *= -1;
        } else if(this.y + this.r + this.velocity.y > player.y + player.height) {
            if(this.transparent) {
                this.delete();
            } else {
                ResetGame();
                ballArr.push(this);
                this.reset();
            }
           
        }
    }


    doCollideWithRect(object) {
        if(this.x + this.r + this.velocity.x < object.x || this.x - this.r + this.velocity.x > object.x + object.width) return;
        if(this.y + this.r + this.velocity.y < object.y || this.y - this.r + this.velocity.y > object.y + object.height) return;

        if(this.velocity.x > 0 && this.velocity.y > 0 && this.x + this.r < object.x 
            || this.velocity.x > 0 && this.velocity.y < 0 && this.x + this.r < object.x ) {
            //Collision on Left Side of Object
            this.velocity.x *= -1;
            return true;
        }

        if(this.velocity.x < 0 && this.velocity.y > 0 && this.x - this.r > object.x + object.width
            || this.velocity.x < 0 && this.velocity.y < 0 && this.x - this.r > object.x + object.width) {
            //Collision on Right Side ob Object
            this.velocity.x *= -1;
            return true;
        }

        if(this.velocity.y > 0 && this.x + this.r > object.x && this.x - this.r < object.x + object.width && this.y + this.r < object.y
            || this.velocity.y < 0 && this.x + this.r > object.x && this.x - this.r < object.x + object.width && this.y - this.r > object.y + object.height) {
            //Collision on Top or Bottom
            this.velocity.y *= -1;
            return true;
        }
    }

    reset() {
        player.damage();
        gameStarted = false;
        this.x = 395;
        this.y = 550;
        this.velocity = new Vector2d(0, 0);
    }

    delete() {
        ballArr.splice(ballArr.indexOf(this), 1);
    }
}

class Particle extends Circle {
    constructor(x, y, r, color, velocity) {
        super(x, y, r, color);
        this.velocity = velocity;
    }

    move() {
        if(this.x + this.velocity.x > canvas.width || this.x + this.velocity.x < 0 ||
            this.y + this.velocity.y > canvas.height || this.y + this.velocity.y < 0) {
                this.delete();
            } else {
                this.x += this.velocity.x;
                this.y += this.velocity.y;
            }
    }

    delete() {
        particleArr.splice(particleArr.indexOf(this), 1);
    }
}

class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.velocity = new Vector2d(0, 1);
        this.type = type;
        this.image = new Image();
        this.setImage();
    }

    setImage() {
        switch(this.type) {
            case "MoreBalls":
                this.image.src = 'images/balls.png';
                break;
            case "Laser":
                this.image.src = 'images/laser.png';
                break;
        }
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.r*2, this.r*2);
    }

    move() {
        if(this.y + this.r + this.velocity.y > canvas.height) {
            this.delete();
        
        } else if(this.x + this.r > player.x && this.x + this.r < player.x + player.width &&
            this.y + this.r + this.velocity.y > player.y) {
            
            if(this.type === 'MoreBalls') {
                for(var i = 0; i < 3; i++) {
                    if(Math.random() > 0.5) {
                        ballArr.push(new Ball(player.x + player.width/2, player.y - 10, 10, '#00ffff', new Vector2d(3, -3), true));
                    } else {
                        ballArr.push(new Ball(player.x + player.width/2, player.y - 10, 10, '#00ffff', new Vector2d(-3, -3), true));
                    }
                }

            } else if(this.type === 'Laser') {
                player.laser = true;
                let reset = setInterval(() => {
                    player.laser = false;
                    clearInterval(reset);
                }, 10000);
            }
            this.delete();
        }

        this.y += this.velocity.y;
    }

    delete() {
        itemArr.splice(itemArr.indexOf(this), 1);
    }
}

//Game Variables
let player;
let ballArr = [];
let brickArr = [];
let particleArr = [];
let itemArr = [];
let laserArr = [];
let starArr = [];
let gameStarted = false;
let gameLoop;

Initialize();
function Initialize() {
    //Create Objects
    player = new Player(320, 570, 160, 20, '#ffffff');
    player.draw();

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            brickArr.push(new Brick(70 +80*i, 50 +30*j, 60, 20));    
        }
    }

    let ball = new Ball(395, 550, 10, '#00ff00', new Vector2d(0, 0), false);
    ballArr.push(ball);

    gameLoop = setInterval(update, 10);

    for(var i = 0; i < 500; i++) {
        let rnd = Math.floor(Math.random() * (2 - 1 + 1) ) +1;
        starArr.push(new Star(Math.floor(Math.random() * (800 - 0) ) + 0, Math.floor(Math.random() * (600 - 0) ) + 0, rnd, rnd));
    }
}


function update() {
    if(player.gameOver) {
        clearInterval(gameLoop);

        //Show GameOver
        ctx.fillStyle = '#ffffff';
        ctx.font = "60px Arial";
        ctx.fillText("GameOver! Score: " +player.points, canvas.width/6 , canvas.height/2 + 100);
        return;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    starArr.forEach(star => {
        star.draw();
        if(Math.random() > 0.9995) star.flash();
    })

    ctx.fillStyle = '#ffffff';
    ctx.font = "20px Arial";
    ctx.fillText("Lifes: " +player.lifes, 10, 20);
    ctx.fillText("Points: " +player.points, 680, 20); 

    if(keys["37"]) {player.velocity.x = -4;}
    else if(keys["39"]) {player.velocity.x = 4;}
    else {player.velocity = new Vector2d(0,0)};

    particleArr.forEach(particle => {
        particle.move();
        particle.draw();
    })

    player.move();
    player.draw();

    brickArr.forEach(brick => {
        brick.draw();
    })

    ballArr.forEach(ball => {
        ball.move();
        ball.draw();
    })

    itemArr.forEach(item => {
        item.move();
        item.draw();
    })

    laserArr.forEach(laser => {
        laser.move();
        laser.draw();
    })
}

document.addEventListener("keydown", function(event) {
    if(!gameStarted && event.keyCode === 32) {
        ballArr.forEach(ball => {
            if(Math.random() > 0.5) {
                ball.velocity = new Vector2d(3, -3);
            } else {
                ball.velocity = new Vector2d(-3, -3);
            }
        })

        gameStarted = true;
    } else if(gameStarted && player.laser === true && event.keyCode === 32 && !player.cooldown) {
        if(Math.random() > 0.5) {
            laserArr.push(new Laser(player.x + player.width - 15, player.y, 4, 8, '#ff0000'));
        } else {
            laserArr.push(new Laser(player.x + 15, player.y, 4, 8, '#ff0000'));
        }
        player.cooldown = true;
        let cooldown = setInterval(() => {
            player.cooldown = false;
            clearInterval(cooldown);
        }, 500);
        
        
    }
})

//Key Control
var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false};
window.onkeydown = function(e) { keys[e.keyCode] = true};

function ResetGame() {
    player.laser = false;
    ballArr = [];
    particleArr = [];
    itemArr = [];
    laserArr = [];
}