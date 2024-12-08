const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const addPlayerButton = document.getElementById("addPlayerButton");
const playerNameInput = document.getElementById("playerNameInput");
const playerList = document.getElementById("playerList");
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const saveSettings = document.getElementById("saveSettings");
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2-10;
let players = []; // Liste des joueurs
let colors = []; // Conserver les couleurs pour chaque joueur
let spinning = false;
let currentDeg = 0;
let speed = 0;
let maxRotation = 0;
let gages = ["Faire une danse", "Imiter [joueur]", "Faire un compliment à [joueur]", "Raconte ta pire anecdote", "Raconte une vérité sur toi que peu de gens savent", "Fais un gros calin à [joueur]", "As-tu un crush ici présent ?", "Prends ton verre et fais cul sec avec [joueur]", "Fais un baiser à la main de [joueur]", "Montre ta lise de message instagram"];

//const rouletteSound = new Audio('C:\Users\chris\Downloads\roulette_clicks_sound.wav');
const rouletteSound = new Audio('./roulette_sound.mp4');
// Fonction pour générer une couleur aléatoire
function randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

// Fonction pour convertir en radians
function toRad(deg) {
    return deg * (Math.PI / 180);
}

// Fonction pour dessiner la roue
function drawWheel() {
    ctx.clearRect(0, 0, width, height); // Nettoyer le canvas
    const step = 360 / players.length;

    players.forEach((player, i) => {
        const startDeg = step * i;
        const endDeg = startDeg + step;
        const color = colors[i]; // Utiliser les couleurs déjà définies
        
        // Dessiner chaque section
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Ajouter le nom du joueur
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = `${Math.max(12, radius / 10)}px sans-serif`; // Taille adaptative pour le texte
        ctx.fillText(player, radius - 50, 10);
        ctx.restore();
    });
}

// Dessiner la roue avec une rotation
function drawWheelWithRotation(rotation) {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad(rotation));
    ctx.translate(-centerX, -centerY);
    drawWheel();
    ctx.restore();
}

/// Lancer ou relancer la roue
/*function spin() {
    if (!spinning) {
        spinning = true;
        speed = 20;
        maxRotation = (360 * (3 + Math.random() * 2)); // Rotation aléatoire
        animate();
    } else {
        // Si la roue est déjà en rotation, réinitialisez la vitesse et la rotation
        speed = 20;
        maxRotation += (360 * (3 + Math.random() * 2)); // Ajouter une rotation supplémentaire
    }
}
*/

// autre test function spin
function spin() {
    if (spinning) return;
    
    spinning = true;
    speed = 20;
    maxRotation = 360 * (3 + Math.random() * 2);

     // Jouer le son
    rouletteSound.play();

    animate();
}

// Fonction pour animer la rotation de la roue
/*function animate() {
    if (!spinning) return

    if (speed > 0) {
        currentDeg += speed;
        speed *= 0.98; // Ralentissement
        drawWheelWithRotation(currentDeg);
        requestAnimationFrame(animate);
    } else {
        speed = 0;// Assurez-vous que speed est bien à 0
        spinning = false;
        showAlert();// Affichez l'alerte uniquement lorsque la roue s'arrête
    }
}
*/
//autre essai function animate
function animate() {
    if (!spinning) return;

    currentDeg += speed;
    speed *= 0.98; // Ralentissement progressif

    if (speed < 0.1) {
        speed = 0;
        spinning = false;

        // Arrêter le son
        rouletteSound.pause();
        rouletteSound.currentTime = 0;

        showAlert();
        return;
    }

    drawWheelWithRotation(currentDeg);
    requestAnimationFrame(animate);
}
// Ajouter un joueur
addPlayerButton.onclick = () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        players.push(playerName);
        colors.push(randomColor()); // Générer et stocker une couleur pour le nouveau joueur
        updatePlayerList();
        playerNameInput.value = "";
        drawWheel(); // Redessiner la roulette avec le nouveau joueur
    }
};

// Mettre à jour la liste des joueurs affichée
function updatePlayerList() {
    playerList.innerHTML = "";
    players.forEach(player => {
        const li = document.createElement("li");
        li.textContent = player;
        playerList.appendChild(li);
    });
}

// Fonction pour afficher une alerte lorsque la roulette s'arrête
function showAlert() {
    if (players.length === 0 || gages.length === 0) return; // Vérifie que des joueurs et des gages sont disponibles

    const step = 360 / players.length;
    // Calculer l'index du joueur basé sur l'angle de 90° (modulo 360 pour rester dans l'intervalle de 0 à 360)
    const adjustedAngle = (currentDeg % 360 + 360) % 360; // Angle ajusté pour être positif
    const selectedIndex = Math.floor(((90 - adjustedAngle + 360) % 360) / step);
    //const selectedIndex = Math.floor(((90 - (currentDeg % 360) + 360) % 360) / step);
    const player = players[selectedIndex];
  // const gage = gages[Math.floor(Math.random() * gages.length)];
    let gage = gages[Math.floor(Math.random() * gages.length)];

    // Si le gage contient "[joueur]", remplacer par un joueur aléatoire (autre que le joueur sélectionné)
    if (gage.includes("[joueur]")) {
        let randomPlayer;
        do {
            randomPlayer = players[Math.floor(Math.random() * players.length)];
        } while (randomPlayer === player); // Assurez-vous que ce n'est pas le joueur actuel

        gage = gage.replace("[joueur]", randomPlayer);
    }

    alert(`Le joueur sélectionné est : ${player}\nGage : ${gage}`);
    
    
}


function resizeCanvas() {
    const maxWidth = Math.min(window.innerWidth, window.innerHeight) - 20; // Limite la largeur à celle de l'écran avec une marge
    canvas.width = maxWidth;
    canvas.height = maxWidth;
    drawWheel(); // Redessine la roue après redimensionnement
}

window.addEventListener("resize", resizeCanvas); // Adapte la taille lorsque la fenêtre est redimensionnée
resizeCanvas(); // Appelle une première fois pour adapter la taille dès le chargement

// Ouvrir/fermer la modale de paramètres
settingsButton.onclick = () => settingsModal.style.display = "flex";
saveSettings.onclick = () => {
    const gagesInput = document.getElementById("gagesInput").value;
    gages = gagesInput.split(",").map(g => g.trim()).filter(g => g !== ""); // Sépare les gages et enlève les espaces vides
    settingsModal.style.display = "none";
};


// Initialisation de la roue
drawWheel();
