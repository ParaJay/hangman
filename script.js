const used = [], words = [];
var wrong = 0;
var renderer;
var word;
var over, won;
// var wordsize;
// const wordmap = {};

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context.font = "40px arial";
    }

    render() {
        if(won) {
            this.#drawText("Conglaturations", "green");

            return;
        }

        let h8 = this.height / 8;
        let w8 = this.width / 8;
        
        let baseYStart = h8;
        let baseYEnd = (this.height) - h8;
        
        let baseXStart = w8;
        let baseXEnd = (this.width) - w8;
        
        let midX = baseXStart + ((baseXEnd - baseXStart) / 2);
        
        let circleYStart = baseYStart * 2;
        
        let legYStart = h8 + (this.height / 2);
        let legYEnd = legYStart + w8;
        
        let bodyStart = circleYStart + w8;
        
        let armMid = bodyStart + ((legYStart - bodyStart) / 2);
        
        let limbXStart = baseXEnd - w8;
        let limbXEnd = baseXEnd + w8;

        switch(wrong) {
            case 10 :
                //right arm
                this.#drawLine(baseXEnd, armMid, limbXEnd, armMid);

                this.#drawText(word, "red");
            case 9 :
                //left arm
                this.#drawLine(baseXEnd, armMid, limbXStart, armMid);
            case 8 :
                //right leg
                this.#drawLine(baseXEnd, legYStart, limbXEnd, legYEnd);
            case 7 :
                //left leg
                this.#drawLine(baseXEnd, legYStart, limbXStart, legYEnd);
            case 6 : {
                //body
                this.#drawLine(baseXEnd, bodyStart, baseXEnd, legYStart);
            }
            case 5 : {
                //head
                this.context.beginPath();
                this.context.arc(baseXEnd, circleYStart + (w8 / 2), w8 / 2, 0, Math.PI * 2);
                this.context.stroke();
            }
            case 4 : {
                //head connect
                this.#drawLine(baseXEnd, baseYStart, baseXEnd, circleYStart);
            }
            case 3 :
                //crane extend
                this.#drawLine(midX, baseYStart, baseXEnd, baseYStart);
            case 2 :
                //crane pole
                this.#drawLine(midX, baseYEnd, midX, baseYStart);
            case 1 :
                //crane base
                this.#drawLine(baseXStart, baseYEnd, baseXEnd, baseYEnd);
        }
    }

    #centerTextX(text, xPos = (this.width / 2)) {
        let metrics = this.context.measureText(text);
    
        return xPos - (metrics.width / 2);
    }

    #drawText(text, colour ) {
        let y = (this.height / 16) * 1.5;

        this.context.beginPath();
        this.context.fillStyle = colour;
        this.context.fillText(text, this.#centerTextX(text), y);
        this.context.stroke();
    }

    #drawLine(x1, y1, x2, y2) {
        this.context.beginPath();
        this.context.strokeStyle = "black";
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }
}

window.onload = () => {
    let canvas = document.getElementById("canvas");
    
    renderer = new Renderer(canvas);

    loadDictionaries();

    addListeners();

    word = words[Math.floor(Math.random() * (words.length - 1))].toUpperCase();

    renderer.render();
}

function loadDictionaries() {
    let dat = document.getElementById("5");

    let data5 = dat.contentDocument.body.childNodes[0].innerHTML;
    let datarray = data5.split("\n");

    datarray.forEach(e => {
        if(e.match("[a-zA-Z]*")) {
            words.push(e); //only include words without special characters or spaces
        }
    });

    document.body.removeChild(dat);
}

function addListeners() {
    const alphabet = "QWERTYUIOPASDFGHJKLZXCVBNM";

    alphabet.split("").forEach(e => {
        let button = document.getElementById(e);

        button.onclick = (event) => {
            if(tryKey(e)) {
                button.style.backgroundColor = "darkgray";
            }
        }
    })
}

function tryKey(key) {
    if(used.includes(key) || over) {
        return false;
    }

    used.push(key);

    if(word.includes(key)) {
        let display = document.getElementById("attempt");
        let text = display.innerText;
        let recon = "";

        for(let i = 0; i < word.length; i++) {
            let char = word.charAt(i);

            if(char === key.charAt(0)) {
                recon += char + " ";
            } else {
                recon += text.charAt(i * 2) + " ";
            }
        }

        display.innerText = recon.trim();
    } else {
        wrong++;

        renderer.render();
    }

    checkEnd();
    
    return true;
}

function recon(s) {
    let res = "";

    for(let i = 0; i < s.length; i++) {
        if(i % 2 == 0) {
            res += s.charAt(i);
        }
    }

    return res;
}

function checkEnd() {
    let e = document.getElementById("attempt").innerText;

    if(recon(e) == word) {
        over = true;
        won = true; 
    }
    
    if(wrong == 10 && !won) {
        over = true;
    }

    if(over) {
        renderer.render();
    }
}