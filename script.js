const copyButton = document.getElementsByClassName('copyClass')[0];
const displayPassword = document.getElementsByClassName('generated-password')[0];
const passwordLength = document.getElementsByClassName('password-length-number')[0];
const lengthBar = document.getElementById('progressBar');
const Allcheckboxes = document.querySelectorAll('.requirements input[type="checkbox"]');
const symbols = '~!@#$%^&*()_+-=/*.,:;?\|';
const strengthIndicator = document.getElementsByClassName('strength-display')[0];
const upperCaseCheck = document.getElementById("Uppercase");
const lowerCaseCheck = document.getElementById("Lowercase");
const numbersCheck = document.getElementById("Numbers");
const symbolsCaseCheck = document.getElementById("Symbols");
const copyMsg = document.getElementById("copyMsg");
const generateBtn = document.getElementsByClassName('generatePassword')[0];


let checkBoxCount = 0;
let password = "";
let passwordKaLength = 1;

handleSlider();

function handleSlider() {
    lengthBar.value = passwordKaLength;
    passwordLength.innerHTML = passwordKaLength;
}

function setIndicator(color) {
    strengthIndicator.style.backgroundColor = color;
    console.log(color);
}


function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandomInteger(0, 9);
}

function getRandomUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function getRandomLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function getRandomSymbols() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCaseCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordKaLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordKaLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

lengthBar.addEventListener('input', () => {
    passwordKaLength = lengthBar.value;
    handleSlider();
});

async function copyContent() {
    try {
        const textToCopy = displayPassword.textContent;
        await navigator.clipboard.writeText(textToCopy);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }

    setTimeout(() => {
        copyMsg.innerText = "";
    }, 2000);
}

copyButton.addEventListener('click', () => {
    if (displayPassword.textContent) {
        copyContent();
    }
});

function handleCheckBoxChange() {
    checkBoxCount = 0;
    Allcheckboxes.forEach((checkBox) => {
        if (checkBox.checked) {
            checkBoxCount++;
        }
    })
}

Allcheckboxes.forEach((checkBox) => {
    checkBox.addEventListener('change', handleCheckBoxChange);
});

function fisherYatesShuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        const temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkBoxCount <= 0) return;

    //if password length is smaller than checked boxes
    if (passwordKaLength < checkBoxCount) {
        passwordKaLength = checkBoxCount;
        handleSlider();
    }

    //find new password
    //remove old password
    password="";

    //Putting the stuff mentioned by checkboxes

    // if(upperCaseCheck.checked){
    //     password+=getRandomUpperCase();
    // }

    // if(lowerCaseCheckCaseCheck.checked){
    //     password+=getRandomLowerCase();
    // }

    // if(symbolsCaseCheck.checked){
    //     password+=getRandomSymbols();
    // }

    // if(numbersCheck.checked){
    //     password+=getRandomNumber();
    // }

    let funcArr=[];

    if(upperCaseCheck.checked){
        funcArr.push(getRandomUpperCase);
    }

    if(lowerCaseCheck.checked){
        funcArr.push(getRandomLowerCase);
    }
    
    if(numbersCheck.checked){
        funcArr.push(getRandomNumber);
    }

    if(symbolsCaseCheck.checked){
        funcArr.push(getRandomSymbols);
    }

    //compulsury addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordKaLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    password=fisherYatesShuffle(Array.from(password));
    password=password.join('');
    displayPasswordGenerated();
    calcStrength();

});

function displayPasswordGenerated(){
    displayPassword.innerText=password;
};