const clickerButton = document.getElementById("potato-button");
const clickerCountDisplay = document.getElementById("potato-amount");
const titleElement = document.getElementById("title");
const comments = document.getElementById("comment");
const comments_mobile = document.getElementById("comment-mobile");
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
const rawPotatoesPerSecondElement = document.getElementById(
  "rawPotatoesPerSecond",
);
const potatoesPerClickElement = document.getElementById("potatoesPerClick");
const potatoClicksElement = document.getElementById("potatoClicks");
const handFarmedPotatoesElement = document.getElementById("handFarmedPotatoes");
const goldenPotatoClicksElement = document.getElementById("goldenPotatoClicks");
const runningVersionElement = document.getElementById("runningVersion");
const versionElement = document.getElementById("version");
const clickArea = document.getElementById("potato-button");
const goldenPotato = document.getElementById("golden-potato-button");
const goldenPotatoImage = document.getElementById("golden-potato");
const SAVE_KEY_V2 = "potato_clicker_save_v2";
const upgradeTotalElement = document.getElementById("upgrades-text");
const openOptionsMobile = document.getElementById("openModalOptions_mobile");
const openStatsMobile = document.getElementById("openModalStats_mobile");
const openInfoMobile = document.getElementById("openModalInfo_mobile");
const accountStatus = document.getElementById("accountStatus"); // <-- added

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
let runningVersion = "v0.48";
let autoClickAmount = 0;
let runDurationSeconds;
let totalUpgrades = 0;
let frenzy = false;
let half_price_amount = 1;
let click_boost = false;

// ================== BUILDINGS ==================
let buildings = [
  {
    id: "cursor",
    name: "Peeler",
    price: 15,
    owned: 0,
    icon: "assets/cursor.png",
    realIcon: "assets/cursor.png",
    baseCps: 0.1,
    cpsMultiplier: 1,
    cps: 0.1,
    unlocked: false,
    sort: 1,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "farmer",
    name: "Farmer",
    price: 100,
    owned: 0,
    icon: "assets/farmer.png",
    realIcon: "assets/farmer.png",
    baseCps: 1,
    cpsMultiplier: 1,
    cps: 1,
    unlocked: false,
    sort: 2,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "tractor",
    name: "Tractor",
    price: 1100,
    owned: 0,
    icon: "assets/tractor.png",
    realIcon: "assets/tractor.png",
    baseCps: 8,
    cpsMultiplier: 1,
    cps: 8,
    unlocked: false,
    sort: 3,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    price: 12000,
    owned: 0,
    icon: "assets/greenhouse.png",
    realIcon: "assets/greenhouse.png",
    baseCps: 30,
    cpsMultiplier: 1,
    cps: 30,
    unlocked: false,
    sort: 4,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "chip_factory",
    name: "Chip Factory",
    price: 150000,
    owned: 0,
    icon: "assets/chip_factory.png",
    realIcon: "assets/chip_factory.png",
    baseCps: 260,
    cpsMultiplier: 1,
    cps: 260,
    unlocked: false,
    sort: 5,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "restaurant",
    name: "Restaurant",
    price: 1400000,
    owned: 0,
    icon: "assets/restaurant.png",
    realIcon: "assets/restaurant.png",
    baseCps: 1400,
    cpsMultiplier: 1,
    cps: 1400,
    unlocked: false,
    sort: 6,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "supermarket",
    name: "Supermarket",
    price: 20000000,
    owned: 0,
    icon: "assets/supermarket.png",
    realIcon: "assets/supermarket.png",
    baseCps: 7800,
    cpsMultiplier: 1,
    cps: 7800,
    unlocked: false,
    sort: 7,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "distillary",
    name: "Distillary",
    price: 330000000,
    owned: 0,
    icon: "assets/distillary.png",
    realIcon: "assets/distillary.png",
    baseCps: 44000,
    cpsMultiplier: 1,
    cps: 44000,
    unlocked: false,
    sort: 8,
    mystery: true,
    totalGenerated: 0,
  },
  {
    id: "airport",
    name: "Airport",
    price: 5100000000,
    owned: 0,
    icon: "assets/airport.png",
    realIcon: "assets/airport.png",
    baseCps: 260000,
    cpsMultiplier: 1,
    cps: 260000,
    unlocked: false,
    sort: 9,
    mystery: true,
    totalGenerated: 0,
  },
];

