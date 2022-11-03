
class Entity {
    constructor(_x, _y, _width, _height, _color = "#fff") {
        this.position = { x: _x, y: _y};
        this.width = _width;
        this.height = _height;
        this.velocity = { x: 0, y: 0};
        this.color = _color;
    }

    update(ctx) {
        this.move();
        this.draw(ctx);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        ctx.rect(
            this.position.x - this.width/2, 
            this.position.y - this.height/2, 
            this.width, 
            this.height
        );
        ctx.fill();
    }

    move() {
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y
        }
    }
}

class Brick extends Entity {
    constructor(_x, _y, _width, _height, _hardness = 1) {
        super(_x, _y, _width, _height, "#149e52");
        this.hardness = _hardness;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();

        ctx.rect(
            this.position.x - this.width/2, 
            this.position.y - this.height/2, 
            this.width, 
            this.height
        );
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#bbb";
        ctx.beginPath();
        ctx.rect(
            this.position.x - this.width/2, 
            this.position.y - this.height/2, 
            this.width, 
            this.height
        )
        ctx.stroke();
    }
}

class Player extends Entity {
    constructor(_x, _y, _width, _height) {
        super(_x, _y, _width, _height, "#f00");
        this.pressedKeys = { "left": false, "right": false };
        this.speed = 2;
        this.#addKeyboardListeners();
    }

    #addKeyboardListeners() {
        document.onkeydown = (e) => {
            switch(e.key) {
                case "ArrowLeft":
                case "A":
                    this.pressedKeys["left"] = true;
                    break;

                case "ArrowRight":
                case "D":
                    this.pressedKeys["right"] = true;
                    break;
            }
        }

        document.onkeyup = (e) => {
            switch(e.key) {
                case "ArrowLeft":
                case "A":
                    this.pressedKeys["left"] = false;
                    break;

                case "ArrowRight":
                case "D":
                    this.pressedKeys["right"] = false;
                    break;
            }
        }
    }

    update(ctx) {
        this.calculateVelocity();
        super.update(ctx);
    }

    calculateVelocity() {
        if(this.pressedKeys["left"] && !this.pressedKeys["right"]) {
            this.velocity.x = this.speed * -1;
        }
        else if(!this.pressedKeys["left"] && this.pressedKeys["right"]) {
            this.velocity.x = this.speed;
        }
        else this.velocity.x = 0;
    }
}

class Ball extends Entity {
    constructor(_x, _y, _width, _height) {
        super(_x, _y, _width, _height, "#fff");
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.width/2, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById("canvas_breakout");
        this.ctx = this.canvas.getContext('2d');

        //this.canvas.width = window.innerWidth * 0.5;
        //this.canvas.height = window.innerHeight;

        this.entities = [];
        this.entities.push(new Player(this.canvas.width/2, this.canvas.height*0.95, 150, 20));
        this.entities.push(new Ball(this.canvas.width/2, this.canvas.height *0.8, 20, 20));
        this.loadLevel(level);
        this.lives = 3;

        this.update();
    }

    update() {
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.entities.forEach(e => e.update(this.ctx));
    }

    loadLevel(level) {
        for(var i = 0; i < level.length; i++) {
            for(var j = 0; j < level[i].length; j++) {
                if(level[i][j] !== "") {

                    
                    const spaceTop = 60;
                    const spaceLeftRight = 0;
                    const gap = 0;
                    // const width = ((this.canvas.width - spaceLeftRight) - (gap * (level[i].length-1))) / level[i].length;
                    const width = this.canvas.width / level[i].length;
                    const height = 20;

                    this.entities.push(
                        new Brick(
                            spaceLeftRight/2 + j * width + gap * j + width/2,
                            spaceTop + (gap * (i+1)) + (height * i) + height/2,
                            width,
                            height
                        ));
                }
            }
        }
        console.log( {width: this.canvas.width});
        console.table(this.entities);
    }
}

const level = [
    ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
    ["X", "", "X", "", "X", "", "X", "", "X", ""],
    ["", "X", "", "X", "", "X", "", "X", "", "X"],
    ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
    ["", "X", "", "X", "", "X", "", "X", "", "X"],
    ["X", "", "X", "", "X", "", "X", "", "X", ""],
]

const game = new Game();

gameloop();
function gameloop() {
    game.update();

    requestAnimationFrame(gameloop);
}

