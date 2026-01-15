const clickerButton = document.getElementById("potato-button");
const clickerCountDisplay = document.getElementById("potato-amount");
const titleElement = document.getElementById("title");
const comments = document.getElementById("comment");
const input = document.getElementById("nameInput");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const openBtns = document.getElementById("openModalStats");
const closeBtns = document.getElementById("closeModalStats");
const modals = document.getElementById("modalstats");
const openBtno = document.getElementById("openModalOptions");
const closeBtno = document.getElementById("closeModalOptions");
const openBtnv = document.getElementById("openModalOptionsv");
const modalo = document.getElementById("modaloptions");
const potatoesCountElement = document.getElementById("potBank");
const allTimePotatoesElement = document.getElementById("totPot");
const runStartTimeElement = document.getElementById("runStart");
const buildingsOwnedElement = document.getElementById("buildingsOwned");
const potatoesPerSecondElement = document.getElementById("potatoesPerSecond");
const rawPotatoesPerSecondElement = document.getElementById("rawPotatoesPerSecond");
const potatoesPerClickElement = document.getElementById("potatoesPerClick");
const potatoClicksElement = document.getElementById("potatoClicks");
const handFarmedPotatoesElement = document.getElementById("handFarmedPotatoes");
const goldenPotatoClicksElement = document.getElementById("goldenPotatoClicks");
const runningVersionElement = document.getElementById("runningVersion");
const versionElement = document.getElementById("version");
const clickArea = document.getElementById("potato-button");
const goldenPotato = document.getElementById("golden-potato-button");
const goldenPotatoImage = document.getElementById("golden-potato");

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
let runningVersion = "v0.32";
let autoClickAmount = 0;
let runDurationSeconds;

let buildings = [
  {
    id: "cursor",
    name: "Cursor",
    price: 15,
    owned: 0,
    icon: "assets/cursor.png",
    realIcon: "assets/cursor.png",
    cps: 0.1,
    unlocked: false,
    sort: 1,
    mystery: true,
  },
  {
    id: "farmer",
    name: "Farmer",
    price: 100,
    owned: 0,
    icon: "assets/farmer.png",
    realIcon: "assets/farmer.png",
    cps: 1,
    unlocked: false,
    sort: 2,
    mystery: true,
  },
  {
    id: "tractor",
    name: "Tractor",
    price: 1100,
    owned: 0,
    icon: "assets/tractor.png",
    realIcon: "assets/tractor.png",
    cps: 8,
    unlocked: false,
    sort: 3,
    mystery: true,
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    price: 12000,
    owned: 0,
    icon: "assets/greenhouse.png",
    realIcon: "assets/greenhouse.png",
    cps: 30,
    unlocked: false,
    sort: 4,
    mystery: true,
  },
  {
    id: "chip_factory",
    name: "Chip Factory",
    price: 150000,
    owned: 0,
    icon: "assets/chip_factory.png",
    realIcon: "assets/chip_factory.png",
    cps: 260,
    unlocked: false,
    sort: 5,
    mystery: true,
  },
  {
    id: "restaurant",
    name: "Restaurant",
    price: 1400000,
    owned: 0,
    icon: "assets/restaurant.png",
    realIcon: "assets/restaurant.png",
    cps: 1400,
    unlocked: false,
    sort: 6,
    mystery: true,
  },
];

let mysteryCount = 0;
buildings.forEach((b) => {
  if (b.mystery && mysteryCount < 2) {
    b.unlocked = true;
    mysteryCount++;
  } else if (b.mystery) {
    b.unlocked = false;
  }
});

var comment_types = {
  none: [
    "Nobody is talking about your potatoes.",
    "Your potatoes are non-existent.",
    "You have no potatoes to discuss.",
    "Your potatoes are invisible to the world.",
  ],
  ignored: [
    "Your potatoes are being ignored.",
    "Many people overlook your potatoes.",
    "Your potatoes are not getting any attention.",
    "Your potatoes are in the background.",
  ],
  some_attention: [
    "Your potatoes are getting some attention.",
    "A few people are noticing your potatoes.",
    "Your potatoes are starting to make waves.",
    "Your potatoes are on the radar.",
  ],
  popular: [
    "Your potatoes are becoming popular!",
    "Your potatoes are the talk of the town!",
    "Everyone is buzzing about your potatoes!",
    "Your potatoes are trending!",
  ],
  legendary: [
    "Your potatoes are legendary!",
    "Your potatoes have achieved mythical status!",
    "Your potatoes are the stuff of legends!",
    "Your potatoes are immortalized in history!",
  ],
};

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
    newComment =
      comment_types.none[Math.floor(Math.random() * comment_types.none.length)];
  } else if (potatoes < 100) {
    newComment =
      comment_types.ignored[
        Math.floor(Math.random() * comment_types.ignored.length)
      ];
  } else if (potatoes < 1000) {
    newComment =
      comment_types.some_attention[
        Math.floor(Math.random() * comment_types.some_attention.length)
      ];
  } else if (potatoes < 10000) {
    newComment =
      comment_types.popular[
        Math.floor(Math.random() * comment_types.popular.length)
      ];
  } else {
    newComment =
      comment_types.legendary[
        Math.floor(Math.random() * comment_types.legendary.length)
      ];
  }

  setCommentSmooth(newComment);
}

