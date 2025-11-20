import { Mole } from './Mole.js';
// Centrera eventhantering via delegering på brädet (se vecko-materialet om addEventListener & bubbling).
// TODO-markeringar lämnar utrymme för egna lösningar.
export class Game {
    constructor({ boardEl, scoreEl, timeEl, missesEl }) {
        this.boardEl = boardEl;
        this.scoreEl = scoreEl;
        this.timeEl = timeEl;
        this.missesEl = missesEl;
        this.gridSize = 3;
        this.duration = 60; // sekunder
        this.state = { score: 0, misses: 0, timeLeft: this.duration, running:false };
        this._tickId = null;
        this._spawnId = null;
        this._activeMoles = new Set();
        this.handleBoardClick = this.handleBoardClick.bind(this);
    }
    init() {
        this.createGrid(this.gridSize);
        this.updateHud();
// Eventdelegering: en lyssnare hanterar alla barn-noder.
        this.boardEl.addEventListener('click', this.handleBoardClick);
        this.boardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this.handleBoardClick(e);
    });
    }
    createGrid = (size = 3) => {
        this.boardEl.innerHTML = '';
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.setAttribute('aria-label', `Hål ${i + 1}`);
            this.boardEl.appendChild(cell);
        }
    }
    start() {
        if (this.state.running) return;

        this.state.running = true;
        this.state.score = 0;
        this.state.misses = 0;
        this.state.timeLeft = this.duration;
        this.updateHud();
// TODO: implementera spelloop
// 1) setInterval: nedräkning av timeLeft
// 2) setInterval eller rekursiva setTimeout: spawn av mullvadar (varieraTTL/frekvens över tid)
        
        let tickCount = 0;
        let interval = setInterval(() => {
            if(this.state.timeLeft > 0){
                tickCount = tickCount + 30;
                this.spawnMole(750-tickCount);
                this.state.timeLeft -= 3;
            }else{
                alert("Game over")
                this.state.running = false;
                clearInterval(interval);
            }
            this.updateHud();
        }, (750 -tickCount));
    }
    reset() {
        this.state.timeLeft = 0;
        this.state.running = false;
        this.state.score = 0;
        this.state.misses = 0;
        this.init();
        
        // TODO: städa timers, ta bort aktiva mullvadar, nollställ state och UI
        // Tips: loopa this._activeMoles och kalla .disappear()

    }
    spawnMole(ttl) {
    // TODO: välj slumpmässig tom cell och mounta en ny Mole
        const emptyCells = [...this.boardEl.querySelectorAll('.cell:not(.has-mole)')];
        const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const mole = new Mole(cell, ttl);
        this._activeMoles.add(mole);
        mole.appear(() => { this._activeMoles.delete(mole); /* miss om utgång utan träff? */ });
    }
    handleBoardClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell || !this.state.running) return;
// TODO: om cellen innehåller en aktiv mullvad => poäng; annars öka missar
// Uppdatera HUD varje gång.
        
        //Om en cell har klassen "has-mole", score++ annars misses++.
        if(cell.classList.contains('has-mole')){
            this.state.score++;
        }else{
            this.state.misses++;
        }
        this.updateHud();
    }
    updateHud() {
        this.scoreEl.textContent = `Poäng: ${this.state.score}`;
        this.timeEl.textContent = `Tid: ${this.state.timeLeft}`;
        this.missesEl.textContent = `Missar: ${this.state.misses}`;
    }
}