// ================== UPGRADES ==================
let upgrades = [
  {
    id: "peelerx2_1",
    name: "Increased grip strength",
    description: "Your peelers work harder.",
    effect: "x2 Potatoes per click & x2 Peeler Building power.",
    price: 100,
    icon: "assets/upgrades/peeler_+2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "peelerx2_2",
    name: "Reinforced peeling",
    description: "Your peelers are tough",
    effect: "x2 Potatoes per click & x2 Peeler Building power.",
    price: 500,
    icon: "assets/upgrades/peeler_x2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "peelerx2_3",
    name: "Razor sharp peeler",
    description: "Each peeler is more efficient",
    effect: "x2 Potatoes per click & x2 Peeler Building power.",
    price: 10000,
    icon: "assets/upgrades/peelerx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "farmerx2_1",
    name: "Farming Aprentiships",
    description: "Your farmers are more experienced",
    effect: "x2 Farmer Potatoes",
    price: 1000,
    icon: "assets/upgrades/farmerx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "farmerx2_2",
    name: "Farming University",
    description: "Your farmers are smart",
    effect: "x2 Farmer Potatoes",
    price: 5000,
    icon: "assets/upgrades/farmerx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "farmerx2_3",
    name: "Farming Degree's",
    description: "Your farmers are even more smarter",
    effect: "x2 Farmer Potatoes",
    price: 100000,
    icon: "assets/upgrades/farmerx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "tractorx2_1",
    name: "Larger tires",
    description: "Tractors now come with larger wheels",
    effect: "x2 Tractor Potatoes",
    price: 10000,
    icon: "assets/upgrades/tractorx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "tractorx2_2",
    name: "More horsepower",
    description: "Engine power has doubled!",
    effect: "x2 Tractor Potatoes",
    price: 50000,
    icon: "assets/upgrades/tractorx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "tractorx2_3",
    name: "Newer Model",
    description: "Bought straight from the salon.",
    effect: "x2 Tractor Potatoes",
    price: 1000000,
    icon: "assets/upgrades/tractorx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "greenhousex2_1",
    name: "Tempered glass windows",
    description: "Greenhouses are safer and more productive",
    effect: "x2 Greenhouse Potatoes",
    price: 120000,
    icon: "assets/upgrades/greenhousex2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "greenhousex2_2",
    name: "The taller, the better!",
    description: "Greenhouses have 2 floors now.",
    effect: "x2 Greenhouse Potatoes",
    price: 600000,
    icon: "assets/upgrades/greenhousex2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "greenhousex2_3",
    name: "What's better than walking... Levitation!",
    description: "Greenhouses have a lift!",
    effect: "x2 Greenhouse Potatoes",
    price: 12000000,
    icon: "assets/upgrades/greenhousex2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "chipfactoryx2_1",
    name: "Marketing",
    description: "Increasing the demand for home-made chips",
    effect: "x2 Chip Factory Potatoes",
    price: 1200000,
    icon: "assets/upgrades/chipfactoryx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "chipfactoryx2_2",
    name: "Addictive Chemicals",
    description: "Chips are now part of your 5 a day",
    effect: "x2 Chip Factory Potatoes",
    price: 6000000,
    icon: "assets/upgrades/chipfactoryx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "chipfactoryx2_3",
    name: "Happy Chip Bundles",
    description: "Marketing strategy to increase sales.",
    effect: "x2 Chip Factory Potatoes",
    price: 120000000,
    icon: "assets/upgrades/chipfactoryx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "restaurantx2_1",
    name: "Cleaning staff",
    description: "People are more likely to have a meal here.",
    effect: "x2 Restaurant Potatoes",
    price: 14000000,
    icon: "assets/upgrades/restaurantx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "restaurantx2_2",
    name: "Buffet",
    description: "A buffet has been added to every restaurant you own!",
    effect: "x2 Restaurant Potatoes",
    price: 70000000,
    icon: "assets/upgrades/restaurantx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "restaurantx2_3",
    name: "VIP Service",
    description: "VIP service is offered to celebrities",
    effect: "x2 Restaurant Potatoes",
    price: 1400000000,
    icon: "assets/upgrades/restaurantx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "supermarketx2_1",
    name: "Everyday restocking",
    description: "Ensuring that any kind of potato can be bought.",
    effect: "x2 Supermarket Potatoes.",
    price: 800000000,
    icon: "assets/upgrades/supermarketx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "supermarketx2_2",
    name: "Rewards Systems",
    description: "Customers are more likely to come back for the rewards.",
    effect: "x2 Supermarket Potatoes.",
    price: 4000000000,
    icon: "assets/upgrades/supermarketx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "supermarketx2_3",
    name: "Double Floor",
    description: "Larger supermarket = More customers",
    effect: "x2 Supermarket Potatoes.",
    price: 800000000000,
    icon: "assets/upgrades/supermarketx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "distillaryx2_1",
    name: "Larger Capacity",
    description: "Can hold double the load.",
    effect: "x2 Distillary Potatoes.",
    price: 50000000000,
    icon: "assets/upgrades/distillaryx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "distillaryx2_2",
    name: "Reinforced security.",
    description: "Less likely to be stolen from.",
    effect: "x2 Distillary Potatoes.",
    price: 250000000000,
    icon: "assets/upgrades/distillaryx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "distillaryx2_3",
    name: "Better tasting",
    description: "Your business attracts more customers.",
    effect: "x2 Distillary Potatoes.",
    price: 50000000000000,
    icon: "assets/upgrades/distillaryx2_3.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "airportx2_1",
    name: "New runway",
    description: "More plane exports.",
    effect: "x2 Airport Potatoes",
    price: 400000000000,
    icon: "assets/upgrades/airportx2_1.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "airportx2_2",
    name: "Destination Expansion",
    description: "More trade routes",
    effect: "x2 Airport Potatoes",
    price: 2000000000000,
    icon: "assets/upgrades/airportx2_2.png",
    unlocked: false,
    completed: false,
  },
  {
    id: "airportx2_3",
    name: "Better planes",
    description: "Each plane has double the power",
    effect: "x2 Airport Potatoes",
    price: 400000000000000,
    icon: "assets/upgrades/airportx2_3.png",
    unlocked: false,
    completed: false,
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

const comment_names = [
  "Max",
  "Oliver",
  "William",
  "Arthur",
  "Rohan",
  "Kaiden",
  "Leon",
  "David",
  "Ryan",
  "Milo",
  "Rowan",
];

function random_name() {
  return comment_names[Math.floor(Math.random() * comment_names.length)];
}

var comment_types = {
  none: [
    "Nobody is talking about your potatoes.",
    "Your potatoes are non-existent.",
    "You have no potatoes to discuss.",
    "Your potatoes are invisible to the world.",
  ],
  under100: [
    "Your potatoes are being ignored.",
    "Many people overlook your potatoes.",
    "Your potatoes are not getting any attention.",
    "Your potatoes are infected.",
  ],
  _1000to5000: [
    "Your potatoes are getting some attention.",
    "A few people are noticing your potatoes.",
    "You are making a few sales a day.",
    () => `A kid called one of your potatoes '${random_name()}'.`,
  ],
  _5000to20000: [
    "Your potatoes business is rising!",
    "People are starting to leave reviews about your stall.",
    "People are using your potatoes.",
    "Your potatoes are a 7/10!",
  ],
  _20000to100000: [
    "Your potatoes are going viral on social media!",
    "People are talking about your potatoes.",
    "People are queuing up for some potatoes.",
    "Your potatoes are on the newspaper!",
  ],
  _100000to500000: [
    "You have daily customers that are visiting every day.",
    "Your potatoes are used in everyones meals.",
    "People are asking you for advise to start their own stalls.",
    "Your potatoes stand out against all the other competitors.",
  ],
  _500000to1000000: [
    "You have been invited on the news!",
    "Your have moved to a larger building to sell your potatoes.",
    "Your towns flag is a giant potato!",
    "People are traveling hours just to get a glimpse of your potatoes.",
    "Grandma Vero enjoyed your potatoes.",
    "Everyone loves your potatoes!!",
  ],
  _1000000to10000000: [
    "The king has asked if he can try your potatoes.",
    "People have pre-ordered your potato merch.",
    "You should probably get off the game at this point...",
    "'Potion Clicker' has overtaken you in sales.",
    "Your potatoes are No.1 in the country.",
    "Keep clicking...",
  ],
  _10000000to50000000: [
    "Your potatoes have their own website!",
    "Potatoes are your countries national dish.",
    "Just keep going...",
    "Try to get 1st on the leaderboard!",
    "Leon likes your potatoes.",
    "Make an account and save your potatoes.",
  ],
};

function setCommentSmooth(text) {
  comments.style.opacity = "0";
  comments_mobile.style.opacity = "0";

  setTimeout(() => {
    comments.innerText = text;
    comments.style.opacity = "1";
    comments_mobile.innerText = text;
    comments_mobile.style.opacity = "1";
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
      comment_types.under100[
        Math.floor(Math.random() * comment_types.under100.length)
      ];
  } else if (potatoes < 5000) {
    newComment =
      comment_types._1000to5000[
        Math.floor(Math.random() * comment_types._1000to5000.length)
      ];
  } else if (potatoes < 20000) {
    newComment =
      comment_types._5000to20000[
        Math.floor(Math.random() * comment_types._5000to20000.length)
      ];
  } else if (potatoes < 100000) {
    newComment =
      comment_types._20000to100000[
        Math.floor(Math.random() * comment_types._20000to100000.length)
      ];
  } else if (potatoes < 500000) {
    newComment =
      comment_types._100000to500000[
        Math.floor(Math.random() * comment_types._100000to500000.length)
      ];
  } else if (potatoes < 1000000) {
    newComment =
      comment_types._500000to1000000[
        Math.floor(Math.random() * comment_types._500000to1000000.length)
      ];
  } else {
    newComment =
      comment_types._1000000to10000000[
        Math.floor(Math.random() * comment_types._1000000to10000000.length)
      ];
  }

  if (typeof newComment === "function") {
    newComment = newComment();
  }

  setCommentSmooth(newComment);
}

function formatNumber(num) {
  if (num >= 1_000_000_000_000) {
    return (
      (num / 1_000_000_000_000).toFixed(2).replace(/\.?0+$/, "") + " trillion"
    );
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + " billion";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + " million";
  } else {
    return num.toLocaleString();
  }
}

function updatePotatoDisplay() {
  if (potatoes === 1) {
    clickerCountDisplay.innerText = Math.floor(potatoes) + " potato";
    titleElement.innerText = Math.floor(potatoes) + " potato - Potato Clicker";
    return;
  } else {
    clickerCountDisplay.innerText =
      formatNumber(Math.floor(potatoes)) + " potatoes";
    titleElement.innerText =
      formatNumber(Math.floor(potatoes)) + " potatoes - Potato Clicker";
  }
}

function rateCounter() {
  document.querySelector(".potato-amount-persecond").innerText =
    "per second: " +
    (Math.floor(autoClickAmount * 10 * frenzy_amount) / 10).toLocaleString();
  setTimeout(rateCounter, 1000);
}

function formatRunTime(seconds) {
  seconds = Math.floor(seconds);

  const YEAR = 365 * 24 * 3600;
  const DAY = 24 * 3600;
  const HOUR = 3600;

  const years = Math.floor(seconds / YEAR);
  seconds %= YEAR;

  const days = Math.floor(seconds / DAY);
  seconds %= DAY;

  const hours = Math.floor(seconds / HOUR);

  const parts = [];
  if (years) parts.push(`${years} years`);
  if (days || years) parts.push(`${days} days`);
  parts.push(`${hours} hours`);

  return parts.join(" ");
}

function updateStatsDisplay() {
  potatoesCountElement.innerText =
    "Potatoes in bank: " + formatNumber(Math.floor(potatoes * 10) / 10);
  allTimePotatoesElement.innerText =
    "Potatoes gathered (all time): " +
    formatNumber(Math.floor(allTimePotatoes * 10) / 10);
  runDurationSeconds = Math.floor((Date.now() - runStartTime) / 1000);
  runStartTimeElement.innerText =
    "Run started: " + formatRunTime(runDurationSeconds) + " ago";
  buildingsOwnedElement.innerText = "Buildings owned: " + buildingsOwned;
  potatoesPerSecondElement.innerText =
    "Potatoes per second: " + Math.floor(autoClickAmount * 10) / 10;
  potatoesPerClickElement.innerText =
    "Potatoes per click: " + formatNumber(potatoesPerClick);
  potatoClicksElement.innerText = "Potato clicks: " + potatoClicks;
  handFarmedPotatoesElement.innerText =
    "Hand-farmed potatoes: " + formatNumber(handFarmedPotatoes);
  goldenPotatoClicksElement.innerText =
    "Golden potato clicks: " + goldenPotatoClicks;
  runningVersionElement.innerText = "Running version: " + runningVersion;
  versionElement.innerText = runningVersion;
  upgradeTotalElement.innerText = `Upgrades unlocked: ${totalUpgrades}/27 (${Math.floor((totalUpgrades / 27) * 100 * 10) / 10}%)`;
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

// NEW: build save object helper
function getSaveObject() {
  const save = {
    version: runningVersion,
    stats: {
      potatoes,
      allTimePotatoes,
      runStartedAt: Date.now() - (runDurationSeconds || 0) * 1000,
      potatoesPerClick,
      autoClickAmount,
      potatoClicks,
      handFarmedPotatoes,
      goldenPotatoClicks,
      buildingsOwned,
      totalUpgrades,
    },
    buildings: {},
    upgrades: {},
  };

  buildings.forEach((b) => {
    save.buildings[b.id] = {
      owned: b.owned,
      mystery: b.mystery,
      totalGenerated: b.totalGenerated,
      cpsMultiplier: b.cpsMultiplier,
    };
  });

  upgrades.forEach((u) => {
    save.upgrades[u.id] = {
      unlocked: u.unlocked,
      completed: u.completed,
    };
  });

  return save;
}

// existing saveGame now uses helper
async function saveGame() {
  const save = getSaveObject();
  // persist locally
  localStorage.setItem(SAVE_KEY_V2, JSON.stringify(save));

  // if logged in, attempt server sync and show status
  if (window.authApi && window.authApi.getToken()) {
    try {
      await window.authApi.save(save);
      if (accountStatus) {
        accountStatus.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
        setTimeout(() => {
          if (accountStatus) accountStatus.textContent = " ";
        }, 4000);
      }
      console.log("saveGame: remote sync successful");
    } catch (e) {
      console.warn("saveGame: remote sync failed", e);
      if (accountStatus) {
        accountStatus.textContent = "Save failed (network)";
        setTimeout(() => {
          if (accountStatus) accountStatus.textContent = " ";
        }, 4000);
      }
    }
  } else {
    // not logged in - indicate local save
    if (accountStatus) {
      accountStatus.textContent = "Saved locally";
      setTimeout(() => {
        if (accountStatus) accountStatus.textContent = " ";
      }, 2000);
    }
  }
}

// Manual save wrapper for button (gives immediate feedback)
function saveGameManual() {
  const btn = document.getElementById("saveButton");
  if (btn) {
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = "<p>Saving...</p>";
    Promise.resolve(saveGame())
      .catch(() => {}) // saveGame already handles feedback
      .finally(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      });
  }
}

function loadGame() {
  // If logged in, attempt to load from server first
  if (window.authApi && window.authApi.getToken()) {
    window.authApi
      .load()
      .then((remoteSave) => {
        if (remoteSave && remoteSave.stats) {
          loadV2(remoteSave);
        } else {
          // fallback to local
          const save = localStorage.getItem(SAVE_KEY_V2);
          if (save) loadV2(JSON.parse(save));
          else migrateOldSave();
        }
      })
      .catch(() => {
        // remote load failed -> fallback to local
        const save = localStorage.getItem(SAVE_KEY_V2);
        if (save) loadV2(JSON.parse(save));
        else migrateOldSave();
      });
    return;
  }

  const save = localStorage.getItem(SAVE_KEY_V2);
  if (save) loadV2(JSON.parse(save));
  else migrateOldSave();
}

function loadV2(save) {
  const s = save.stats;

  potatoes = s.potatoes;
  allTimePotatoes = s.allTimePotatoes;
  runStartTime = s.runStartedAt;
  potatoesPerClick = s.potatoesPerClick;
  autoClickAmount = s.autoClickAmount;
  potatoClicks = s.potatoClicks;
  handFarmedPotatoes = s.handFarmedPotatoes;
  goldenPotatoClicks = s.goldenPotatoClicks;
  buildingsOwned = s.buildingsOwned;
  totalUpgrades = s.totalUpgrades;

  buildings.forEach((b) => {
    const data = save.buildings[b.id];
    if (!data) return;
    b.owned = data.owned;
    b.mystery = data.mystery;
    b.price = Math.ceil(b.price * Math.pow(1.15, b.owned));
    b.totalGenerated = data.totalGenerated || 0;
    b.cpsMultiplier = data.cpsMultiplier || 1;
  });

  upgrades.forEach((u) => {
    const data = save.upgrades[u.id];
    if (!data) return;
    u.unlocked = data.unlocked;
    u.completed = data.completed;
  });

  if (potatoesPerClick === 0 || potatoesPerClick > 8) {
    potatoesPerClick = 8;
  }

  calculateAutoClick();
}

function migrateOldSave() {
  potatoes = +localStorage.getItem("potatoes") || 0;
  allTimePotatoes = +localStorage.getItem("potatoes_gathered") || 0;
  potatoesPerClick = +localStorage.getItem("potatoes_per_click") || 1;
  autoClickAmount = +localStorage.getItem("potatoes_per_second") || 0;
  potatoClicks = +localStorage.getItem("potato_clicks") || 0;
  handFarmedPotatoes = +localStorage.getItem("hand_farmed_potatoes") || 0;
  goldenPotatoClicks = +localStorage.getItem("golden_potato_clicks") || 0;
  buildingsOwned = +localStorage.getItem("buildings_owned") || 0;

  const map = {
    cursor: "cursors",
    farmer: "farmers",
    tractor: "tractors",
    greenhouse: "greenhouses",
    chip_factory: "chip_factorys",
    restaurant: "restaurants",
    supermarket: "supermarkets",
    distillary: "distillarys",
    airport: "airports",
  };

  buildings.forEach((b) => {
    b.owned = +localStorage.getItem(map[b.id]) || 0;
    b.mystery = JSON.parse(localStorage.getItem(`${b.id}_mystery`) || "true");
    b.price = Math.ceil(b.price * Math.pow(1.15, b.owned));
    b.totalGenerated = 0;
    b.cpsMultiplier = 1;
  });

  saveGame();
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
  renderUpgrades();
  setTimeout(() => {
    clickerButton.disabled = false;
  }, 85);
});

const GOLDEN_DELAY = 1000 * 1000;
const GOLDEN_VISIBLE_TIME = 10 * 1000;

let spawnTimeout = null;
let hideTimeout = null;

let goldenPotatoVariants = ["normal", "frenzy", "half_price"];

goldenPotatoImage.addEventListener("click", (e) => {
  let goldenPotatoVariant =
    goldenPotatoVariants[
      Math.floor(Math.random() * goldenPotatoVariants.length)
    ];
  const text = document.createElement("div");
  text.className = "text";
  let reward = 0;
  if (goldenPotatoVariant == "normal") {
    text.textContent = `Lucky, ${autoClickAmount * 1000} Potatoes!`;
    reward = autoClickAmount * 1000;
  } else if (goldenPotatoVariant == "frenzy") {
    text.textContent = `3 Minute Frenzy!`;
    frenzy = true;
    setTimeout(
      () => {
        frenzy = false;
      },
      3 * 60 * 1000,
    );
  } else if (goldenPotatoVariant == "half_price") {
    text.textContent = `3 Minute Half Price!`;
    half_price_amount = 0.5;
    setTimeout(
      () => {
        half_price_amount = 1;
      },
      3 * 60 * 1000,
    );
  }

  text.style.left = e.clientX + (Math.random() * 40 - 20) + "px";
  text.style.top = e.clientY - 20 + "px";
  document.body.appendChild(text);
  setTimeout(() => text.remove(), 1000);

  potatoes += reward;
  allTimePotatoes += reward;
  goldenPotatoClicks++;

  updatePotatoDisplay();
  renderBuildings();
  renderUpgrades();
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

const tooltip = document.getElementById("tooltip");

function showTooltip(html, anchorElement) {
  tooltip.innerHTML = html;
  tooltip.classList.remove("hidden");
  tooltip.classList.add("shown");

  const rect = anchorElement.getBoundingClientRect();
  const tooltipWidth = tooltip.offsetWidth;

  let left = rect.left - tooltipWidth - 10;
  let top = rect.top;

  if (left < 8) {
    left = rect.right + 10;
  }

  tooltip.style.left = left + "px";
  tooltip.style.top = top + "px";
}

function hideTooltip() {
  tooltip.classList.remove("shown");
  setTimeout(() => tooltip.classList.add("hidden"), 150);
}

function renderUpgrades() {
  const container = document.getElementById("upgrades");
  container.innerHTML = "";

  upgrades.forEach((u) => {
    // Unlock based on building ownership
    if (
      (u.id.includes("peelerx2_1") || u.id.includes("peelerx2_2")) &&
      buildings.find((b) => b.id === "cursor").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("farmerx2_1") || u.id.includes("farmerx2_2")) &&
      buildings.find((b) => b.id === "farmer").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("tractorx2_1") || u.id.includes("tractorx2_2")) &&
      buildings.find((b) => b.id === "tractor").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("greenhousex2_1") || u.id.includes("greenhousex2_2")) &&
      buildings.find((b) => b.id === "greenhouse").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("chipfactoryx2_1") || u.id.includes("chipfactoryx2_2")) &&
      buildings.find((b) => b.id === "chip_factory").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("restaurantx2_1") || u.id.includes("restaurantx2_2")) &&
      buildings.find((b) => b.id === "restaurant").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("supermarketx2_1") || u.id.includes("supermarketx2_2")) &&
      buildings.find((b) => b.id === "supermarket").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("distillaryx2_1") || u.id.includes("distillaryx2_2")) &&
      buildings.find((b) => b.id === "distillary").owned >= 1
    )
      u.unlocked = !u.completed;
    if (
      (u.id.includes("airportx2_1") || u.id.includes("airportx2_2")) &&
      buildings.find((b) => b.id === "airport").owned >= 1
    )
      u.unlocked = !u.completed;

    // Unlock after 10 Buildings
    if (
      u.id.includes("peelerx2_3") &&
      buildings.find((b) => b.id === "cursor").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("farmerx2_3") &&
      buildings.find((b) => b.id === "farmer").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("tractorx2_3") &&
      buildings.find((b) => b.id === "tractor").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("greenhousex2_3") &&
      buildings.find((b) => b.id === "greenhouse").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("chipfactoryx2_3") &&
      buildings.find((b) => b.id === "chip_factory").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("restaurantx2_3") &&
      buildings.find((b) => b.id === "restaurant").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("supermarketx2_3") &&
      buildings.find((b) => b.id === "supermarket").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("distillaryx2_3") &&
      buildings.find((b) => b.id === "distillary").owned >= 10
    )
      u.unlocked = !u.completed;
    if (
      u.id.includes("airportx2_3") &&
      buildings.find((b) => b.id === "airport").owned >= 10
    )
      u.unlocked = !u.completed;
  });

  const visible = upgrades
    .filter((u) => u.unlocked && !u.completed)
    .sort((a, b) => a.price - b.price);

  visible.forEach((u) => {
    const upgradeButton = document.createElement("button");
    upgradeButton.className = "upgrades-container";

    upgradeButton.innerHTML = `<img src="${u.icon}" draggable="false" class="upgrade-button" width="70" />`;
    upgradeButton.style.opacity =
      potatoes >= u.price * half_price_amount ? 1 : 0.5;

    upgradeButton.addEventListener("mouseenter", () => {
      showTooltip(
        `
        <div class="title">${u.name}</div>
        <div>${u.description}</div>
        <div class="effect">${u.effect}</div>
        <div class="price">Cost: ${formatNumber(u.price * half_price_amount)} potatoes</div>
      `,
        upgradeButton,
      );
    });
    upgradeButton.addEventListener("mouseleave", hideTooltip);

    upgradeButton.addEventListener("click", () => {
      if (potatoes < u.price * half_price_amount) return;
      potatoes -= u.price * half_price_amount;
      u.completed = true;
      u.unlocked = false;
      totalUpgrades++;

      if (u.id.includes("peeler")) {
        const peeler = buildings.find((b) => b.id === "cursor");
        peeler.cpsMultiplier *= 2;
        potatoesPerClick *= 2;
      }
      if (u.id.includes("farmer"))
        buildings.find((b) => b.id === "farmer").cpsMultiplier *= 2;
      if (u.id.includes("tractor"))
        buildings.find((b) => b.id === "tractor").cpsMultiplier *= 2;
      if (u.id.includes("greenhouse"))
        buildings.find((b) => b.id === "greenhouse").cpsMultiplier *= 2;
      if (u.id.includes("chipfactory"))
        buildings.find((b) => b.id === "chip_factory").cpsMultiplier *= 2;
      if (u.id.includes("restaurant"))
        buildings.find((b) => b.id === "restaurant").cpsMultiplier *= 2;
      if (u.id.includes("supermarket"))
        buildings.find((b) => b.id === "supermarket").cpsMultiplier *= 2;
      if (u.id.includes("distillary"))
        buildings.find((b) => b.id === "distillary").cpsMultiplier *= 2;
      if (u.id.includes("airport"))
        buildings.find((b) => b.id === "airport").cpsMultiplier *= 2;

      calculateAutoClick();
      updatePotatoDisplay();
      renderBuildings();
      renderUpgrades();
    });

    container.appendChild(upgradeButton);
  });
}

