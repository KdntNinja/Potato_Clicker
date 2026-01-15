const clickerButton = document.getElementById('potato-button');
const clickerCountDisplay = document.getElementById('potato-amount');
const titleElement = document.getElementById('title');
const comments = document.getElementById('comment');
const input = document.getElementById('nameInput');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const openBtns = document.getElementById('openModalStats');
const closeBtns = document.getElementById('closeModalStats');
const modals = document.getElementById('modalstats');
const potatoesCountElement = document.getElementById('potBank');
const allTimePotatoesElement = document.getElementById('totPot');
const runStartTimeElement = document.getElementById('runStart');
const buildingsOwnedElement = document.getElementById('buildingsOwned');
const potatoesPerSecondElement = document.getElementById('potatoesPerSecond');
const rawPotatoesPerSecondElement = document.getElementById('rawPotatoesPerSecond');
const potatoesPerClickElement = document.getElementById('potatoesPerClick');
const potatoClicksElement = document.getElementById('potatoClicks');
const handFarmedPotatoesElement = document.getElementById('handFarmedPotatoes');
const goldenPotatoClicksElement = document.getElementById('goldenPotatoClicks');
const runningVersionElement = document.getElementById('runningVersion');
const versionElement = document.getElementById('version');
const clickArea = document.getElementById('potato-button');
const goldenPotato = document.getElementById('golden-potato-button');
const goldenPotatoImage = document.getElementById('golden-potato');

let rawPotatoes = 0;
let potatoes = 0;
let potatoesPerSecond = 0;
let potatoesLastSecond = 0;
let allTimePotatoes = 0;
let runStartTime = Date.now();
let buildingsOwned = 0;
let rawPotatoesPerSecond = 0;
let potatoesPerClick = 1;
let potatoClicks = 0;
let handFarmedPotatoes = 0;
let goldenPotatoClicks = 0;
let runningVersion = "v0.11"

