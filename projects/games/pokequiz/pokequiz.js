

class PokeGame {
    constructor() {
        this.pokemon = Pokemon;
        this.container = document.querySelector('.pokemon-container');
        this.generateTextFields();
        this.timer = undefined;
        this.maxTime = 600; //600 secs = 10 Min
        this.points = 0;
    }

    reset() {
        this.container.innerHTML = "";
        this.pokemon = Pokemon;
        this.maxTime = 600;
        this.points = 0;

        if(this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }

        this.generateTextFields();
    }

    generateTextFields() {

        for(var i = 0; i < this.pokemon.length; i++) {
            let elem = document.createElement("div");
            elem.classList.add('poke-field');
            elem.classList.add('bg-dark');
            elem.classList.add('font-darkmode-white');
            elem.id = `${this.pokemon[i].Deutsch}_${this.pokemon[i].Nummer}`;
            this.container.appendChild(elem);
            elem.innerText = `${this.pokemon[i].Nummer}.`
        }
    }

    clearTextFields() {
        document.querySelectorAll('.poke-field').forEach(e => {
            e.innerHTML = "";
        });
    }

    start() {
        if(this.timer !== undefined) return;
        this.reset();

        this.startTime = Date.now();

        this.toggleButtons(true);

        let seconds = 0;
        this.timer = setInterval(() => {
            seconds++;

            let mins = Math.floor(seconds/60);
            let secs = Math.floor(seconds%60);
            let timer = document.getElementById('timer');
            timer.innerText = `${mins < 10 ? "0" + mins : mins}:${secs < 10 ? "0" +secs : secs}`;
            if(seconds >= this.maxTime - (this.maxTime / 10)) {
                //only 10 percent of time left
                timer.style.color = "#a33e3e";
            }

            if(seconds >= this.maxTime) {
                //time has ended
                this.end();
            }
        }, 1000);
    }

    checkIfValid(input) {
        let pokemon = undefined;
        switch(input.toLowerCase()) {
            case "nidoran":
                pokemon = this.pokemon.find(e => e.Deutsch === 'Nidoran♀');
                if(!this.updatePokemon(pokemon)) this.points++;
                else return;
        
                pokemon = this.pokemon.find(e => e.Deutsch === 'Nidoran♂');
                if(!this.updatePokemon(pokemon)) this.points++;
                else return;
                break;
                
            default:
                pokemon = this.pokemon.find(p => p.Deutsch.toLowerCase() === input.toLowerCase());
                if(pokemon === undefined) return; //no valid input
                if(!this.updatePokemon(pokemon)) this.points++;
                else return;
                break;
        }

        document.getElementById('inputfield').value = "";
        document.getElementById('points').innerHTML = `${this.points}/${this.pokemon.length}`;
        if(this.points === this.pokemon.length) this.end();
    }

    updatePokemon(pokemon) {
        let elem = document.getElementById(`${pokemon.Deutsch}_${pokemon.Nummer}`);
        if(!elem.classList.contains("finished")) {
            elem.classList.add('finished');
            elem.innerText = `${pokemon.Nummer}. ${pokemon.Deutsch}`;
            return false;
        }
        return true;
    }

    end() {
        if(this.timer === undefined) return;
        clearInterval(this.timer);
        this.timer = undefined;

        this.toggleButtons(false);
        this.fillInMissingPokemons();

        if(this.points === this.pokemon.length) {
            //Alle erraten
            alert("Du bist ein wahrer Pokemeister!");
        } else if(this.points <= 25) {
            alert(`Du hast ${this.points} von ${this.pokemon.length} Pokemon erraten.\nProfessor Eich wäre enttäuscht.`);
        } else if(this.points <= 75) {
            alert(`Du hast ${this.points} von ${this.pokemon.length} Pokemon erraten.\nDu solltest dir den Pokedex nocheinmal anschauen!`);
        } else if(this.points <= 125) {
            alert(`Du hast ${this.points} von ${this.pokemon.length} Pokemon erraten.\nSchon gut aber es geht noch besser!`);
        } else {
            alert(`Du hast ${this.points} von ${this.pokemon.length} Pokemon erraten.\nJeder macht mal Fehler. Guter Versuch!`);
        }
    }

    fillInMissingPokemons() {
        for(var i = 0; i < this.pokemon.length; i++) {
            let elem = document.getElementById(`${this.pokemon[i].Deutsch}_${this.pokemon[i].Nummer}`);
            if(!elem.classList.contains('finished')) {
                elem.innerText = `${this.pokemon[i].Nummer}. ${this.pokemon[i].Deutsch}`;
                elem.classList.add('failed');
            }
        }
    }

    toggleButtons(started) {
        document.getElementById('playbutton').hidden = started;
        document.getElementById('poke_input').hidden = !started;
        document.getElementById('giveup').hidden = !started;
    }
}

const game = new PokeGame();


function startGame() {
    game.start();
}

function endGame() {
    game.end();
}

function checkInput(input) {
    game.checkIfValid(input);
}