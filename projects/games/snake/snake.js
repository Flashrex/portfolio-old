const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

const box = 32;

//Load Images
const background = new Image();
background.src = "images/background.png"

const foodImage = new Image();
foodImage.src = "images/apple.png";


//Create Snake
let snake = [];
snake[0] = {
    x : 9 * box,
    y : 10 * box
}

//Create Food
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

//Game Vars
let score = 0;
let gameOver = false;

//Game logic

//Control
let d;
document.addEventListener("keydown", function(event) {
    if(gameOver) return;
    if(event.keyCode === 37 && d != "RIGHT") { //Left
        d = "LEFT";
    } else if (event.keyCode === 38 && d != "DOWN") { //Up
        d = "UP";
    } else if (event.keyCode === 39 && d != "LEFT") { //Right
        d = "RIGHT";
    } else if (event.keyCode === 40 && d != "UP") { //Down
        d = "DOWN";
    }
});

//Collision
function collision(snakeHead, snakeArray) {
    for(let i = 0; i < snakeArray.length; i++) {
        if(snakeHead.x == snakeArray[i].x && snakeHead.y == snakeArray[i].y) {
            return true;
        } 
    }
    return false;
}

//Create new Food
function createFood() {
    var success = false;
    while(!success) {
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }

        var match = false;
        for(let i = 0; i < snake.length; i++) {
            if(food.x === snake[i].x && food.y === snake[i].y) {
                match = true;
            }
        }
        if(!match) success = true;
    }
}

//Gameloop
function draw() {

    //Background
    ctx.drawImage(background, 0, 0);

    //Snake
    for(let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "blue" : "lightblue";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "grey";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    
    //Food
    ctx.drawImage(foodImage, food.x, food.y);

    //Score
    ctx.fillStyle = "white";
    ctx.font = "20px Changa one";
    ctx.fillText("Score: " +score, 15.5*box, 3.5*box);

    //Old Head Pos
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //Get Direction
    if( d == "LEFT") {
        if(snakeX - box < box) {
            snakeX = 17 * box;
        } else {
            snakeX -= box;
        }
    }
    if( d == "RIGHT") {
        if(snakeX + box > 17 * box) {
            snakeX = box;
        } else {
            snakeX += box;
        }
        
    }
    if( d == "UP") {
        if(snakeY - box < 3 * box) {
            snakeY = 17 * box;
        } else {
            snakeY -= box;
        }
        
    } 
    if( d == "DOWN") {
        if(snakeY + box > 17 * box) {
            snakeY = 3 * box;
        } else {
            snakeY += box;
        }
        
    } 

    //Eat Foot
    if(snakeX == food.x && snakeY == food.y) {
        score++;
        createFood();

    } else {
        //remove Tail
        snake.pop();
    }

    //Create new Head
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over
    if(snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17* box || collision(newHead, snake)) {
        gameOver = true;
        clearInterval(game);
        alert("Score: " +score);
        location.reload()
    }

    snake.unshift(newHead);

}

let game = setInterval(draw, 150);