var comment_types = {
  "none": ["Nobody is talking about your potatoes.", "Your potatoes are non-existent.", "You have no potatoes to discuss.", "Your potatoes are invisible to the world."],
  "ignored": ["Your potatoes are being ignored.", "Many people overlook your potatoes.", "Your potatoes are not getting any attention.", "Your potatoes are in the background."],
  "some_attention": ["Your potatoes are getting some attention.", "A few people are noticing your potatoes.", "Your potatoes are starting to make waves.", "Your potatoes are on the radar."],
  "popular": ["Your potatoes are becoming popular!", "Your potatoes are the talk of the town!", "Everyone is buzzing about your potatoes!", "Your potatoes are trending!"],
  "legendary": ["Your potatoes are legendary!", "Your potatoes have achieved mythical status!", "Your potatoes are the stuff of legends!", "Your potatoes are immortalized in history!"]
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setCommentSmooth(text) {
  comments.style.opacity = "0";

  setTimeout(() => {
    comments.innerText = text;
    comments.style.opacity = "1";
  }, 400);
}

async function updatePotatoComments() {
  setTimeout(updatePotatoComments, 10000);

  let newComment;

  if (potatoes === 0) {
    newComment = comment_types.none[
      Math.floor(Math.random() * comment_types.none.length)
    ];
  } else if (potatoes < 100) {
    newComment = comment_types.ignored[
      Math.floor(Math.random() * comment_types.ignored.length)
    ];
  } else if (potatoes < 1000) {
    newComment = comment_types.some_attention[
      Math.floor(Math.random() * comment_types.some_attention.length)
    ];
  } else if (potatoes < 10000) {
    newComment = comment_types.popular[
      Math.floor(Math.random() * comment_types.popular.length)
    ];
  } else {
    newComment = comment_types.legendary[
      Math.floor(Math.random() * comment_types.legendary.length)
    ];
  }

  setCommentSmooth(newComment);
}

function updatePotatoDisplay() {
  if (potatoes === 1) {
    clickerCountDisplay.innerText = potatoes + ' Potato';
    titleElement.innerText = potatoes + ' potato - Potato Clicker';
    return;
  } else {
    clickerCountDisplay.innerText = potatoes + ' Potatoes';
    titleElement.innerText = potatoes + ' potatoes - Potato Clicker';
  }
}

function rateCounter() {
    if (potatoes !== potatoesLastSecond || potatoesPerSecond !== (potatoes - potatoesLastSecond)) {
      potatoesPerSecond = potatoes - potatoesLastSecond;
      potatoesLastSecond = potatoes;
      document.querySelector('.potato-amount-persecond').innerText = 'per second: ' + potatoesPerSecond;
    }
    setTimeout(rateCounter, 1000); // schedule the next call
}

function updateStatsDisplay() {
  potatoesCountElement.innerText = 'Potatoes in bank: ' + potatoes;
  allTimePotatoesElement.innerText = 'Potatoes gathered (all time): ' + allTimePotatoes;
  let runDuration = Math.floor((Date.now() - runStartTime) / 1000);
  runStartTimeElement.innerText = 'Run started: ' + runDuration + ' seconds ago';
  buildingsOwnedElement.innerText = 'Buildings owned: ' + buildingsOwned;
  potatoesPerSecondElement.innerText = 'Potatoes per second: ' + potatoesPerSecond;
  rawPotatoesPerSecondElement.innerText = 'Raw potatoes per second: ' + rawPotatoesPerSecond;
  potatoesPerClickElement.innerText = 'Potatoes per click: ' + potatoesPerClick;
  potatoClicksElement.innerText = 'Potato clicks: ' + potatoClicks;
  handFarmedPotatoesElement.innerText = 'Hand-farmed potatoes: ' + handFarmedPotatoes;
  goldenPotatoClicksElement.innerText = 'Golden potato clicks: ' + goldenPotatoClicks;
  runningVersionElement.innerText = 'Running version: ' + runningVersion;
  versionElement.innerText = runningVersion;
  setTimeout(updateStatsDisplay, 1000);
}

clickerButton.addEventListener('click', function() {
  potatoes += potatoesPerClick;
  rawPotatoes += potatoesPerClick;
  handFarmedPotatoes += potatoesPerClick;
  allTimePotatoes += potatoesPerClick;
  potatoClicks++;
  updatePotatoDisplay()
  
});

function updateStatsDisplay() {
  potatoesCountElement.innerText = 'Potatoes in bank: ' + potatoes;
  allTimePotatoesElement.innerText = 'Potatoes gathered (all time): ' + allTimePotatoes;
  let runDuration = Math.floor((Date.now() - runStartTime) / 1000);
  runStartTimeElement.innerText = 'Run started: ' + runDuration + ' seconds ago';
  buildingsOwnedElement.innerText = 'Buildings owned: ' + buildingsOwned;
  potatoesPerSecondElement.innerText = 'Potatoes per second: ' + potatoesPerSecond;
  rawPotatoesPerSecondElement.innerText = 'Raw potatoes per second: ' + rawPotatoesPerSecond;
  potatoesPerClickElement.innerText = 'Potatoes per click: ' + potatoesPerClick;
  potatoClicksElement.innerText = 'Potato clicks: ' + potatoClicks;
  handFarmedPotatoesElement.innerText = 'Hand-farmed potatoes: ' + handFarmedPotatoes;
  goldenPotatoClicksElement.innerText = 'Golden potato clicks: ' + goldenPotatoClicks;
  runningVersionElement.innerText = 'Running version: ' + runningVersion;
  versionElement.innerText = runningVersion;
  setTimeout(updateStatsDisplay, 1000);
}

function updateStatsDisplay() {
  potatoesCountElement.innerText = 'Potatoes in bank: ' + potatoes;
  allTimePotatoesElement.innerText = 'Potatoes gathered (all time): ' + allTimePotatoes;
  let runDuration = Math.floor((Date.now() - runStartTime) / 1000);
  runStartTimeElement.innerText = 'Run started: ' + runDuration + ' seconds ago';
  buildingsOwnedElement.innerText = 'Buildings owned: ' + buildingsOwned;
  potatoesPerSecondElement.innerText = 'Potatoes per second: ' + potatoesPerSecond;
  rawPotatoesPerSecondElement.innerText = 'Raw potatoes per second: ' + rawPotatoesPerSecond;
  potatoesPerClickElement.innerText = 'Potatoes per click: ' + potatoesPerClick;
  potatoClicksElement.innerText = 'Potato clicks: ' + potatoClicks;
  handFarmedPotatoesElement.innerText = 'Hand-farmed potatoes: ' + handFarmedPotatoes;
  goldenPotatoClicksElement.innerText = 'Golden potato clicks: ' + goldenPotatoClicks;
  runningVersionElement.innerText = 'Running version: ' + runningVersion;
  versionElement.innerText = runningVersion;
  setTimeout(updateStatsDisplay, 1000);
}

const GOLDEN_DELAY = 1000 * 1000;
const GOLDEN_VISIBLE_TIME = 10 * 1000;

let spawnTimeout = null;
let hideTimeout = null;

goldenPotatoImage.addEventListener('click', (e) => {
  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = `Lucky, ${potatoesPerClick * 100} Potatoes!`;
  text.style.left = (e.clientX + (Math.random() * 40 - 20)) + 'px';
  text.style.top = (e.clientY - 20) + 'px';
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1000);

  const reward = potatoesPerClick * 100;
  potatoes += reward;
  allTimePotatoes += reward;
  goldenPotatoClicks++;

  updatePotatoDisplay();

  hideGoldenPotato();
  scheduleNextGoldenPotato();
});