function updatePotatoDisplay() {
  if (potatoes === 1) {
    clickerCountDisplay.innerText = Math.floor(potatoes) + " Potato";
    titleElement.innerText = Math.floor(potatoes) + " potato - Potato Clicker";
    return;
  } else {
    clickerCountDisplay.innerText = Math.floor(potatoes) + " Potatoes";
    titleElement.innerText =
      Math.floor(potatoes) + " potatoes - Potato Clicker";
  }
}

function rateCounter() {
  document.querySelector(".potato-amount-persecond").innerText =
    "per second: " + Math.floor(autoClickAmount * 10) / 10;
  setTimeout(rateCounter, 1000);
}

function formatRunTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n) => n.toString().padStart(2, "0");

  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}

function updateStatsDisplay() {
  potatoesCountElement.innerText =
    "Potatoes in bank: " + Math.floor(potatoes * 10) / 10;
  allTimePotatoesElement.innerText =
    "Potatoes gathered (all time): " + Math.floor(allTimePotatoes * 10) / 10;
  runDurationSeconds = Math.floor((Date.now() - runStartTime) / 1000);
  runStartTimeElement.innerText =
    "Run started: " + formatRunTime(runDurationSeconds);
  buildingsOwnedElement.innerText = "Buildings owned: " + buildingsOwned;
  potatoesPerSecondElement.innerText =
    "Potatoes per second: " + Math.floor(autoClickAmount * 10) / 10;
  potatoesPerClickElement.innerText = "Potatoes per click: " + potatoesPerClick;
  potatoClicksElement.innerText = "Potato clicks: " + potatoClicks;
  handFarmedPotatoesElement.innerText =
    "Hand-farmed potatoes: " + handFarmedPotatoes;
  goldenPotatoClicksElement.innerText =
    "Golden potato clicks: " + goldenPotatoClicks;
  runningVersionElement.innerText = "Running version: " + runningVersion;
  versionElement.innerText = runningVersion;
  setTimeout(updateStatsDisplay, 1000);
}

function enforceMysteryLimit() {
  let activeMysteryCount = buildings.filter(
    (b) => b.mystery && b.unlocked,
  ).length;

  let mysterySlots = 2 - activeMysteryCount;

  buildings.forEach((b) => {
    if (!b.mystery) {
      b.unlocked = true;
      return;
    }

    if (b.unlocked && mysterySlots <= 0) {
      return;
    }

    if (!b.unlocked && mysterySlots > 0) {
      b.unlocked = true;
      mysterySlots--;
    }
  });
}

