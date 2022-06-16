const beamWidth = 8;
const distance = 5; 

let values = [];

/*
    Initialize p5 Canvas
*/
function setup() {
    createCanvas(windowWidth / 2, windowHeight/1.5);

    values = generateRandomValues(Math.floor(windowWidth / 2 / (beamWidth+distance) -1), 0, windowHeight/2);
    console.log(values.length-1);

    quicksort(values, 0, values.length-1);
}

/*
    Draws contents every frame to canvas
*/
function draw() {
    background(100);

    
    noStroke();
    for(var i = 0; i < values.length; i++) {
        switch(values[i].state) {
            case -1:
                fill("#dddddd");
                break;

            case 0:
                fill("#149e52");
                break;

            case 1:
                fill("#dddddd");
                break;
        }

        rect(distance + (i * beamWidth) + (distance * i), 0, beamWidth, values[i].value, 1);
    }
}


function generateRandomValues(count, min, max) {
    var rndValues = [];
    for(var i = 0; i < count; i++) {
        rndValues[i] = { value: Math.floor(Math.random() * (max - min)) + min, state: -1};
    }
    return rndValues;
}

async function quicksort(values, left, right) {
    if(left >= right) {
        return;
    }

    let index = await partition(values, left, right);
    values[index].state = -1;

    await Promise.all([
        quicksort(values, left, index-1),
        quicksort(values, index+1, right)
    ]);
}

async function partition(values, left, right) {
    for(let j = left; j < right; j++) values[j].state = 1;

    let pivot = values[right].value;
    let i = left;

    for(let j = left; j < right; j++) {
        if(values[j].value < pivot) {
            await swap(values, i, j);
            values[i].state = -1;
            i++;
            values[i].state = 0;
        }
    }

    await swap(values, i, right);

    for(let j = left; j < right; j++) if(j != i) values[j].state = -1;

    return i;
}

async function swap(values, left, right) {
    await new Promise(resolve => setTimeout(resolve, 50));
    let temp = values[left].value;

    values[left].value = values[right].value;
    values[right].value = temp;
}