function unlockUpgrade(id) {
  const u = upgrades.find((u) => u.id === id);
  if (!u) return;

  u.unlocked = true;
  renderUpgrades();
}

function renderBuildings() {
  enforceMysteryLimit();
  const container = document.getElementById("buildings");
  container.innerHTML = "";

  const visible = buildings
    .filter((b) => b.unlocked)
    .sort((a, b) => a.sort - b.sort);

  visible.forEach((b) => {
    const buildingButton = document.createElement("button");
    buildingButton.className = "building-container";

    let displayName = b.name;
    let displayPrice = b.price * half_price_amount;
    let displayIcon = b.realIcon;

    if (b.mystery) {
      if (potatoes < b.price * half_price_amount) {
        displayName = "???";
        displayPrice = b.price * half_price_amount;
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
            <span class="price-value">${formatNumber(displayPrice)}</span>
          </p>
        </div>

        <div class="building-amount">
          <p class="amount-owned">${b.owned}</p>
        </div>
      </div>
    `;

    const priceElement = buildingButton.querySelector(".building-price");

    if (
      !isNaN(b.price * half_price_amount) &&
      potatoes >= b.price * half_price_amount
    ) {
      priceElement.style.color = "lightgreen";
      buildingButton.style.backgroundColor = "#37495a";
      buildingButton.style.cursor = "pointer";
    } else {
      priceElement.style.color = "rgb(209, 73, 73)";
      buildingButton.style.backgroundColor = "#212d38";
      buildingButton.style.cursor = "default";
    }

    buildingButton.addEventListener("mouseenter", () => {
      if (!b.mystery) {
        const html = `
          <div class="title">${b.name}</div>
          <div>Price: ${formatNumber(b.price)} potatoes</div>
          <div>Owned: ${b.owned}</div>
          <div>Total income generated: ${Math.floor(b.totalGenerated)}</div>
          <div>Income per second: ${Math.floor(b.cps * b.owned * 10) / 10}</div>
        `;
        showTooltip(html, buildingButton);
      } else {
        const html = `
          <div class="title">???</div>
          <div>Price: ${formatNumber(b.price)} potatoes</div>
        `;
        showTooltip(html, buildingButton);
      }
    });

    buildingButton.addEventListener("mouseleave", hideTooltip);

    buildingButton.addEventListener("click", () => {
      if (!b.mystery && potatoes >= b.price * half_price_amount) {
        buildingsOwned++;
        b.owned++;
        potatoes -= b.price * half_price_amount;
        b.price = Math.ceil(b.price * 1.15);

        calculateAutoClick();
        updatePotatoDisplay();
        renderBuildings();
        renderUpgrades();
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
  renderUpgrades();

  // Call the save function from the server.js file
  window.authApi.save();
}

function calculateAutoClick() {
  buildings.forEach((b) => (b.cps = b.baseCps * b.cpsMultiplier));
  autoClickAmount = buildings.reduce((total, b) => total + b.cps * b.owned, 0);
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

openOptionsMobile.addEventListener("click", () => {
  modalo.classList.add("open");
  modalo.style.display = "flex";
});

openStatsMobile.addEventListener("click", () => {
  modals.classList.add("open");
  modals.style.display = "flex";
});

openInfoMobile.addEventListener("click", () => {
  modal.classList.add("open");
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("open");
  modal.style.display = "none";
});

closeBtns.addEventListener("click", () => {
  modals.classList.remove("open");
  modals.style.display = "none";
});

closeBtno.addEventListener("click", () => {
  modalo.classList.remove("open");
  modalo.style.display = "none";
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

let frenzy_amount;

function autoClick() {
  if (frenzy === true) {
    frenzy_amount = 3;
  } else {
    frenzy_amount = 1;
  }
  const increment = (autoClickAmount * frenzy_amount) / 20;
  console.log(increment);
  potatoes += increment;
  allTimePotatoes += increment;

  buildings.forEach((b) => {
    const incomeFromThisBuilding = (b.cps * b.owned) / 20;
    b.totalGenerated += incomeFromThisBuilding;
  });

  updatePotatoDisplay();
  setTimeout(autoClick, 50);
}

// autosave: persist locally and sync to DB when signed in (awaited, logged)
async function autoSave() {
  const save = getSaveObject();
  // persist locally
  localStorage.setItem(SAVE_KEY_V2, JSON.stringify(save));

  // if logged in, attempt server sync and log errors
  try {
    if (window.authApi && window.authApi.getToken()) {
      await window.authApi.save(save);
      console.log("Autosave: remote sync successful");
    }
  } catch (e) {
    console.warn("Autosave: remote sync failed", e);
  }

  setTimeout(autoSave, 10000); // autosave every 10 seconds
}

function renderBuildingsRegular() {
  renderBuildings();
  setTimeout(renderBuildingsRegular, 1000);
}

function renderUpgradesRegular() {
  renderUpgrades();
  setTimeout(renderUpgradesRegular, 1000);
}

loadGame();
rateCounter();
updatePotatoComments();
updateStatsDisplay();
autoClick();
renderBuildingsRegular();
renderUpgradesRegular();
autoSave();
console.log(`
  ---------------------------------------------------------------
  Potato Clicker!
  ---------------------------------------------------------------
  This is the potato clicker console. Don't mess around here unless you know what you are doing as you may accidentally wipe your game save

  Have fun and get clicking!
     - MaxTheRock
`);