function setLocalData() {
  localStorage.setItem("potatoes", potatoes);
  localStorage.setItem("potatoes_gathered", allTimePotatoes);
  localStorage.setItem("run_started", runDurationSeconds);
  localStorage.setItem("buildings_owned", buildingsOwned);
  localStorage.setItem("potatoes_per_second", autoClickAmount);
  localStorage.setItem("potatoes_per_click", potatoesPerClick);
  localStorage.setItem("potato_clicks", potatoClicks);
  localStorage.setItem("hand_farmed_potatoes", handFarmedPotatoes);
  localStorage.setItem("golden_potato_clicks", goldenPotatoClicks);

  const cursorBuilding = buildings.find((b) => b.id === "cursor");
  localStorage.setItem("cursors", cursorBuilding ? cursorBuilding.owned : 0);
  localStorage.setItem(
    "cursor_mystery",
    cursorBuilding ? cursorBuilding.mystery : true,
  );

  const farmerBuilding = buildings.find((b) => b.id === "farmer");
  localStorage.setItem("farmers", farmerBuilding ? farmerBuilding.owned : 0);
  localStorage.setItem(
    "farmer_mystery",
    farmerBuilding ? farmerBuilding.mystery : true,
  );

  const tractorBuilding = buildings.find((b) => b.id === "tractor");
  localStorage.setItem("tractors", tractorBuilding ? tractorBuilding.owned : 0);
  localStorage.setItem(
    "tractor_mystery",
    tractorBuilding ? tractorBuilding.mystery : true,
  );

  const greenhouseBuilding = buildings.find((b) => b.id === "greenhouse");
  localStorage.setItem(
    "greenhouses",
    greenhouseBuilding ? greenhouseBuilding.owned : 0,
  );
  localStorage.setItem(
    "greenhouse_mystery",
    greenhouseBuilding ? greenhouseBuilding.mystery : true,
  );

  const chipfactoryBuilding = buildings.find((b) => b.id === "chip_factory");
  localStorage.setItem(
    "chip_factorys",
    chipfactoryBuilding ? chipfactoryBuilding.owned : 0,
  );
  localStorage.setItem(
    "chip_factory_mystery",
    chipfactoryBuilding ? chipfactoryBuilding.mystery : true,
  );

  const restaurantBuilding = buildings.find((b) => b.id === "restaurant");
  localStorage.setItem(
    "restaurants",
    restaurantBuilding ? restaurantBuilding.owned : 0,
  );
  localStorage.setItem(
    "restaurant_mystery",
    restaurantBuilding ? restaurantBuilding.mystery : true,
  );
}

function getLocalData() {
  potatoes =
    Math.floor(Number(localStorage.getItem("potatoes") || 0) * 10) / 10;
  allTimePotatoes =
    Math.floor(Number(localStorage.getItem("potatoes_gathered") || 0) * 10) /
    10;
  runDurationSeconds = Number(localStorage.getItem("run_started") || 0);
  buildingsOwned = Number(localStorage.getItem("buildings_owned") || 0);
  autoClickAmount = Number(localStorage.getItem("potatoes_per_second") || 0);
  potatoesPerClick = Number(localStorage.getItem("potatoes_per_click") || 1);
  potatoClicks = Number(localStorage.getItem("potato_clicks") || 0);
  handFarmedPotatoes = Number(
    localStorage.getItem("hand_farmed_potatoes") || 0,
  );
  goldenPotatoClicks = Number(
    localStorage.getItem("golden_potato_clicks") || 0,
  );
  const cursorBuilding = buildings.find((b) => b.id === "cursor");
  if (cursorBuilding) {
    cursorBuilding.owned = Number(localStorage.getItem("cursors") || 0);
    cursorBuilding.mystery = JSON.parse(
      localStorage.getItem("cursor_mystery") || "true",
    );
    cursorBuilding.price = Math.ceil(15 * Math.pow(1.15, cursorBuilding.owned));
  }
  const farmerBuilding = buildings.find((b) => b.id === "farmer");
  if (farmerBuilding) {
    farmerBuilding.owned = Number(localStorage.getItem("farmers") || 0);
    farmerBuilding.mystery = JSON.parse(
      localStorage.getItem("farmer_mystery") || "true",
    );
    farmerBuilding.price = Math.ceil(
      100 * Math.pow(1.15, farmerBuilding.owned),
    );
  }
  const tractorBuilding = buildings.find((b) => b.id === "tractor");
  if (tractorBuilding) {
    tractorBuilding.owned = Number(localStorage.getItem("tractors") || 0);
    tractorBuilding.mystery = JSON.parse(
      localStorage.getItem("farmer_mystery") || "true",
    );
    tractorBuilding.price = Math.ceil(
      1100 * Math.pow(1.15, tractorBuilding.owned),
    );
  }
  const greenhouseBuilding = buildings.find((b) => b.id === "greenhouse");
  if (greenhouseBuilding) {
    greenhouseBuilding.owned = Number(localStorage.getItem("greenhouses") || 0);
    greenhouseBuilding.mystery = JSON.parse(
      localStorage.getItem("farmer_mystery") || "true",
    );
    greenhouseBuilding.price = Math.ceil(
      12000 * Math.pow(1.15, greenhouseBuilding.owned),
    );
  }
  const chipfactoryBuilding = buildings.find((b) => b.id === "chip_factory");
  if (chipfactoryBuilding) {
    chipfactoryBuilding.owned = Number(localStorage.getItem("chip_factorys") || 0);
    chipfactoryBuilding.mystery = JSON.parse(
      localStorage.getItem("chipfactory_mystery") || "true",
    );
    chipfactoryBuilding.price = Math.ceil(
      12000 * Math.pow(1.15, chipfactoryBuilding.owned),
    );
  }
  const restaurantBuilding = buildings.find((b) => b.id === "restaurant");
  if (restaurantBuilding) {
    restaurantBuilding.owned = Number(localStorage.getItem("restaurants") || 0);
    restaurantBuilding.mystery = JSON.parse(
      localStorage.getItem("restaurant_mystery") || "true",
    );
    restaurantBuilding.price = Math.ceil(
      12000 * Math.pow(1.15, restaurantBuilding.owned),
    );
  }
  renderBuildings();
}

