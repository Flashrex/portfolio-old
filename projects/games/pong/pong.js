'use strict';
//Vector2
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

//Rectangle
class Rect{
    constructor(width, height) {
        this.position = new Vector2;
        this.size = new Vector2(width, height);
    }
}

//Ball
class Ball extends Rect {
    constructor() {
        super(10, 10);
        this.velocity = new Vector2;
        this.speed = 0.5;
    }

    move(dt) {
        this.position.x += this.velocity.x * dt * this.speed;
        this.position.y += this.velocity.y * dt * this.speed;

        //Check Wall Collision
        if(this.position.y < 0) {
            //Hit Upper Wall
            this.position.y = 0;
            this.velocity.y *= -1;

        } else if (this.position.y > canvas.height - this.size.y) {
            //Hit Bottom Wall
            this.position.y = canvas.height - this.size.y;
            this.velocity.y *= -1;
        }


        //Check Out of Game
        if(this.position.x < 0) {
            //Ball hit left Wall
            player2.scored();
            resetGame("RIGHT");

        } else if(this.position.x > canvas.width - this.size.x) {
            //Ball hit Right Wall
            player1.scored();
            resetGame("LEFT");
        }

        //Check Player Collision
        if(this.position.x > player1.position.x && this.position.x < player1.position.x + player1.size.x
            && this.position.y > player1.position.y && this.position.y < player1.position.y + player1.size.y ||
            this.position.x > player2.position.x - this.size.x && this.position.x < player2.position.x + player2.size.x
            && this.position.y > player2.position.y && this.position.y < player2.position.y + player2.size.y) {
                this.velocity.x *= -1;
        }
    }

}

class Player extends Rect {
    constructor(name) {
        super(20, 100);
        this.velocity = new Vector2;
        this.score = 0;
        this.speed = 5;
        this.name = name;
    }

    scored() {
        this.score++;

        if(this.score === 5) {
            alert('' +this.name +' hat gewonnen!');
            gameOver = true;
        }
    }

    move(direction) {

        if(direction === "Up") {
            //move up
            if(this.position.y - this.speed <= 5) {
                this.position.y = 5;
            } else {
                this.position.y -= this.speed;
            }

        } else if(direction === "Down") {
            //move down
            if(this.position.y + this.speed >= canvas.height - player1.size.y) {
                this.position.y = canvas.height - player1.size.y - 5;
            } else {
                this.position.y += this.speed;
            }
        }
    }
}

class Stages {
    constructor() {
        this.current = 1;
        this.modifier = 0.5;
    }

    update() {
        this.current++;
        ball.speed = this.current * this.modifier;
    }
}

//Constants
const canvas = document.getElementById("pong");
const context = canvas.getContext('2d');

//Create Ball
const ball = new Ball();
ball.position = new Vector2((canvas.width/2 - ball.size.x/2), (canvas.height/2 - ball.size.y/2));
ball.velocity = new Vector2(100, 100);

//Create Players
const player1 = new Player("Spieler 1");
player1.position = new Vector2(20, (canvas.height/2 - player1.size.y/2));


const player2 = new Player("Spieler 2");
player2.position = new Vector2((canvas.width - player2.size.x) - 20, (canvas.height/2 - player2.size.y/2));

//Create Stages
const stages = new Stages();

//Vars
let gameOver = false;
let paused = true;

//GameLoop
let lastTime;
let ticks = 0;
function callback(millis) {

    if(gameOver) {
        location.reload();
    }

    ticks++;
    if(ticks % 1000 === 0) {
        if(!paused) stages.update();
    }

    if(lastTime) {
        update((millis - lastTime) / 1000);
    }
    lastTime = millis;
    requestAnimationFrame(callback);
}

function update(dt) {
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Draw Black Background
    context.fillStyle = '#000'; 
    context.fillRect(0, 0, canvas.width, canvas.height);

    //Draw Center Line
    context.fillStyle = '#fff';
    for(var i = 0; i < canvas.height / 10; i++) {
        if(i % 2 != 0) {
            context.fillRect(canvas.width/2 -1, i * 10, 2, 10);
        }
    }

    //Draw Scores
    context.fillStyle = '#fff';
    context.font = "32px Arial"
    context.fillText('' +player1.score, canvas.width/2 - 50, 35);
    context.fillText('' +player2.score, canvas.width/2 + 30, 35);

    //Draw Stage
    context.font = "16px Arial";
    context.fillText('Speed: ' +stages.current, 15, 25);

    if(!paused) {

        //Update Ball
        ball.move(dt);

        //Update Players
        player1.position.y += player1.velocity.y * dt; 
        player2.position.y += player2.velocity.y * dt;

        //Update Key Array
        if(keys["87"]) player1.move("Up");
        else if(keys["83"]) player1.move("Down");

        if(keys["38"]) player2.move("Up");
        else if(keys["40"]) player2.move("Down");
    } else {
        context.font = "32px Arial";
        context.fillText('Press [Space] to Start', canvas.width/2-150, canvas.height/2);
    }

    //draw ball
    context.fillStyle = '#f00';
    context.fillRect(ball.position.x, ball.position.y, ball.size.x, ball.size.y);

    //draw players
    context.fillStyle = '#fff';
    context.fillRect(player1.position.x, player1.position.y, player1.size.x, player1.size.y);
    context.fillRect(player2.position.x, player2.position.y, player2.size.x, player2.size.y);

    if(keys["32"]) paused = false;
}

callback();

/**
 * Resets the Game and starts a new one.
 * Score will not be resetted!
 * @param {*Starting direction for the ball.} ballDirection 
 */
function resetGame (ballDirection) {

    //Reset Positions
    player1.position = new Vector2(20, (canvas.height/2 - player1.size.y/2));
    player2.position = new Vector2((canvas.width - player2.size.x) - 20, (canvas.height/2 - player2.size.y/2));
    ball.position = new Vector2((canvas.width/2 - ball.size.x/2), (canvas.height/2 - ball.size.y/2));

    //Reset Ball Speed and Stage
    ball.speed = 1.0;
    stages.current = 2; 

    //Find Start Direction for Ball
    if(ballDirection === 'RIGHT') {
        ball.velocity = new Vector2(100, 100);
    } else {
        ball.velocity = new Vector2(-100, -100);
    }
}

//Key Control
var keys = {};
window.onkeyup = function(e) { keys[e.keyCode] = false};
window.onkeydown = function(e) { keys[e.keyCode] = true};