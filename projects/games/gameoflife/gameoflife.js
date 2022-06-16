class Grid {
    constructor(_canvas, _ctx) {
        this.canvas = _canvas;
        this.context = _ctx;
        this.cellSize = Cell.size;
        this.cellsX = this.canvas.width / this.cellSize;
        this.cellsY = this.canvas.height / this.cellSize;
        this.active = false;
    }

    draw() {
        if(!this.active) return;
        if(this.cellSize != Cell.size) {
            this.cellSize = Cell.size;
            this.cellsX = this.canvas.width / this.cellSize;
            this.cellsY = this.canvas.height / this.cellSize;
        }
        
        this.context.fillStyle = "#555555";
        
        //this.context.fillRect(0, 0, 50, 50);

        for(let x = 0; x < this.cellsX; x++) {
            this.context.fillRect(x * this.cellSize, 0, 1, this.cellSize * this.cellsY);
        }

        for(let y = 0; y < this.cellsY; y++) {
            this.context.fillRect(0, y * this.cellSize, this.cellSize * this.cellsX, 1);
        }
    }
}

class Cell {
    static size = 10;

    constructor(_ctx, _x, _y) {
        this.x = _x;
        this.y = _y;
        this.context = _ctx;

        //this.isAlive = false;
        this.isAlive = Math.random() > 0.5;
    }

    draw() {
        this.context.fillStyle = this.isAlive ? "#3e9ccf" : "#303030";
        this.context.fillRect(this.x * Cell.size, this.y * Cell.size, Cell.size, Cell.size);
    }
}

class Game {
    constructor(_canvas) {
        this.canvas = _canvas;
        this.context = this.canvas.getContext('2d');
        this.gameObjects = [];
        this.paused = true;
        this.drawNext = false;
        this.currentGeneration = 0;

        this.initialize();

        window.requestAnimationFrame(() => this.update(true));
    }

    initialize() {
        var rows = this.canvas.height / Cell.size;
        var columns = this.canvas.width / Cell.size;

        for(var y = 0; y < rows; y++) {
            for(var x = 0; x < columns; x++) {
                this.gameObjects.push(new Cell(this.context, x, y));
            }
        }

        this.grid = new Grid(this.canvas, this.context);
    }

    clearGrid() {
        this.pause(true);
        for(let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].isAlive = false;
            this.gameObjects[i].nextAlive = false;
        }
        
        this.drawCurrentGeneration();
    }

    repopulate() {
        this.pause(true);
        this.gameObjects = [];

        this.currentGeneration = 0;
        //document.getElementById("cur_gen").innerHTML = "Current Generation: " +this.currentGeneration;

        this.initialize();
        this.drawNext = true;
    }

    update(ignorePause) {
        if(!this.paused || ignorePause || this.drawNext) {
            this.drawNext = false;
            this.updateCells();
            this.currentGeneration++;

            //document.getElementById("cur_gen").innerHTML = "Current Generation: " +this.currentGeneration;

            this.drawCurrentGeneration();
        }

        setTimeout(() => {
            window.requestAnimationFrame(() => this.update(false));
        }, 100);
    }

    updateCells() {
        var rows = this.canvas.height / Cell.size;
        var columns = this.canvas.width / Cell.size;

        for(let x = 0; x < columns; x++) {
            for(let y = 0; y < rows; y++) {
                //Check nearby 8 cells and count active cells
                let aliveCount = this.isCellAlive(x-1, y-1) + this.isCellAlive(x, y-1) + this.isCellAlive(x+1, y-1) +this.isCellAlive(x-1, y) +this.isCellAlive(x+1, y) +this.isCellAlive(x-1, y+1) +this.isCellAlive(x, y+1) +this.isCellAlive(x+1, y+1);
                let cellIndex = this.gridToIndex(x, y);

                if(aliveCount == 2) {
                    //cell stays alive
                    this.gameObjects[cellIndex].nextAlive = this.gameObjects[cellIndex].isAlive;
                } else if(aliveCount == 3) {
                    //cell being born
                    this.gameObjects[cellIndex].nextAlive = true;
                } else {
                    //cell dies
                    this.gameObjects[cellIndex].nextAlive = false;
                }
            }
        }

        for(let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].isAlive = this.gameObjects[i].nextAlive;
        }
    }

    drawCurrentGeneration() {
        //drawing
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
        for(let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        if(this.grid != undefined) {
            this.grid.draw();
        }
    }

    pause(state) {
        this.paused = state;

        let btn = document.getElementById('btn_toggleGame');
        btn.value = game.paused ? "▶ Start" : "= Pause";
    }

    gridToIndex(x, y) {
        var columns = this.canvas.width / Cell.size;
        return parseInt(x + (y * columns));
    }

    coordsToGrid(x, y) {
        return { x: parseInt(x / Cell.size), y: parseInt(y / Cell.size)};
    }

    isCellAlive(x, y) {
        var rows = this.canvas.height / Cell.size;
        var columns = this.canvas.width / Cell.size;
        if(x < 0 || x >= columns || y < 0 || y >= rows) return false;
        else {
            let index = this.gridToIndex(x,y);
            return this.gameObjects[index].isAlive; 
        }
    }
}

let game = undefined;

const mouse = {
    isPressed: false,
    x: -1,
    y: -1
}

window.onload = () => {
    const canvas = document.querySelector('canvas');
    game = new Game(canvas);

    canvas.addEventListener('mousedown', function(e) {
        mouse.isPressed = true;
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        var grid = game.coordsToGrid(x, y);
        console.log(`x: ${x}, y: ${y}, gx: ${grid.x}, gy: ${grid.y} index: ${game.gridToIndex(grid.x, grid.y)}, length: ${game.gameObjects.length}`);
        game.gameObjects[game.gridToIndex(grid.x, grid.y)].isAlive = !game.gameObjects[game.gridToIndex(grid.x, grid.y)].isAlive;
        game.gameObjects[game.gridToIndex(grid.x, grid.y)].draw();

        if(game.grid !== undefined) {
            game.grid.draw();
        }
    })

    canvas.addEventListener('mouseup', function(e) {
        mouse.isPressed = false;
    })

    canvas.addEventListener('mousemove', function(e) {
        if(mouse.isPressed) {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            var grid = game.coordsToGrid(x, y);
            console.log(`x: ${x}, y: ${y}, gx: ${grid.x}, gy: ${grid.y} index: ${game.gridToIndex(grid.x, grid.y)}, length: ${game.gameObjects.length}`);
            game.gameObjects[game.gridToIndex(grid.x, grid.y)].isAlive = true;
            game.gameObjects[game.gridToIndex(grid.x, grid.y)].draw();

            if(game.grid !== undefined) {
                game.grid.draw();
            }
        }
    })
}

function toggleGame() {
    if(game == undefined) return;
    game.pause(!game.paused);
}

function clearField() {
    if(game == undefined) return;
    game.clearGrid();
}

function nextGeneration() {
    if(game == undefined) return;
    game.drawNext = true;
}

function regenerate() {
    if(game == undefined) return;
    game.repopulate();
}

function toggleGrid() {
    if(game == undefined || game.grid == undefined) return;
    game.grid.active = !game.grid.active;
    game.drawCurrentGeneration();
}

function logGrid() {
    console.log(JSON.stringify(game.gameObjects));
}