function clearLocalData() {
  if (
    confirm(
      "Are you sure you want to erase your current save (this change cannot by reverted)?",
    )
  ) {
    localStorage.clear();
    location.reload();
  } else {
    console.log("DEBUG: Canceled");
  }
}

clickerButton.addEventListener("click", function () {
  clickerButton.disabled = true;
  potatoes += Math.floor(potatoesPerClick * 10) / 10;
  rawPotatoes += potatoesPerClick;
  handFarmedPotatoes += potatoesPerClick;
  allTimePotatoes += potatoesPerClick;
  potatoClicks++;
  updatePotatoDisplay();
  renderBuildings();
  setTimeout(() => {
    clickerButton.disabled = false;
  }, 85);
});

const GOLDEN_DELAY = 1000 * 1000;
const GOLDEN_VISIBLE_TIME = 10 * 1000;

let spawnTimeout = null;
let hideTimeout = null;

goldenPotatoImage.addEventListener("click", (e) => {
  const text = document.createElement("div");
  text.className = "text";
  text.textContent = `Lucky, ${potatoesPerClick * 5000} Potatoes!`;
  text.style.left = e.clientX + (Math.random() * 40 - 20) + "px";
  text.style.top = e.clientY - 20 + "px";
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1000);

  const reward = potatoesPerClick * 5000;
  potatoes += reward;
  allTimePotatoes += reward;
  goldenPotatoClicks++;

  updatePotatoDisplay();
  renderBuildings();
  hideGoldenPotato();
  scheduleNextGoldenPotato();
});

function showGoldenPotato() {
  goldenPotatoImage.classList.remove("hidden");
  goldenPotatoImage.classList.add("shown");

  const x = Math.random() * (window.innerWidth - goldenPotatoImage.offsetWidth);
  const y =
    Math.random() * (window.innerHeight - goldenPotatoImage.offsetHeight);

  goldenPotatoImage.style.left = `${x}px`;
  goldenPotatoImage.style.top = `${y}px`;

  hideTimeout = setTimeout(() => {
    hideGoldenPotato();
    scheduleNextGoldenPotato();
  }, GOLDEN_VISIBLE_TIME);
}

function hideGoldenPotato() {
  goldenPotatoImage.classList.add("hidden");
  goldenPotatoImage.classList.remove("shown");
  clearTimeout(hideTimeout);
}

function scheduleNextGoldenPotato() {
  clearTimeout(spawnTimeout);
  spawnTimeout = setTimeout(showGoldenPotato, GOLDEN_DELAY);
}

function renderBuildings() {
  enforceMysteryLimit();
  const container = document.getElementById("buildings");
  container.innerHTML = "";

  const visible = buildings.filter((b) => b.unlocked);
  visible.sort((a, b) => a.sort - b.sort);

  visible.forEach((b) => {
    const buildingButton = document.createElement("button");
    buildingButton.className = "building-container";

    let displayName = b.name;
    let displayPrice = b.price;
    let displayIcon = b.realIcon;

    if (b.mystery) {
      if (potatoes < b.price) {
        displayName = "???";
        displayPrice = b.price;
        displayIcon = "assets/mystery.png";
      } else {
        b.mystery = false;
        displayName = b.name;
        displayPrice = b.price;
        displayIcon = b.realIcon;
      }
    }
    buildingButton.innerHTML = `
      <div class="building-icon">
        <img src="${displayIcon}" class="building-image" draggable="false" width="60">
      </div>

      <div class="building-info">
        <div class="building-name-price">
          <h4 class="building-name">${displayName}</h4>
          <p class="building-price">
            <img src="assets/potato.png" class="potato-icon" draggable="false" width="15">
            <span class="price-value">${displayPrice}</span>
          </p>
        </div>

        <div class="building-amount">
          <p class="amount-owned">${b.owned}</p>
        </div>
      </div>
    `;

    const priceElement = buildingButton.querySelector(".building-price");

    if (!isNaN(b.price) && potatoes >= b.price) {
      priceElement.style.color = "lightgreen";
      buildingButton.style.backgroundColor = "#37495a";
      buildingButton.style.cursor = "pointer";
    } else {
      priceElement.style.color = "rgb(209, 73, 73)";
      buildingButton.style.backgroundColor = "#212d38";
      buildingButton.style.cursor = "cursor";
}

    buildingButton.addEventListener("click", () => {
      if (!b.mystery && potatoes >= b.price) {
        buildingsOwned++;
        b.owned++;
        potatoes -= b.price;
        b.price = Math.ceil(b.price * 1.15);
        buildingAutoClicker(b.cps);
        renderBuildings();
        updatePotatoDisplay();
      }
    });

    container.appendChild(buildingButton);
  });
}

