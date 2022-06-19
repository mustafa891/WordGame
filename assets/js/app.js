import {
    words
} from "./data.js";

const startBtn = document.getElementById("start");
const scoreDisplay = document.querySelector("#score");
const correctDisplay = document.getElementById("correct");
const timeDisplay = document.querySelector("#time")

let inputs, charactersBtn;

let shuffleWords, shuffleChars, wordIndex, score, inputIndex;
let selectedInput = [];
let running = false;

function startGame() {

    document.querySelector(".menu").classList.add("d-none")
    document.querySelector(".game").classList.remove("d-none")

    localStorage.clear();
    shuffleWords = words.sort(() => Math.random() - 0.5);

    running = true

    wordIndex = 0;
    score = 0;
    inputIndex = 0;

    displayWords();

    // declare inputs and charsBtn
    inputs = document.querySelectorAll(".inputs input");;
    charactersBtn = document.querySelectorAll(".characters button");

    timer()
    characters()
    Inputs()
    selectInput();
    checkWord()
}


function displayWords() {

    const inputContainer = document.querySelector(".inputs");
    const charContainer = document.querySelector(".characters");

    let currentWord;

    // if game end stop this 
    if (running && wordIndex != words.length) {

        currentWord = shuffleWords[wordIndex];
        shuffleChars = Array.from(currentWord).sort(() => Math.random() - 0.5);
        shuffleChars = Array.from(currentWord).sort(() => Math.random() - 0.5);


        // if shuffleChars  == currentWord
        if (currentWord == shuffleChars.toString().replaceAll(",", "")) {
            shuffleChars = Array.from(currentWord).sort(() => Math.random() - 0.5);
        }

        let inputs = "";
        let chars = "";

        shuffleChars.forEach(char => {
            inputs += '<input type="text" maxlength="1">';
            chars += `<button class="btn btn-outline-white" value="${char}">${char}</button>`;
        });

        inputContainer.innerHTML = inputs;
        charContainer.innerHTML = chars;

    }
}

function characters() {

    const deleteBtn = document.getElementById("delete")

    charactersBtn.forEach(char => {
        char.onclick = () => {

            if (inputIndex >= inputs.length) inputIndex = 0;

            if (selectedInput == "" && inputs[inputIndex] != undefined) {
                inputs[inputIndex].setAttribute("last_value", char.getAttribute('value'));
                let charValue = char.getAttribute("value");
                inputs[inputIndex].value = charValue;
                char.setAttribute("disabled", true);
                inputIndex += 1;
            } else {


                inputIndex = Array.from(inputs).indexOf(selectedInput);
                selectedInput.value = char.getAttribute("value");
                char.setAttribute("disabled", true);
                selectedInput = "";
                inputIndex += 1;

            }

        }
    });


    // delete btn 

    let pressed = false;
    deleteBtn.addEventListener("click", () => {
        pressed = true;

        if (inputIndex <= 0) return;
        if (!pressed) return;

        inputIndex -= 1;
        console.log(inputIndex);
        let chars = Array.from(charactersBtn).filter((char) => {
            if (char.getAttribute("value") == inputs[inputIndex].getAttribute("last_value")) {
                char.removeAttribute("disabled");
            }
        });
        inputs[inputIndex].value = "";
        pressed = false;

    });

}

function Inputs() {

    let first_press = false;

    inputs.forEach((input, i) => {

        input.addEventListener("keyup", (e) => {
            let key = "";

            if (shuffleChars.includes(e.key)) {
                key = e.key;
                input.setAttribute("last_value", key);
            }
            inputIndex += 1;

            let char = Array.from(charactersBtn).filter((char) => {
                if (char.getAttribute("value") == input.getAttribute("last_value")) {
                    return char;
                }
            });

            // disabled btn 
            if (char && key != "") {

                char = char.filter((char) => {
                    if (!char.hasAttribute("disabled")) return char;
                })

                if (inputs[i + 1] != undefined) {
                    inputs[i + 1].focus()
                }

                if (char.length == 0) return;
                char[0].setAttribute("disabled", true)
            }

            if (e.key == "Backspace") {

                // db press backspace key
                dbPress(e.key, "Backspace", () => {
                    if (inputs[i - 1] == undefined) return;
                    inputs[i - 1].focus()
                });

                char = char.filter((char) => {
                    if (char.hasAttribute("disabled")) return char;
                });

                if (char.length == 0) return;
                char[0].removeAttribute("disabled");
            }

            dbPress(e.key, "ArrowRight", () => {
                inputs[i + 1].focus()
            });

            dbPress(e.key, "ArrowLeft", () => {
                if (i == 0) return;
                inputs[i - 1].focus()
            });

        })

    });


    function dbPress(key, str, callBack) {
        if (key == str) {
            if (first_press) {
                first_press = false
                callBack()
            } else {
                first_press = true;
                window.setTimeout(() => first_press = false, 4000);
            }
        }
    }


}

function nextWord() {
    wordIndex += 1;
    inputIndex = 0;
    console.log(wordIndex);

    displayWords();

    // declare inputs and charsBtn
    inputs = document.querySelectorAll(".inputs input");;
    charactersBtn = document.querySelectorAll(".characters button");
    correctDisplay.textContent = "";

    characters()
    Inputs()
    selectInput();
    checkWord()
}

function selectInput() {
    for (let input of inputs) {
        input.onclick = () => {
            selectedInput = input
        }
    }
    return selectedInput;
}

function checkWord() {

    let id = setInterval(() => {

        let answer = toStr(Array.from(inputs).map((input) => input.value))
        const word = toStr(words[wordIndex]);

        if (words.length == wordIndex) {
            gameEnd();
            clearInterval(id);
            return;
        }

        if (answer.length == word.length) {
            if (word == answer) {

                score += 1;
                styleInput("2dce89")
                scoreDisplay.textContent = score;
            } else {
                styleInput("f5365c")
                correctDisplay.textContent = words[wordIndex];
            }

            setTimeout(nextWord, 1000);
            clearInterval(id)
        }

    });

    function styleInput(code) {
        Array.from(inputs).map((input) => {
            input.style.borderBottom = `solid #${code} 3px`;
        });
    }


    function toStr(array) {
        let text = "";
        if (array == undefined) return;
        for(var  ar of array) {
            text += ar;
        }
        return ar;
    }
}

function timer() {


    let startTime = Date.now()
    let min, sec;
    let timeLeft = 0;

    setInterval(() => {

        timeLeft = Date.now() - startTime;

        min = Math.floor(Math.round(timeLeft / 1000 % 60));
        sec = Math.floor(Math.round(timeLeft / (1000 * 60) % 60));

        min = pad(min)
        sec = pad(sec)

        timeDisplay.textContent = `${sec}:${min}`

        function pad(val) {
            return val <= 9 ? `0${val}` : val;
        }

    }, 1000);

}

function gameEnd() {
    localStorage.setItem("data", JSON.stringify({
        'words': words.length,
        'score': score,
        'time': timeDisplay.textContent,
    }));
    window.location.href = "result.html";
}

// event


startBtn.addEventListener("click", startGame);