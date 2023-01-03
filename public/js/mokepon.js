// Functions from index
const showSectionAttack = document.getElementById("choose-atack")
const showSectionRestart = document.getElementById("restart")
const selectMokepon = document.getElementById("select-mokepon")

const spanPlayer = document.getElementById("player-life")
const spanEnemy = document.getElementById("enemy-life")

const resultAttack = document.getElementById("show-result")
const showEnemyAttack = document.getElementById("enemy-attacks")
const showPlayAttack = document.getElementById("player-attacks")

const inputEnemy = document.getElementById("enemy-mokepon")
const inputYourMokepon = document.getElementById("your-mokepon")

const showSectionSelect = document.getElementById("choose-mokepon")
const cardsContainer = document.getElementById("card_container")
const containerAttacks = document.getElementById("attacks-container")
//Consts for canvas
const canvasMap = document.getElementById("canvas-map")
const onlyMap = document.getElementById("map")

let jugadorId = null
let enemigoId = null
let mokeponesEnemigos = []
// Variables for canvas
let panel = map.getContext("2d")
let interval
let mokeponObject
let nameOfEnemy
let mokemap = new Image()
mokemap.src = "./assets/img/mokemap.png"
let heightOfMap
let mapWidth = window.innerWidth -20
const maxMapWidth = 350
if (window.width > maxMapWidth) {
    heightOfMap = maxMapWidth - 20
}
heightOfMap = mapWidth * 600 / 800

onlyMap.width = mapWidth
onlyMap.height = heightOfMap

// Class and Objects
let mokepones = []
let mokeponesOptions
let mokeponesAttacks

class Mokepon {
    constructor(name, image, life, sigmaImage, id=null) {
        this.id = id
        this.name = name
        this.image = image
        this.life = life
        this.attacks = []
        this.width = 40
        this.height = 40
        this.x = random(0, onlyMap.width - this.width)
        this.y = random(0, onlyMap.height - this.height)
        this.mapImg = new Image()
        this.mapImg.src = sigmaImage
        this.speedX = 0
        this.speedY = 0
    }

    paintMokepon(){
        panel.drawImage(
            this.mapImg,
            this.x,
            this.y,
            this. width,
            this.height
        )
    }
}
let hipoge = new Mokepon("Hipoge", "./assets/img/hipodoge.png", 5, "./assets/img/head_hipodoge.png")
let capipepo = new Mokepon("Capipepo", "./assets/img/capipepo.png", 5, "./assets/img/head_capipepo.png")
let ratigueya = new Mokepon("Ratigueya", "./assets/img/ratigueya.png", 5, "./assets/img/head_ratigueya.png")

const HIPODOGE_ATAQUES = [
    {name: "💧", id: "water-attack"},
    {name: "💧", id: "water-attack"},
    {name: "💧", id: "water-attack"},
    {name: "🔥", id: "fire-attack"},
    {name: "🌱", id: "ground-attack"},
]

hipoge.attacks.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    {name: "🌱", id: "ground-attack"},
    {name: "🌱", id: "ground-attack"},
    {name: "🌱", id: "ground-attack"},
    {name: "💧", id: "water-attack"},
    {name: "🔥", id: "fire-attack"},
]

capipepo.attacks.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    {name: "🔥", id: "fire-attack"},
    {name: "🔥", id: "fire-attack"},
    {name: "🔥", id: "fire-attack"},
    {name: "💧", id: "water-attack"},
    {name: "🌱", id: "ground-attack"},
]

ratigueya.attacks.push(...RATIGUEYA_ATAQUES)

mokepones.push(hipoge, capipepo, ratigueya)
// This is a validator to rewrite only if we first choose a Mokepon
let validatorMokeponChoosen = 0
let result
let inputHipoge
let inputCapipepo
let inputRatigueya
let fireButton
let waterButton
let groundButton
let attacksEnemyMokepon = []
let buttons
let playerIndex
let enemyIndex

// Global vars for attacks
let playerAttack = []
let enemyAttack = []
let playerPet

// Global vars for lifes
let playerVictories = 0
let enemyVictories = 0

// This is the main function
function startPage() {
    // Hide the attack selection section
    showSectionAttack.style.display = 'none'
    showSectionRestart.style.display = 'none'
    canvasMap.style.display = 'none'    
    //Create Mokepones
    mokepones.forEach((mokepon) => {
        mokeponesOptions = `
        <div class="cards__section">
                <input type="radio" name="mokepon" id=${mokepon.name}>
                <label for=${mokepon.name} class="choose-mokepon__label">
                <p>${mokepon.name}</p>
                    <img src=${mokepon.image} alt=${mokepon.name}>
                </label>
            </div>
        `
    cardsContainer.innerHTML += mokeponesOptions
    inputHipoge = document.getElementById("Hipoge")
    inputCapipepo = document.getElementById("Capipepo")
    inputRatigueya = document.getElementById("Ratigueya")
    })
    // Select a Mokepon
    selectMokepon.addEventListener("click", checkMokepon)
    // Reload the page
    showSectionRestart.addEventListener("click", reloadPage)

    joinToGame()
}