function unlockBuilding(id) {
  const b = buildings.find((b) => b.id === id);
  if (!b) return;

  b.unlocked = true;
  renderBuildings();
}

function buildingAutoClicker(amount) {
  autoClickAmount = autoClickAmount + amount;
}

goldenPotatoImage.classList.add("hidden");
scheduleNextGoldenPotato();

input.addEventListener("blur", () => {
  if (!input.value) {
    input.value = "My Potato Farm";
  } else if (!input.value.endsWith("’s Potato Farm")) {
    input.value = input.value.trim() + "’s Potato Farm";
  }
});

openBtn.addEventListener("click", () => {
  modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("open");
});

openBtns.addEventListener("click", () => {
  modals.classList.add("open");
});

closeBtns.addEventListener("click", () => {
  modals.classList.remove("open");
});

openBtno.addEventListener("click", () => {
  modalo.classList.add("open");
});

closeBtno.addEventListener("click", () => {
  modalo.classList.remove("open");
});

openBtnv.addEventListener("click", () => {
  modalo.classList.add("open");
});

clickArea.addEventListener("click", (e) => {
  const rect = clickArea.getBoundingClientRect();

  // --- +1 trail ---
  const trail = document.createElement("div");
  trail.className = "trail";
  const offsetX = Math.random() * 40 - 20;
  trail.style.left = e.clientX - rect.left + offsetX + "px";
  trail.style.top = e.clientY - rect.top - 20 + "px";
  trail.textContent = `+${potatoesPerClick}`;
  clickArea.appendChild(trail);
  setTimeout(() => trail.remove(), 1000);

  // --- Potato image jump ---
  const potato = document.createElement("img");
  potato.src = "assets/potato.png";
  potato.className = "jump-image";
  potato.style.left = e.clientX - rect.left - 20 + "px";
  potato.style.top = e.clientY - rect.top - 20 + "px";
  potato.style.opacity = "1";
  clickArea.appendChild(potato);

  // Jump physics
  let velocityY = -6 - Math.random() * 2; // same jump
  let velocityX = Math.random() * 4 - 2; // same drift
  const gravity = 0.55;
  let posX = e.clientX - rect.left - 20;
  let posY = e.clientY - rect.top - 20;

  // Rotation
  let rotation = Math.random() * 360; // random start rotation
  let rotationSpeed = Math.random() * 10 - 5; // random rotation speed

  // Fade timer
  let opacity = 1;
  const fadeSpeed = 0.05; // fade faster

  const animation = setInterval(() => {
    velocityY += gravity;
    posY += velocityY;
    posX += velocityX;

    rotation += rotationSpeed;
    opacity -= fadeSpeed;

    potato.style.top = posY + "px";
    potato.style.left = posX + "px";
    potato.style.transform = `rotate(${rotation}deg)`;
    potato.style.opacity = opacity;

    // Remove when opacity is zero or falls below click
    if (opacity <= 0 || posY > e.clientY - rect.top) {
      clearInterval(animation);
      potato.remove();
    }
  }, 16);
});

function autoClick() {
  potatoes += autoClickAmount / 20;
  allTimePotatoes += autoClickAmount / 20;
  updatePotatoDisplay();
  setTimeout(autoClick, 50);
}

function autoSave() {
  setLocalData();
  setTimeout(autoSave, 60000);
}

function renderBuildingsRegular() {
  renderBuildings()
  setTimeout(renderBuildingsRegular, 1000);
}

getLocalData();
rateCounter();
updatePotatoComments();
updateStatsDisplay();
autoClick();
renderBuildingsRegular();
autoSave();