function showGoldenPotato() {
  goldenPotatoImage.classList.remove('hidden');
  goldenPotatoImage.classList.add('shown');

  const x = Math.random() * (window.innerWidth - goldenPotatoImage.offsetWidth);
  const y = Math.random() * (window.innerHeight - goldenPotatoImage.offsetHeight);

  goldenPotatoImage.style.left = `${x}px`;
  goldenPotatoImage.style.top = `${y}px`;

  hideTimeout = setTimeout(() => {
    hideGoldenPotato();
    scheduleNextGoldenPotato();
  }, GOLDEN_VISIBLE_TIME);
}

function hideGoldenPotato() {
  goldenPotatoImage.classList.add('hidden');
  goldenPotatoImage.classList.remove('shown');
  clearTimeout(hideTimeout);
}

function scheduleNextGoldenPotato() {
  clearTimeout(spawnTimeout);
  spawnTimeout = setTimeout(showGoldenPotato, GOLDEN_DELAY);
}

goldenPotatoImage.classList.add('hidden');
scheduleNextGoldenPotato();

input.addEventListener("blur", () => {
  if (!input.value) {
    input.value = "My Potato Farm";
  } else if (!input.value.endsWith("’s Potato Farm")) {
    input.value = input.value.trim() + "’s Potato Farm";
  } 
  
});

openBtn.addEventListener('click', () => {
  modal.classList.add("open");
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove("open");
});

openBtns.addEventListener('click', () => {
  modals.classList.add("open");
});

closeBtns.addEventListener('click', () => {
  modals.classList.remove("open");
});

clickArea.addEventListener('click', (e) => {
  const rect = clickArea.getBoundingClientRect();

  // --- +1 trail ---
  const trail = document.createElement('div');
  trail.className = 'trail';
  const offsetX = (Math.random() * 40 - 20);
  trail.style.left = (e.clientX - rect.left + offsetX) + 'px';
  trail.style.top = (e.clientY - rect.top - 20) + 'px';
  trail.textContent = `+${potatoesPerClick}`;
  clickArea.appendChild(trail);
  setTimeout(() => trail.remove(), 1000);

  // --- Potato image jump ---
  const potato = document.createElement('img');
  potato.src = 'assets/potato.png';
  potato.className = 'jump-image';
  potato.style.left = (e.clientX - rect.left - 20) + 'px';
  potato.style.top = (e.clientY - rect.top - 20) + 'px';
  potato.style.opacity = '1';
  clickArea.appendChild(potato);

  // Jump physics
  let velocityY = -6 - Math.random() * 2; // same jump
  let velocityX = (Math.random() * 4 - 2); // same drift
  const gravity = 0.55;
  let posX = e.clientX - rect.left - 20;
  let posY = e.clientY - rect.top - 20;

  // Rotation
  let rotation = Math.random() * 360; // random start rotation
  let rotationSpeed = (Math.random() * 10 - 5); // random rotation speed

  // Fade timer
  let opacity = 1;
  const fadeSpeed = 0.05; // fade faster

  const animation = setInterval(() => {
    velocityY += gravity;
    posY += velocityY;
    posX += velocityX;

    rotation += rotationSpeed;
    opacity -= fadeSpeed;

    potato.style.top = posY + 'px';
    potato.style.left = posX + 'px';
    potato.style.transform = `rotate(${rotation}deg)`;
    potato.style.opacity = opacity;

    // Remove when opacity is zero or falls below click
    if (opacity <= 0 || posY > e.clientY - rect.top) {
      clearInterval(animation);
      potato.remove();
    }
  }, 16);
});



rateCounter();
updatePotatoComments();
updateStatsDisplay()
randomGoldenPotatoPosition();