function joinToGame() {
    fetch("http://192.168.1.9:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
}

// This function allows to choose a Mokepon and then choose the enemy's Mokepon
function checkMokepon() {
    let choosen = 1

    if (inputHipoge.checked) {
        inputYourMokepon.innerText = inputHipoge.id
        playerPet = inputHipoge.id
    } else if (inputCapipepo.checked) {
        inputYourMokepon.innerText = inputCapipepo.id
        playerPet = inputCapipepo.id
    } else if (inputRatigueya.checked) {
        inputYourMokepon.innerText = inputRatigueya.id
        playerPet = inputRatigueya.id
    } else {
        alert("Escoge un Mokepon valido")
        choosen = 0
    }
    sendMokeponSelected(playerPet)
    if (choosen == 1) {
        validatorMokeponChoosen = 1
        canvasMap.style.display = 'flex'
        startCanvas()
        extractAttack(playerPet)
        showSectionSelect.style.display = 'none'
    }
}

function sendMokeponSelected(mascotaJugador) {
    fetch(`http://192.168.1.9:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}

function validationOfIndex(player, enemy) {
    playerIndex = playerAttack[player]
    enemyIndex = enemyAttack[enemy]
}

// Logic to decide who's the winner
function figth() {
    clearInterval(interval)

    for (let i = 0; i < playerAttack.length; i++) {
        if (playerAttack[i] == enemyAttack[i]) {
            validationOfIndex(i, i)
            rewrite()
            result = "Empate"
        } else if (playerAttack[i] == "fuego" && enemyAttack[i] == "tierra") {
            validationOfIndex(i,i)
            rewrite()
            playerVictories++
            spanPlayer.innerText = playerVictories
            result = "Ganaste"
        } else if (playerAttack[i] == "agua" && enemyAttack[i] == "fuego") {
            validationOfIndex(i, i)
            rewrite()
            playerVictories++
            spanPlayer.innerText = playerVictories
            result = "Ganaste"
        } else if (playerAttack[i] == "tierra" && enemyAttack[i] == "agua") {
            validationOfIndex(i, i)
            rewrite()
            playerVictories++
            spanPlayer.innerText = playerVictories
            result = "Ganaste"
        } else {
            validationOfIndex(i, i)
            rewrite()
            enemyVictories++
            spanEnemy.innerText = enemyVictories
            result = "Perdiste"    
        }
    }
    return result
}

// Check for player's life
function checkLife() {
    if (playerVictories == enemyVictories) {
        finalRewrite("Este es un empate!!! 🤝")
    } else if (playerVictories > enemyVictories){
        finalRewrite("FELICIDADES!!, Ganaste!! 😉")
    } else {
        finalRewrite("ESTE ES EL FIN!!, Perdiste!! 😨")
    }
}

// Enemy's atacks
function selectEnemyAttack() {
    let randomAttack = random(0, attacksEnemyMokepon.length -1)

    if (randomAttack == 0 || randomAttack == 1) {
        enemyAttack.push("fuego")
    } else if (randomAttack == 3 || randomAttack == 4) {
        enemyAttack.push("agua")
    } else {
        enemyAttack.push("tierra")
    }
    console.log(enemyAttack)
    startFigth()
}

function startFigth() {
    if (playerAttack.length == 5) {
        figth()
    }
}

// Rewriting messages about attacks choosen
function rewrite() {    
    if (validatorMokeponChoosen == 1) {
        let newEnemyAttack = document.createElement("p")
        let newPlayerAttack = document.createElement("p")

        resultAttack.innerHTML = result
        newEnemyAttack.innerText = enemyIndex
        newPlayerAttack.innerText = playerIndex

        showEnemyAttack.appendChild(newEnemyAttack)
        showPlayAttack.appendChild(newPlayerAttack)
        checkLife()
    } else {
        alert("Primero escoge un Mokepon")
    }
}

// Write a final message
function finalRewrite(text) {
    resultAttack.innerText = text
    // Show button to restart
    showSectionRestart.style.display = 'block'
}

// Function for reload the page
function reloadPage() {
    location.reload()
}

function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min)
}

// Logic to choose a random Mokepon
function checkMokeponEnemy(enemy) {
    inputEnemy.innerText = enemy.name
    attacksEnemyMokepon = enemy.attacks
    attackSequence()
}

// Create attack's buttons
function renderingButtons(attacks) {
    attacks.forEach((attack) => {
        mokeponesAttacks = `
        <button id=${attack.id} class="attack-button all-buttons-attack">${attack.name}</button>
        `
        containerAttacks.innerHTML += mokeponesAttacks
    })
    fireButton = document.getElementById("fire-attack")
    waterButton = document.getElementById("water-attack")
    groundButton = document.getElementById("ground-attack")
    buttons = document.querySelectorAll(".all-buttons-attack")
}

function attackSequence() {
    buttons.forEach((button) => {
        button.addEventListener("click", (evento) => {
            // Select an attack to our Mokepon
            if (evento.target.textContent === "🔥") {
                playerAttack.push("fuego")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            } else if (evento.target.textContent === "💧") {
                playerAttack.push("agua")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            } else {
                playerAttack.push("tierra")
                console.log(playerAttack)
                button.style.background = "#112f58"
                button.disabled = true
            }
            if (playerAttack.length === 5) {
                sendAttacks()
            }
        })
    })
}

function sendAttacks() {
    fetch(`http://192.168.1.9:8080/mokepon/${jugadorId}/ataques`,{
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: playerAttack
        })
    })

    interval = setInterval(getAttacks, 50)
}

function getAttacks() {
    fetch(`http://192.168.1.9:8080/mokepon/${enemigoId}/ataques`)
    .then(function (res) {
        if (res.ok) {
            res.json()
            .then(function ({ataques}) {
                if (ataques.length === 5) {
                    enemyAttack = ataques
                    figth()
                }
            })
        }
    })
}

function extractAttack(playerPet) {
    let attacks
    for(let i = 0; i < mokepones.length; i++) {
        if (playerPet === mokepones[i].name) {
            attacks = mokepones[i].attacks
        }
    }
    renderingButtons(attacks)
}

function startCanvas() {
    mokeponObject = matchMokepon(playerPet)

    interval = setInterval(drawCanvas, 50)
    window.addEventListener("keydown", somekey)
    window.addEventListener("keyup", stopMove)
}

function drawCanvas() {
    mokeponObject.x += mokeponObject.speedX
    mokeponObject.y += mokeponObject.speedY

    panel.clearRect(0, 0 , onlyMap.width, onlyMap.height)
    panel.drawImage(
        mokemap,
        0,
        0,
        onlyMap.width,
        onlyMap.height
    )
    mokeponObject.paintMokepon()
    sendPos(mokeponObject.x, mokeponObject.y)
    mokeponesEnemigos.forEach(function (mokepon) {
        mokepon.paintMokepon()
        collide(mokepon)
    })
}

function sendPos(x, y) {
    fetch(`http://192.168.1.9:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok) {
            res.json()
            .then(function ({enemigos}) {
                console.log(enemigos);
                mokeponesEnemigos = enemigos.map((enemigo) => {
                    let mokeponEnemigo = null
                    const mokeponNombre = enemigo.mokepon.nombre || ""
                    if (mokeponNombre === "Hipoge") {
                        mokeponEnemigo = new Mokepon("Hipoge", "./assets/img/hipodoge.png", 5, "./assets/img/head_hipodoge.png", enemigo.id)
                    } else if (mokeponNombre === "Capipepo") {
                        mokeponEnemigo = new Mokepon("Capipepo", "./assets/img/capipepo.png", 5, "./assets/img/head_capipepo.png", enemigo.id)
                    } else if (mokeponNombre === "Ratigueya") {
                        mokeponEnemigo = new Mokepon("Ratigueya", "./assets/img/ratigueya.png", 5, "./assets/img/head_ratigueya.png", enemigo.id)                        
                    }

                    mokeponEnemigo.x = enemigo.x
                    mokeponEnemigo.y = enemigo.y
                    
                    return mokeponEnemigo
                })
                })
        }
    })
}

function rightMove() {
    mokeponObject.speedX = 5
}
function leftMove() {
    mokeponObject.speedX = -5
}
function upMove() {
    mokeponObject.speedY = -5
}
function downMove() {
    mokeponObject.speedY = 5
}

function somekey(event) {
    switch (event.key) {
        case "ArrowUp":
            upMove()
            break;
        case "ArrowDown":
            downMove()
            break;
        case "ArrowRight":
            rightMove()
            break;
        case "ArrowLeft":
            leftMove()
            break;
        default:
            break;
    }
}

function matchMokepon(playerPet) {
    for(let i = 0; i < mokepones.length; i++) {
        if (playerPet === mokepones[i].name) {
            return mokepones[i]
        }
    }
}

function stopMove() {
    mokeponObject.speedX = 0
    mokeponObject.speedY = 0
}

function collide(enemy) {
    const enemyUp = enemy.y
    const enemyDown = enemy.y + enemy.height
    const enemyRight = enemy.x + enemy.width
    const enemyLeft = enemy.x

    const mokeponUp = mokeponObject.y
    const mokeponDown = mokeponObject.y + mokeponObject.height
    const mokeponRight = mokeponObject.x + mokeponObject.width
    const mokeponLeft = mokeponObject.x


    if(
        mokeponDown < enemyUp ||
        mokeponUp > enemyDown ||
        mokeponRight < enemyLeft ||
        mokeponLeft > enemyRight
    ){
        return
    }
    stopMove()
    clearInterval(interval)
    enemigoId = enemy.id
    showSectionAttack.style.display = 'flex'
    canvasMap.style.display = 'none'
    checkMokeponEnemy(enemy)

}

window.addEventListener("load", startPage)