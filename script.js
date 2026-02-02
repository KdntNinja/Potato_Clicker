//(() => {
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

  const openBtnsk = document.getElementById("openModalSkins");
  const closeBtnsk = document.getElementById("closeModalSkins");
  const modalsk = document.getElementById("modalskins");

  const closeBtncodes = document.getElementById("closeModalCodes");
  const modalcodes = document.getElementById("modalcodes");

  const closeModalAnouncements = document.getElementById("closeModalAnouncements");
  const modalanouncements = document.getElementById("modalanouncements");

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
  const achievmentTotalElement = document.getElementById("achievments-text");
  const openOptionsMobile = document.getElementById("openModalOptions_mobile");
  const openStatsMobile = document.getElementById("openModalStats_mobile");
  const openInfoMobile = document.getElementById("openModalInfo_mobile");
  const accountStatus = document.getElementById("accountStatus"); // <-- added

  const Codeinput = document.getElementById("codeInput");
  const Codebutton = document.getElementById("redeemCodeButton");
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  const tooltip = document.getElementById("tooltip");

  let tooltipHideTimeout = null;
  let mobileAutoHideTimeout = null;

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
  let runningVersion = "v0.60";
  let autoClickAmount = 0;
  let runDurationSeconds;
  let totalUpgrades = 0;
  let frenzy = false;
  let half_price_amount = 1;
  let click_boost = false;
  let storeCount = 0;
  let recentClicks = [];
  let lastUpgradeTime = Date.now();
  let idleTime = 0;
  let upgradeTime = 0;
  let lastDbSaveTime = Date.now();
  const DB_SAVE_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
  // ================== BUILDINGS ==================
  let buildings = [
    {
      id: "cursor",
      name: "Peeler",
      price: 15,
      basePrice: 15,
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
      basePrice: 100,
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
      basePrice: 1100,
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
      basePrice: 12000,
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
      basePrice: 150000,
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
      basePrice: 1400000,
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
      basePrice: 20000000,
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
      basePrice: 330000000,
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
      basePrice: 5100000000,
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
    {
      id: "space_station",
      name: "Space Station",
      price: 75000000000,
      basePrice: 75000000000,
      owned: 0,
      icon: "assets/space_station.png",
      realIcon: "assets/space_station.png",
      baseCps: 1600000,
      cpsMultiplier: 1,
      cps: 1600000,
      unlocked: false,
      sort: 10,
      mystery: true,
      totalGenerated: 0,
    },
    {
      id: "planet",
      name: "Planet",
      price: 1000000000000,
      basePrice: 1000000000000,
      owned: 0,
      icon: "assets/planet.png",
      realIcon: "assets/planet.png",
      baseCps: 10000000,
      cpsMultiplier: 1,
      cps: 10000000,
      unlocked: false,
      sort: 11,
      mystery: true,
      totalGenerated: 0,
    },
    {
      id: "intergalactic_farm",
      name: "Intergalactic Farm",
      price: 14000000000000,
      basePrice: 14000000000000,
      owned: 0,
      icon: "assets/intergalactic_farm.png",
      realIcon: "assets/intergalactic_farm.png",
      baseCps: 65000000,
      cpsMultiplier: 1,
      cps: 65000000,
      unlocked: false,
      sort: 12,
      mystery: true,
      totalGenerated: 0,
    },
    {
      id: "time_machine",
      name: "Time Machine",
      price: 170000000000000,
      basePrice: 170000000000000,
      owned: 0,
      icon: "assets/time_machine.png",
      realIcon: "assets/time_machine.png",
      baseCps: 430000000,
      cpsMultiplier: 1,
      cps: 430000000,
      unlocked: false,
      sort: 13,
      mystery: true,
      totalGenerated: 0,
    },
    {
      id: "quantum_reactor",
      name: "Quantum Reactor",
      price: 2100000000000000,
      basePrice: 2100000000000000,
      owned: 0,
      icon: "assets/quantum_reactor.png",
      realIcon: "assets/quantum_reactor.png",
      baseCps: 2900000000,
      cpsMultiplier: 1,
      cps: 2900000000,
      unlocked: false,
      sort: 14,
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
      id: "peelerx2_4",
      name: "Double edged peeler",
      description: "Each peeler is now double sided",
      effect: "x2 Potatoes per click & x2 Peeler Building power.",
      price: 100000,
      icon: "assets/upgrades/peelerx2_4.png",
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
      id: "farmerx2_4",
      name: "PhD in Farming",
      description: "Your farmers are the best in the world",
      effect: "x2 Farmer Potatoes",
      price: 1000000,
      icon: "assets/upgrades/farmerx2_4.png",
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
      id: "tractorx2_4",
      name: "Latest Model",
      description: "The best tractor money can buy.",
      effect: "x2 Tractor Potatoes",
      price: 10000000,
      icon: "assets/upgrades/tractorx2_4.png",
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
      id: "greenhousex2_4",
      name: "The Ultimate Greenhouse",
      description: "The most advanced greenhouse in the world!",
      effect: "x2 Greenhouse Potatoes",
      price: 120000000,
      icon: "assets/upgrades/greenhousex2_4.png",
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
      id: "chipfactoryx2_4",
      name: "The Ultimate Chip Factory",
      description: "The most advanced chip factory in the world!",
      effect: "x2 Chip Factory Potatoes",
      price: 1200000000,
      icon: "assets/upgrades/chipfactoryx2_4.png",
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
      id: "restaurantx2_4",
      name: "The Ultimate Restaurant",
      description: "The most advanced restaurant in the world!",
      effect: "x2 Restaurant Potatoes",
      price: 14000000000,
      icon: "assets/upgrades/restaurantx2_4.png",
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
      id: "supermarketx2_4",
      name: "The Ultimate Supermarket",
      description: "The most advanced supermarket in the world!",
      effect: "x2 Supermarket Potatoes.",
      price: 8000000000000,
      icon: "assets/upgrades/supermarketx2_4.png",
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
      id: "distillaryx2_4",
      name: "The Ultimate Distillery",
      description: "The most advanced distillery in the world!",
      effect: "x2 Distillary Potatoes.",
      price: 500000000000000,
      icon: "assets/upgrades/distillaryx2_4.png",
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
    {
      id: "airportx2_4",
      name: "The Ultimate Airport",
      description: "The most advanced airport in the world!",
      effect: "x2 Airport Potatoes",
      price: 4000000000000000,
      icon: "assets/upgrades/airportx2_4.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "spacestationx2_1",
      name: "More docking bays",
      description: "Can now dock more ships.",
      effect: "x2 Space Station Potatoes",
      price: 3000000000000,
      icon: "assets/upgrades/spacestationx2_1.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "spacestationx2_2",
      name: "Improved technology",
      description: "Better tech means more efficiency.",
      effect: "x2 Space Station Potatoes",
      price: 15000000000000,
      icon: "assets/upgrades/spacestationx2_2.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "spacestationx2_3",
      name: "Advanced AI",
      description: "AI runs the station more efficiently.",
      effect: "x2 Space Station Potatoes",
      price: 3000000000000000,
      icon: "assets/upgrades/spacestationx2_3.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "spacestationx2_4",
      name: "The Ultimate Space Station",
      description: "The most advanced space station in the world!",
      effect: "x2 Space Station Potatoes",
      price: 30000000000000000,
      icon: "assets/upgrades/spacestationx2_4.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "planetx2_1",
      name: "Increased gravity",
      description: "Stronger gravity means more potatoes.",
      effect: "x2 Planet Potatoes",
      price: 20000000000000,
      icon: "assets/upgrades/planetx2_1.png",
      unlocked: false,
    },
    {
      id: "planetx2_2",
      name: "Better atmosphere",
      description: "A better atmosphere means more life.",
      effect: "x2 Planet Potatoes",
      price: 100000000000000,
      icon: "assets/upgrades/planetx2_2.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "planetx2_3",
      name: "Advanced ecosystems",
      description: "More advanced ecosystems mean more potatoes.",
      effect: "x2 Planet Potatoes",
      price: 20000000000000000,
      icon: "assets/upgrades/planetx2_3.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "planetx2_4",
      name: "The Ultimate Planet",
      description: "The most advanced planet in the universe!",
      effect: "x2 Planet Potatoes",
      price: 200000000000000000,
      icon: "assets/upgrades/planetx2_4.png",
      unlocked: false,
      completed: false,
    }, {
      id: "intergalacticfarmx2_1",
      name: "Expanded Fields",
      description: "More space to grow potatoes.",
      effect: "x2 Intergalactic Farm Potatoes",
      price: 150000000000000,
      icon: "assets/upgrades/intergalacticfarmx2_1.png",
      unlocked: false,
      completed: false,
    }, {
      id: "intergalacticfarmx2_2",
      name: "Advanced Irrigation",
      description: "Better watering systems for your crops.",
      effect: "x2 Intergalactic Farm Potatoes",
      price: 750000000000000,
      icon: "assets/upgrades/intergalacticfarmx2_2.png",
      unlocked: false,
      completed: false,
    }, 
    {
      id: "intergalacticfarmx2_3",
      name: "Genetic Modification",
      description: "Stronger, faster-growing potatoes.",
      effect: "x2 Intergalactic Farm Potatoes",
      price: 150000000000000000,
      icon: "assets/upgrades/intergalacticfarmx2_3.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "intergalacticfarmx2_4",
      name: "The Ultimate Intergalactic Farm",
      description: "The most advanced intergalactic farm in the universe!",
      effect: "x2 Intergalactic Farm Potatoes",
      price: 1500000000000000000,
      icon: "assets/upgrades/intergalacticfarmx2_4.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "timemachinex2_1",
      name: "Temporal Efficiency",
      description: "Time machines operate more efficiently.",
      effect: "x2 Time Machine Potatoes",
      price: 1200000000000000,
      icon: "assets/upgrades/timemachinex2_1.png",
      unlocked: false,
      completed: false,
    }, 
    {
      id: "timemachinex2_2",
      name: "Chrono Boosters",
      description: "Boosters that enhance time travel capabilities.",
      effect: "x2 Time Machine Potatoes",
      price: 6000000000000000,
      icon: "assets/upgrades/timemachinex2_2.png",
      unlocked: false,
    }, 
    {
      id: "timemachinex2_3",
      name: "Quantum Stabilizers",
      description: "Stabilizers that improve temporal navigation.",
      effect: "x2 Time Machine Potatoes",
      price: 1200000000000000000,
      icon: "assets/upgrades/timemachinex2_3.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "timemachinex2_4",
      name: "The Ultimate Time Machine",
      description: "The most advanced time machine in the universe!",
      effect: "x2 Time Machine Potatoes",
      price: 12000000000000000000,
      icon: "assets/upgrades/timemachinex2_4.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "quantumreactorx2_1",
      name: "Enhanced Quantum Fields",
      description: "Quantum reactors operate with enhanced fields.",
      effect: "x2 Quantum Reactor Potatoes",
      price: 17000000000000000,
      icon: "assets/upgrades/quantumreactorx2_1.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "quantumreactorx2_2",
      name: "Superposition Amplifiers",
      description: "Amplifiers that boost quantum superposition effects.",
      effect: "x2 Quantum Reactor Potatoes",
      price: 85000000000000000,
      icon: "assets/upgrades/quantumreactorx2_2.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "quantumreactorx2_3",
      name: "Entanglement Enhancers",
      description: "Enhancers that improve quantum entanglement processes.",
      effect: "x2 Quantum Reactor Potatoes",
      price: 17000000000000000000,
      icon: "assets/upgrades/quantumreactorx2_3.png",
      unlocked: false,
      completed: false,
    },
    {
      id: "quantumreactorx2_4",
      name: "The Ultimate Quantum Reactor",
      description: "The most advanced quantum reactor in the universe!",
      effect: "x2 Quantum Reactor Potatoes",
      price: 170000000000000000000,
      icon: "assets/upgrades/quantumreactorx2_4.png",
      unlocked: false,
      completed: false,
    }
  ];

  let skins = [
    {
      id: "default",
      name: "Default",
      image: "assets/potato.png",
      unlocked: true,
      equipped: true,
      description: "Unlocked by default.",
    },
    {
      id: "blank",
      name: "Blank",
      image: "assets/variants/blank.png",
      unlocked: false,
      equipped: false,
      description: "Do nothing for 1 hour.",
    },
    {
      id: "code",
      name: "Code",
      image: "assets/variants/code.png",
      unlocked: false,
      equipped: false,
      description: "Click on the github link in the navbar.",
    },
    {
      id: "crown",
      name: "Crown",
      image: "assets/variants/crown.png",
      unlocked: false,
      equipped: false,
      description: "Collect 1 million potatoes.",
    },
    {
      id: "golden",
      name: "Golden",
      image: "assets/variants/golden.png",
      unlocked: false,
      equipped: false,
      description: "Use every golden potato variant at least once.",
    },
    {
      id: "monster",
      name: "Potato Punch",
      image: "assets/variants/monster.png",
      unlocked: false,
      equipped: false,
      description: "A secret is required to unlock this skin.",
      credits: "Designed by Arthur Weedon.",
    },
    {
      id: "pixel",
      name: "Pixel",
      image: "assets/variants/pixel.png",
      unlocked: false,
      equipped: false,
      description: "Collect 10 different skins.",
    },
    {
      id: "rainbow",
      name: "Rainbow",
      image: "assets/variants/rainbow.png",
      unlocked: false,
      equipped: false,
      description: "Unlock every skin in the game.",
    },
    {
      id: "realistic",
      name: "Realistic",
      image: "assets/variants/realistic.png",
      unlocked: false,
      equipped: false,
      description: "Start your run 5 days ago.",
    },
    {
      id: "rock",
      name: "Rock",
      image: "assets/variants/rock.png",
      unlocked: false,
      equipped: false,
      description: "Buy 100 buildings.",
    },
    {
      id: "synth",
      name: "Synth",
      image: "assets/variants/synth.png",
      unlocked: false,
      equipped: false,
      description: "A secret is required to unlock this skin.",
    },
    {
      id: "inverted",
      name: "Inverted",
      image: "assets/variants/inverted.png",
      unlocked: false,
      equipped: false,
      description: "Click exactly 666 times in one session.",
    },
    {
      id: "monochrome",
      name: "Monochrome",
      image: "assets/variants/monochrome.png",
      unlocked: false,
      equipped: false,
      description: "Buy no upgrades for 10 minutes whilst having the 'Blank' skin equipped.",
    },
    {
      id: "neon",
      name: "Neon",
      image: "assets/variants/neon.png",
      unlocked: false,
      equipped: false,
      description: "Click 200 times in 30 seconds.",
    },
    {
      id: "face",
      name: "Face",
      image: "assets/variants/face.png",
      unlocked: false,
      equipped: false,
      description: "A secret is required to unlock this skin.",
      credits: "Designed by William Sheard.",
    },
    {
      id: "menglish",
      name: "Menglish",
      image: "assets/variants/menglish.png",
      unlocked: false,
      equipped: false,
      description: "A secret is required to unlock this skin.",
    },
    {
      id: "glass",
      name: "Glass",
      image: "assets/variants/glass.png",
      unlocked: false,
      equipped: false,
      description: "Purchase 20 greenhouses.",
    },
    {
      id: "peeled",
      name: "Peeled",
      image: "assets/variants/peeled.png",
      unlocked: false,
      equipped: false,
      description: "Purchase 100 peelers.",
    },
    {
      id: "puzzle",
      name: "Puzzle",
      image: "assets/variants/puzzle.png",
      unlocked: false,
      equipped: false,
      description: "Find all the secrets in the game.",
    },
    {
      id: "sweet",
      name: "Sweet",
      image: "assets/variants/sweet.png",
      unlocked: false,
      equipped: false,
      description: "Purchase 50 chip factories.",
    },
    {
      id: "upside-down",
      name: "Upside Down",
      image: "assets/variants/upside-down.png",
      unlocked: false,
      equipped: false,
      description: "Travel back to a different version of the game.",
    },
    {
      id: "potion",
      name: "Potion",
      image: "assets/variants/potion.png",
      unlocked: false,
      equipped: false,
      description: "Check out Potion Clicker!",
      credits: "Designed by Rohan Launer.",
    },
    {
      id: "geometry",
      name: "Geometry Dash",
      image: "assets/variants/geometry.png",
      unlocked: false,
      equipped: false,
      description: "A secret is required to unlock this skin.",
      credits: "Designed by Arthur Weedon."
    },
    {
      id: "baked",
      name: "Baked",
      image: "assets/variants/baked.png",
      unlocked: false,
      equipped: false,
      description: "Play the game for 1 week.",
      credits: "Designed by Rohan Launer."
    },
    {
      id: "finger",
      name: "Finger",
      image: "assets/variants/finger.png",
      unlocked: false,
      equipped: false,
      description: "Click 100,000 times.",
    }
  ];

  function checkAchievements() {
    if (potatoes >= 100000000000000) {
      potatoes = 0;
      autoClickAmount = 0;
    }
    if (potatoClicks >= 1) {
      achievmentsAdd("first_click");
    }

    if (potatoes >= 100) {
      achievmentsAdd("hundred_potatoes");
    }

    if (potatoes >= 1_000_000) {
      achievmentsAdd("million_potatoes");
    }

    if (potatoes >= 1_000_000_000) {
      achievmentsAdd("billion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000) {
      achievmentsAdd("trillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000) {
      achievmentsAdd("quadrillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000) {
      achievmentsAdd("quintillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000_000) {
      achievmentsAdd("sextillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000_000_000) {
      achievmentsAdd("septillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000_000_000_000) {
      achievmentsAdd("octillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000_000_000_000_000) {
      achievmentsAdd("nonillion_potatoes");
    }

    if (potatoes >= 1_000_000_000_000_000_000_000_000_000_000_000) {
      achievmentsAdd("decillion_potatoes");
    }

    if (potatoClicks >= 666) {
      achievmentsAdd("inverted_potatoes");
    }

    if (potatoClicks >= 10000) {
      achievmentsAdd("pro_clicker");
    }

    if (potatoClicks >= 1000) {
      achievmentsAdd("click_frenzy");
    }

    if (potatoClicks >= 5000) {
      achievmentsAdd("click_marathon");
    }

    if (potatoClicks >= 100000) {
      achievmentsAdd("click_insanity");
    }

    if (potatoClicks >= 1000000) {
      achievmentsAdd("click_legend");
    }

    if (clicksLast30Seconds >= 200) {
      achievmentsAdd("overclock");
    }

    // Rock skin: 100 buildings
    if (buildingsOwned >= 10) {
      achievmentsAdd("buidling_enthusiast");
    }
    if (buildingsOwned >= 50) {
      achievmentsAdd("building_tycoon");
    }
    if (buildingsOwned >= 100) {
      achievmentsAdd("sturdy_as_a_rock");
    }
    if (buildingsOwned >= 200) {
      achievmentsAdd("building_mogul");
    }
    if (buildingsOwned >= 500) {
      achievmentsAdd("building_king");
    }
    if (buildingsOwned >= 1000) {
      achievmentsAdd("building_legend");
    }

    // Upgrades
    if (totalUpgrades >= 1) {
      achievmentsAdd("upgrade_novice");
    }
    if (totalUpgrades >= 5) {
      achievmentsAdd("upgrade_intermediate");
    }
    if (totalUpgrades >= 10) {
      achievmentsAdd("upgrade_expert");
    }
    if (totalUpgrades >= 30) {
      achievmentsAdd("upgrade_advanced");
    }
    if (totalUpgrades >= 50) {
      achievmentsAdd("upgrade_professional");
      achievmentsAdd("upgrade_master");
    }

    // Pixel skin: 10 skins unlocked
    const unlockedSkins = skins.filter(s => s.unlocked).length;
    if (unlockedSkins >= 10) {
      achievmentsAdd("4K");
    }

    if (idleTime >= 3600) {
      achievmentsAdd("idle_master");
    }

    if (totalCollectedVariants.size >= 3) {
      achievmentsAdd("variant_collector");
    }

    if (runStartTime <= Date.now() - 5 * 24 * 60 * 60 * 1000) {
      achievmentsAdd("five_day_run");
    }

    if (runStartTime <= Date.now() - 7 * 24 * 60 * 60 * 1000) {
      achievmentsAdd("baked");
    }

    if (getEquippedSkin().id === "blank" && upgradeTime >= 600) {
      achievmentsAdd("monochrome_potatoes");
    }

    // Rainbow skin: all skins unlocked
    if (unlockedSkins === (skins.length-1)) {
      achievmentsAdd("collector");
    }

    // Check if all secret codes have been redeemed
    const secretAchievements = [
      "monster",
      "synth_master",
      "you_look_like_a_potato",
      "dosser"
    ];
    const allSecretsRedeemed = secretAchievements.every(id => {
      const a = achievments.find(a => a.id === id);
      return a && a.completed;
    });
    if (allSecretsRedeemed) {
      achievmentsAdd("let_me_in");
    }

    // Smash achievement (20 greenhouses)
    const greenhouse = buildings.find(b => b.id === "greenhouse");
    if (greenhouse && greenhouse.owned >= 20) {
      achievmentsAdd("smash");
    }

    // Peel Master (100 peelers)
    const peeler = buildings.find(b => b.id === "cursor");
    if (peeler && peeler.owned >= 100) {
      achievmentsAdd("peel_master");
    }

    // Ewww (50 chip factories)
    const chipFactory = buildings.find(b => b.id === "chip_factory");
    if (chipFactory && chipFactory.owned >= 50) {
      achievmentsAdd("ewww");
    }

    // Time Traveler (version change)
    if (window.versionTraveled) {
      achievmentsAdd("time_traveler");
    }

    if (potatoClicks >= 100000) {
      achievmentsAdd("finger");
    }
  }

  let achievments = [
    {
      id: "first_click",
      name: "First Click",
      description: "Make your first potato click.",
      completed: false,
      skinReward: null,
    },
    {
      id: "hundred_potatoes",
      name: "Century of Potatoes",
      description: "Collect 100 potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "million_potatoes",
      name: "Millionaire",
      description: "Collect 1 million potatoes.",
      completed: false,
      skinReward: "crown",
    },
    {
      id: "billion_potatoes",
      name: "Billionaire",
      description: "Collect 1 billion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "trillion_potatoes",
      name: "Trillionaire",
      description: "Collect 1 trillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "quadrillion_potatoes",
      name: "Quadrillionaire",
      description: "Collect 1 quadrillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "quintillion_potatoes",
      name: "Quintillionaire",
      description: "Collect 1 quintillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "sextillion_potatoes",
      name: "Sextillionaire",
      description: "Collect 1 sextillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "septillion_potatoes",
      name: "Septillionaire",
      description: "Collect 1 septillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "octillion_potatoes",
      name: "Octillionaire",
      description: "Collect 1 octillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "nonillion_potatoes",
      name: "Nonillionaire",
      description: "Collect 1 nonillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "decillion_potatoes",
      name: "Decillionaire",
      description: "Collect 1 decillion potatoes.",
      completed: false,
      skinReward: null,
    },
    {
      id: "pro_clicker",
      name: "Pro Clicker",
      description: "Click 10,000 times in total.",
      completed: false,
      skinReward: null,
    },
    {
      id: "click_frenzy",
      name: "Click Frenzy",
      description: "Click 1,000 times in one session.",
      completed: false,
      skinReward: null,
    },
    {
      id: "click_marathon",
      name: "Click Marathon",
      description: "Click 5,000 times in one session.",
      completed: false,
      skinReward: null,
    },
    {
      id: "click_insanity",
      name: "Click Insanity",
      description: "Click 100,000 times in one session.",
      completed: false,
      skinReward: null,
    },
    {
      id: "click_legend",
      name: "Click Legend",
      description: "Click 1,000,000 times in total.",
      completed: false,
      skinReward: null,
    },
    {
      id: "buidling_enthusiast",
      name: "Building Enthusiast",
      description: "Buy 10 buildings.",
      completed: false,
      skinReward: null,
    },
    {
      id: "building_tycoon",
      name: "Building Tycoon",
      description: "Buy 50 buildings.",
      completed: false,
      skinReward: null,
    },
    {
      id: "building_mogul",
      name: "Building Mogul",
      description: "Buy 200 buildings.",
      completed: false,
      skinReward: null,
    },
    {
      id: "building_king",
      name: "Building King",
      description: "Buy 500 buildings.",
      completed: false,
      skinReward: null,
    },
    {
      id: "building_legend",
      name: "Building Legend",
      description: "Buy 1000 buildings.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_novice",
      name: "Upgrade Novice",
      description: "Purchase 1 upgrade.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_intermediate",
      name: "Upgrade Intermediate",
      description: "Purchase 5 upgrades.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_advanced",
      name: "Upgrade Advanced",
      description: "Purchase 30 upgrades.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_professional",
      name: "Upgrade Professional",
      description: "Purchase 50 upgrades.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_expert",
      name: "Upgrade Expert",
      description: "Purchase 10 upgrades.",
      completed: false,
      skinReward: null,
    },
    {
      id: "upgrade_master",
      name: "Upgrade Master",
      description: "Purchase 50 upgrades.",
      completed: false,
      skinReward: null,
    },
    {
      id: "inverted_potatoes",
      name: "Something Feels Wrong",
      description: "Click exactly 666 times in one session.",
      completed: false,
      skinReward: "inverted",
    },
    {
      id: "monochrome_potatoes",
      name: "Monochrome Master",
      description: "Buy no upgrades for 10 minutes whilst having the 'Blank' skin equipped.",
      completed: false,
      skinReward: "monochrome",
    },
    {
      id: "overclock",
      name: "Overclock",
      description: "Click 200 times in 30 seconds.",
      completed: false,
      skinReward: "neon",
    },
    {
      id: "you_look_like_a_potato",
      name: "You look like a potato",
      description: "A secret is required to unlock this skin.",
      completed: false,
      skinReward: "face",
    },
    {
      id: "sturdy_as_a_rock",
      name: "Sturdy as a Rock",
      description: "Buy 100 buildings.",
      completed: false,
      skinReward: "rock",
    },
    {
      id: "idle_master",
      name: "Idle Master",
      description: "Idle for 1 hour.",
      completed: false,
      skinReward: "blank",
    },
    {
      id: "developer",
      name: "Developer",
      description: "Click the github link in the navbar.",
      completed: false,
      skinReward: "code",
    },
    {
      id: "variant_collector",
      name: "Variant Collector",
      description: "Use every golden potato variant at least once.",
      completed: false,
      skinReward: "golden",
    },
    {
      id: "five_day_run",
      name: "Five Day Run",
      description: "Start your run 5 days ago.",
      completed: false,
      skinReward: "realistic",
    },
    {
      id: "monster",
      name: "Potato Punch",
      description: "A secret is required to unlock this skin.",
      completed: false,
      skinReward: "monster",
    },
    {
      id: "synth_master",
      name: "Synth Master",
      description: "A secret is required to unlock this skin.",
      completed: false,
      skinReward: "synth",
    },
    {
      id: "collector",
      name: "Collector",
      description: "Unlock every skin in the game..",
      completed: false,
      skinReward: "rainbow",
    },
    {
      id: "4K",
      name: "4K Resolution",
      description: "Collect 10 different skins.",
      completed: false,
      skinReward: "pixel",
    },
    {
      id: "dosser",
      name: "Dosser",
      description: "A secret is required to unlock this skin.",
      completed: false,
      skinReward: "menglish",
    },
    {
      id: "smash",
      name: "Smash!",
      description: "Purchase 20 greenhouses.",
      completed: false,
      skinReward: "glass",
    },
    {
      id: "peel_master",
      name: "Peel Master",
      description: "Purchase 100 peelers.",
      completed: false,
      skinReward: "peeled",
    },
    {
      id: "let_me_in",
      name: "Let me in",
      description: "Find all the secrets in the game.",
      completed: false,
      skinReward: "puzzle",
    },
    {
      id: "ewww",
      name: "Ewww!",
      description: "Purchase 50 chip factories.",
      completed: false,
      skinReward: "sweet",
    },
    {
      id: "time_traveler",
      name: "Time Traveler",
      description: "Travel back to a different version of the game.",
      completed: false,
      skinReward: "upside-down",
    },
    {
      id: "potion_clicker",
      name: "Potion Clicker",
      description: "Check out Potion Clicker!.",
      completed: false,
      skinReward: "potion",
    },
    {
      id: "geometry_dash",
      name: "How did you do that!",
      description: "A secret is required to unlock this skin.",
      completed: false,
      skinReward: "geometry",
    },
    {
      id: "baked",
      name: "Mmmm... Yummy!",
      description: "Play the game for 1 week.",
      completed: false,
      skinReward: "baked",
    },
    {
      id: "finger",
      name: "My thumb is sore...",
      description: "Click 100,000 times in total.",
      completed: false,
      skinReward: "finger",
    }
  ]

  let mysteryCount = 0;
  buildings.forEach((b) => {
    if (b.mystery && mysteryCount < 2) {
      b.unlocked = true;
      mysteryCount++;
    } else if (b.mystery) {
      b.unlocked = false;
    }
  });

  function showAchievementPopup(title, description, rewardText = null) {
    const container = document.getElementById("achievement-container");

    const popup = document.createElement("div");
    popup.className = "achievement-popup";

    popup.innerHTML = `
      <div class="achievement-title">Achievement Unlocked</div>
      <div class="achievement-title">${title}</div>
      <div class="achievement-desc">${description}</div>
      ${
        rewardText
          ? `<div class="achievement-reward">🎨 ${rewardText}</div>`
          : ""
      }
    `;

    container.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 3600);
  }

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

  Codebutton.addEventListener("click", () => {
    const value = Codeinput.value;
    if (value === "potatopunch") {
      achievmentsAdd("monster");
      Codeinput.value = "";
      alert("Code redeemed! Achievement unlocked: Potato Punch");
    }
    if (value === "potatobeats") {
      achievmentsAdd("synth_master");
      Codeinput.value = "";
      alert("Code redeemed! Achievement unlocked: Synth Master");
    }
    if (value === "canicomeingary") {
      achievmentsAdd("you_look_like_a_potato");
      Codeinput.value = "";
      alert("Code redeemed! Achievement unlocked: You look like a potato");
    }
    if (value === "dossersgames") {
      achievmentsAdd("dosser");
      Codeinput.value = "";
      alert("Code redeemed! Achievement unlocked: Menglish");
    }
    if (value === "impossibletiming") {
      achievmentsAdd("geometry_dash")
      Codeinput.value = "";
      alert("Code redeemed! Achievement unlocked: How did you do that!");
    }
  });

  function storeCounter() {
    storeCount++;
  }

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

  function achievmentsAdd(id) {
    const a = achievments.find(a => a.id === id);
    if (!a || a.completed) return;

    a.completed = true;

    let rewardText = null;

    if (a.skinReward) {
      unlockSkin(a.skinReward);

      const skin = skins.find(s => s.id === a.skinReward);
      if (skin) {
        rewardText = `Skin unlocked — ${skin.name}`;
      }
    }

    showAchievementPopup(a.name, a.description, rewardText);
    console.log(`Achievement unlocked: ${a.name}`);

    saveGame(true); // Major change: achievement unlocked
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
    const units = [
      { value: 1_000_000_000_000_000_000_000_000_000_000_000, label: "decillion" },
      { value: 1_000_000_000_000_000_000_000_000_000_000, label: "nonillion" },
      { value: 1_000_000_000_000_000_000_000_000_000, label: "octillion" },
      { value: 1_000_000_000_000_000_000_000_000, label: "septillion" },
      { value: 1_000_000_000_000_000_000_000, label: "sextillion" },
      { value: 1_000_000_000_000_000_000, label: "quintillion" },
      { value: 1_000_000_000_000_000, label: "quadrillion" },
      { value: 1_000_000_000_000, label: "trillion" },
      { value: 1_000_000_000, label: "billion" },
      { value: 1_000_000, label: "million" }
    ];
    for (const unit of units) {
      if (num >= unit.value) {
        return (
          (num / unit.value).toFixed(2).replace(/\.?0+$/, "") + " " + unit.label
        );
      }
    }
    return num.toLocaleString();
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
    upgradeTotalElement.innerText = `Upgrades unlocked: ${upgrades.filter(u => u.completed).length}/54 (${Math.floor((upgrades.filter(u => u.completed).length / 54) * 100 * 10) / 10}%)`;
    achievmentTotalElement.innerText = `Total Upgrades: ${achievments.filter(a => a.completed).length}/48 (${Math.floor((achievments.filter(a => a.completed).length / 48) * 100 * 10) / 10}%)`;
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

      skins: skins.map(s => ({
        id: s.id,
        unlocked: s.unlocked,
        equipped: s.equipped,
      })),

      achievments: achievments.map(a => ({
        id: a.id,
        completed: a.completed,
      })),
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

    skins: skins.map(s => ({
      id: s.id,
      unlocked: s.unlocked,
      equipped: s.equipped,
    }));

    achievments: achievments.map(a => ({
      id: a.id,
      completed: a.completed,
    }));

    return save;
  }

  // Save to localStorage only (fast, continuous)
  function saveLocal() {
    const save = getSaveObject();
    localStorage.setItem(SAVE_KEY_V2, JSON.stringify(save));
  }

  // Save to database (slower, less frequent)
  async function saveToDb(showStatus = false) {
    const save = getSaveObject();
    
    if (window.authApi && window.authApi.getToken()) {
      try {
        await window.authApi.save(save);
        lastDbSaveTime = Date.now();
        console.log("DB save successful");
        if (showStatus && accountStatus) {
          accountStatus.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
          setTimeout(() => {
            if (accountStatus) accountStatus.textContent = " ";
          }, 4000);
        }
      } catch (e) {
        console.warn("DB save failed", e);
        if (showStatus && accountStatus) {
          accountStatus.textContent = "Save failed (network)";
          setTimeout(() => {
            if (accountStatus) accountStatus.textContent = " ";
          }, 4000);
        }
      }
    }
  }

  // Save both local and DB (for major changes)
  async function saveGame(majorChange = false) {
    // Always save locally
    saveLocal();
    
    // Save to DB on major changes or every 20 minutes
    if (majorChange) {
      console.log("Major change detected - saving to DB");
      await saveToDb(true);
    } else if (window.authApi && window.authApi.getToken()) {
      // Check if it's been 20 minutes since last DB save
      const timeSinceLastDbSave = Date.now() - lastDbSaveTime;
      if (timeSinceLastDbSave >= DB_SAVE_INTERVAL_MS) {
        console.log("20 minutes elapsed - saving to DB");
        await saveToDb(false);
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
      // Manual save always saves to DB
      saveLocal();
      Promise.resolve(saveToDb(true))
        .catch(() => {})
        .finally(() => {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
        });
    }
  }

  async function loadGame() {
    const localSaveRaw = localStorage.getItem(SAVE_KEY_V2);
    const localSave = localSaveRaw ? JSON.parse(localSaveRaw) : null;

    if (window.authApi && window.authApi.getToken()) {
      try {
        const remoteSave = await window.authApi.load();

        if (remoteSave && remoteSave.stats) {
          if (
            localSave &&
            localSave.stats.allTimePotatoes > remoteSave.stats.allTimePotatoes
          ) {
            console.log("Local save has more potatoes, saving to backend");
            await window.authApi.save(localSave);
            loadV2(localSave);
          } else {
            console.log("Loaded save from backend");
            if (localSave) {
              localStorage.setItem(SAVE_KEY_V2, JSON.stringify(remoteSave));
            }
            loadV2(remoteSave);
          }
        } else if (localSave) {
          console.log("No backend save found, loading local save");
          loadV2(localSave);
          await window.authApi.save(localSave);
        } else {
          migrateOldSave();
        }
      } catch (err) {
        console.log("Backend load failed, using local save", err);
        if (localSave) loadV2(localSave);
        else migrateOldSave();
      }
    } else {
      if (localSave) loadV2(localSave);
      else migrateOldSave();
    }
  }

  function applyEquippedSkin() {
    const equippedSkin = skins.find(s => s.equipped);
    if (!equippedSkin) return;

    const potatoImage = document.getElementById("potatoImage");
    potatoImage.src = equippedSkin.image;
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
      b.price = Math.ceil(b.basePrice * Math.pow(1.15, b.owned));
      b.totalGenerated = data.totalGenerated || 0;
      b.cpsMultiplier = data.cpsMultiplier || 1;
    });

    upgrades.forEach((u) => {
      const data = save.upgrades[u.id];
      if (!data) return;
      u.unlocked = data.unlocked;
      u.completed = data.completed;
    });

    if (save.skins) {
      save.skins.forEach(savedSkin => {
        const skin = skins.find(s => s.id === savedSkin.id);
        if (!skin) return;

        skin.unlocked = savedSkin.unlocked;
        skin.equipped = savedSkin.equipped;
      });
    }

    if (save.achievments) {
      save.achievments.forEach(savedA => {
        const a = achievments.find(a => a.id === savedA.id);
        if (!a) return;

        a.completed = savedA.completed;
      });
    }

    calculateAutoClick();
    applyEquippedSkin();
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
      b.price = Math.ceil(b.basePrice * Math.pow(1.15, b.owned));
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
    const now = Date.now();
    recentClicks.push(now);

    // keep last 30 seconds
    recentClicks = recentClicks.filter(t => now - t <= 30000);
    window.clicksLast30Seconds = recentClicks.length;

    clickerButton.disabled = true;
    potatoes += Math.floor(potatoesPerClick * 10) / 10;
    rawPotatoes += potatoesPerClick;
    handFarmedPotatoes += potatoesPerClick;
    allTimePotatoes += potatoesPerClick;
    potatoClicks++;
    markPlayerActivity();
    checkAchievements();

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
  let totalCollectedVariants = new Set();

  goldenPotatoImage.addEventListener("click", (e) => {
    markPlayerActivity();
    let goldenPotatoVariant =
      goldenPotatoVariants[
        Math.floor(Math.random() * goldenPotatoVariants.length)
      ];
    const text = document.createElement("div");
    text.className = "text";
    let reward = 0;
    if (goldenPotatoVariant == "normal") {
      if (!totalCollectedVariants.has("normal")) {
        totalCollectedVariants.add("normal");
      }
      text.textContent = `Lucky, ${autoClickAmount * 1000} Potatoes!`;
      reward = autoClickAmount * 1000;
    } else if (goldenPotatoVariant == "frenzy") {
      if (!totalCollectedVariants.has("frenzy")) {
        totalCollectedVariants.add("frenzy");
      }
      text.textContent = `3 Minute Frenzy!`;
      frenzy = true;
      setTimeout(
        () => {
          frenzy = false;
        },
        3 * 60 * 1000,
      );
    } else if (goldenPotatoVariant == "half_price") {
      if (!totalCollectedVariants.has("half_price")) {
        totalCollectedVariants.add("half_price");
      }
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

  function showTooltip(html, anchorElement) {
    clearTimeout(tooltipHideTimeout);
    clearTimeout(mobileAutoHideTimeout);

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

    // 📱 Mobile: auto-hide after 5 seconds
    if (isTouchDevice) {
      mobileAutoHideTimeout = setTimeout(() => {
        hideTooltipImmediate();
      }, 5000);
    }
  }

  function hideTooltipImmediate() {
    clearTimeout(tooltipHideTimeout);
    clearTimeout(mobileAutoHideTimeout);

    tooltip.classList.remove("shown");
    tooltip.classList.add("hidden");
  }

  function hideTooltip() {
    tooltip.classList.remove("shown");
    setTimeout(() => tooltip.classList.add("hidden"), 150);
  }

  const renderedUpgrades = new Map();

  function renderUpgrades() {
    const container = document.getElementById("upgrades");

    // --- unlock logic (UNCHANGED, just moved to top) ---
    upgrades.forEach((u) => {
      const buildingMap = {
        peeler: "cursor",
        farmer: "farmer",
        tractor: "tractor",
        greenhouse: "greenhouse",
        chipfactory: "chip_factory",
        restaurant: "restaurant",
        supermarket: "supermarket",
        distillary: "distillary",
        airport: "airport",
        spacestation: "space_station",
        planet: "planet",
        intergalacticfarm: "intergalactic_farm",
        timemachine: "time_machine",
        quantumreactor: "quantum_reactor",
      };

      for (const key in buildingMap) {
        const building = buildings.find(b => b.id === buildingMap[key]);
        if (!building) continue;

        if (u.id.includes(`${key}x2_1`) || u.id.includes(`${key}x2_2`))
          u.unlocked = building.owned >= 1 && !u.completed;

        if (u.id.includes(`${key}x2_3`))
          u.unlocked = building.owned >= 10 && !u.completed;

        if (u.id.includes(`${key}x2_4`))
          u.unlocked = building.owned >= 20 && !u.completed;
      }
    });

    const visible = upgrades
      .filter(u => u.unlocked && !u.completed)
      .sort((a, b) => a.price - b.price);

    const visibleIds = new Set(visible.map(u => u.id));

    // --- remove upgrades no longer visible ---
    for (const [id, btn] of renderedUpgrades) {
      if (!visibleIds.has(id)) {
        btn.remove();
        renderedUpgrades.delete(id);
      }
    }

    // --- add / update visible upgrades ---
    visible.forEach((u) => {
      let upgradeButton = renderedUpgrades.get(u.id);

      if (!upgradeButton) {
        upgradeButton = document.createElement("button");
        upgradeButton.className = "upgrades-container";

        const img = document.createElement("img");
        img.src = u.icon;
        img.width = 70;
        img.draggable = false;
        img.className = "upgrade-button";

        upgradeButton.appendChild(img);

        upgradeButton.addEventListener("mouseenter", () => {
          showTooltip(
            `
            <div class="title">${u.name}</div>
            <div>${u.description}</div>
            <div class="effect">${u.effect}</div>
            <div class="price">Cost: ${formatNumber(u.price * half_price_amount)} potatoes</div>
            `,
            upgradeButton
          );
        });

        upgradeButton.addEventListener("mouseleave", hideTooltip);

        upgradeButton.addEventListener("click", () => {
          upgradeTime = 0;
          if (potatoes < u.price * half_price_amount) return;

          potatoes -= u.price * half_price_amount;
          u.completed = true;
          u.unlocked = false;
          totalUpgrades++;

          const effects = {
            peeler: "cursor",
            farmer: "farmer",
            tractor: "tractor",
            greenhouse: "greenhouse",
            chipfactory: "chip_factory",
            restaurant: "restaurant",
            supermarket: "supermarket",
            distillary: "distillary",
            airport: "airport",
            spacestation: "space_station",
            planet: "planet",
            intergalacticfarm: "intergalactic_farm",
            timemachine: "time_machine",
            quantumreactor: "quantum_reactor",
          };

          for (const key in effects) {
            if (u.id.includes(key)) {
              buildings.find(b => b.id === effects[key]).cpsMultiplier *= 2;
              if (key === "peeler") potatoesPerClick *= 2;
            }
          }

          calculateAutoClick();
          updatePotatoDisplay();
          renderBuildings();
          renderUpgrades();
          checkAchievements();
          saveGame(true); // Major change: upgrade bought
        });

        renderedUpgrades.set(u.id, upgradeButton);
        container.appendChild(upgradeButton);
      }

      // --- update affordability (NO re-render) ---
      upgradeButton.style.opacity =
        potatoes >= u.price * half_price_amount ? 1 : 0.5;
    });
  }


    function renderSkins() {
      const container = document.getElementById("skinsContainer");
      container.innerHTML = "";

      skins.forEach((s) => {
        const skinDiv = document.createElement("button");
        skinDiv.className = `skin-div ${s.equipped ? "selected-skin" : ""}`;
        if (!s.unlocked) skinDiv.classList.add("locked-skin");

        skinDiv.innerHTML = `
          <img
            src="${s.unlocked ? s.image : 'assets/mystery_potato.png'}"
            alt="${s.name}"
            width="100"
            class="skin-option"
            data-skin="${s.id}"
            draggable="false"
          />
          <p class="skin-label">${s.unlocked ? s.name : '???'}</p>
        `;

        skinDiv.addEventListener("mouseenter", () => {
          if (s.credits) {
            if (s.unlocked) {
              const html = `
                <div class="title">${s.name}</div>
                <div>${s.description}</div>
                <div class="credits">${s.credits}</div>
              `;
              showTooltip(html, skinDiv);
            } else {
              const html = `
                <div class="title">???</div>
                <div>${s.description}</div>
                <div class="credits">Designed by: *********</div>
              `;
              showTooltip(html, skinDiv);
            }
          } else {
            if (s.unlocked) {
              const html = `
                <div class="title">${s.name}</div>
                <div>${s.description}</div>
              `;
              showTooltip(html, skinDiv);
            } else {
              const html = `
                <div class="title">???</div>
                <div>${s.description}</div>
              `;
              showTooltip(html, skinDiv);
            }
          }
          
        });
        skinDiv.addEventListener("mouseleave", hideTooltip);

        skinDiv.addEventListener("click", () => {
          if (!s.unlocked) return; // Prevent selecting locked skins
          selectSkin(s.id);
          updatePotatoDisplay();
        });

        container.appendChild(skinDiv);
      });
    }

    function unlockSkin(id) {
      const skin = skins.find(s => s.id === id);
      if (!skin || skin.unlocked) return false;

      skin.unlocked = true;
      return true;
    }

    function selectSkin(id) {
      skins.forEach((s) => {
        s.equipped = s.id === id;
      });
      
      const equippedSkin = skins.find((s) => s.equipped);
      if (equippedSkin) {
        const potatoImage = document.getElementById("potatoImage");
        if (potatoImage) {
          potatoImage.src = equippedSkin.image;
        }
      }
      renderSkins();
      renderBuildings();
      saveGame(true); // Major change: skin equipped
    }

    function unlockUpgrade(id) {
      const u = upgrades.find((u) => u.id === id);
      if (!u) return;

      u.unlocked = true;
      renderUpgrades();
    }

    function getEquippedSkin() {
      return skins.find((s) => s.equipped) || skins[0];
    }


  function renderBuildings() {
    enforceMysteryLimit();

    const container = document.getElementById("buildings");
    if (!container) return;

    const equippedSkin = getEquippedSkin();
    const isTouch = "ontouchstart" in window;

    const visible = buildings
      .filter((b) => b.unlocked)
      .sort((a, b) => a.sort - b.sort);

    visible.forEach((b) => {
      let buildingButton = document.getElementById(`building-${b.id}`);

      /* ---------------- CREATE ONCE ---------------- */
      if (!buildingButton) {
        buildingButton = document.createElement("button");
        buildingButton.className = "building-container";
        buildingButton.id = `building-${b.id}`;
        buildingButton.style.webkitTapHighlightColor = "transparent";
        container.appendChild(buildingButton);

        // ICON
        const iconDiv = document.createElement("div");
        iconDiv.className = "building-icon";

        const img = document.createElement("img");
        img.className = "building-image";
        img.width = 60;
        img.draggable = false;
        iconDiv.appendChild(img);

        // INFO
        const infoDiv = document.createElement("div");
        infoDiv.className = "building-info";
        infoDiv.innerHTML = `
          <div class="building-name-price">
            <h4 class="building-name"></h4>
            <p class="building-price">
              <img class="potato-icon" draggable="false" width="15">
              <span class="price-value"></span>
            </p>
          </div>
          <div class="building-amount">
            <p class="amount-owned"></p>
          </div>
        `;

        buildingButton.appendChild(iconDiv);
        buildingButton.appendChild(infoDiv);

        let tooltipTimeout;

        // DESKTOP (hover)
        if (!isTouch) {
          buildingButton.addEventListener("mouseenter", () => {
            const html = b.mystery
              ? `
                <div class="title">???</div>
                <div>Price: ${formatNumber(b.price)}</div>
              `
              : `
                <div class="title">${b.name}</div>
                <div>Price: ${formatNumber(b.price)}</div>
                <div>Owned: ${b.owned}</div>
                <div>Total generated: ${Math.floor(b.totalGenerated)}</div>
                <div>Income/sec: ${Math.floor(b.cps * b.owned * 10) / 10}</div>
              `;

            showTooltip(html, buildingButton);
          });

          buildingButton.addEventListener("mouseleave", hideTooltip);
        }

        // MOBILE (tap, auto-hide after 5s)
        else {
          buildingButton.addEventListener("click", () => {
            const html = b.mystery
              ? `
                <div class="title">???</div>
                <div>Price: ${formatNumber(b.price)}</div>
              `
              : `
                <div class="title">${b.name}</div>
                <div>Price: ${formatNumber(b.price)}</div>
                <div>Owned: ${b.owned}</div>
                <div>Total generated: ${Math.floor(b.totalGenerated)}</div>
                <div>Income/sec: ${Math.floor(b.cps * b.owned * 10) / 10}</div>
              `;

            showTooltip(html, buildingButton);

            // reset timer if tapped again
            clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
              hideTooltip();
            }, 5000);
          });
        }

        // CLICK
        buildingButton.addEventListener("click", () => {
          markPlayerActivity();

          const cost = b.price * half_price_amount;
          if (b.mystery || potatoes < cost) return;

          buildingsOwned++;
          b.owned++;
          potatoes -= cost;
          b.price = Math.ceil(b.price * 1.15);

          calculateAutoClick();
          updatePotatoDisplay();
          checkAchievements();
          requestAnimationFrame(() => {
            renderBuildings();
            renderUpgrades();
          });
        });
      }

      /* ---------------- UPDATE ONLY ---------------- */
      const displayPrice = b.price * half_price_amount;

      const img = buildingButton.querySelector(".building-image");
      const nameEl = buildingButton.querySelector(".building-name");
      const priceEl = buildingButton.querySelector(".price-value");
      const ownedEl = buildingButton.querySelector(".amount-owned");
      const potatoIcon = buildingButton.querySelector(".potato-icon");

      // Mystery logic
      let displayName = b.name;
      let displayIcon = b.realIcon;

      if (b.mystery && potatoes < displayPrice) {
        displayName = "???";
        displayIcon = "assets/mystery.png";
      } else {
        b.mystery = false;
      }

      // Update text (cheap, no flicker)
      nameEl.textContent = displayName;
      priceEl.textContent = formatNumber(displayPrice);
      ownedEl.textContent = b.owned;

      // Update images only if changed
      if (!img.src.endsWith(displayIcon)) img.src = displayIcon;
      if (!potatoIcon.src.endsWith(equippedSkin.image)) {
        potatoIcon.src = equippedSkin.image;
      }

      // Affordability styles (only when changed)
      const canAfford = potatoes >= displayPrice;
      if (buildingButton.dataset.affordable !== String(canAfford)) {
        buildingButton.dataset.affordable = String(canAfford);

        const priceWrapper = buildingButton.querySelector(".building-price");
        priceWrapper.style.color = canAfford ? "lightgreen" : "rgb(209,73,73)";
        buildingButton.style.backgroundColor = canAfford ? "#37495a" : "#212d38";
        buildingButton.style.cursor = canAfford ? "pointer" : "default";
      }
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

  openBtnsk.addEventListener("click", () => {
    modalsk.classList.add("open");
    modalsk.style.display = "flex";
    renderSkins();
  });

  closeBtnsk.addEventListener("click", () => {
    modalsk.classList.remove("open");
    modalsk.style.display = "none";
  });

  closeBtncodes.addEventListener("click", () => {
    modalcodes.classList.remove("open");
    modalcodes.style.display = "none";
  });

  closeModalAnouncements.addEventListener("click", () => {
    modalanouncements.classList.remove("open");
    modalanouncements.style.display = "none";
  });

  const preloadedSkins = new Map();

  function preloadSkin(imageSrc) {
    if (preloadedSkins.has(imageSrc)) return;

    const img = new Image();
    img.src = imageSrc;
    img.decoding = "async"; // helps Safari
    preloadedSkins.set(imageSrc, img);
  }

  clickArea.addEventListener("click", (e) => {
    const rect = clickArea.getBoundingClientRect();
    const equippedSkin = getEquippedSkin();

    preloadSkin(equippedSkin.image);

    // --- +1 trail ---
    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = e.clientX - rect.left + (Math.random() * 40 - 20) + "px";
    trail.style.top = e.clientY - rect.top - 20 + "px";
    trail.textContent = `+${potatoesPerClick}`;
    clickArea.appendChild(trail);
    setTimeout(() => trail.remove(), 1000);

    // --- Potato jump (PRELOADED) ---
    const potato = preloadedSkins
      .get(equippedSkin.image)
      .cloneNode(false);

    potato.className = "jump-image";
    potato.style.left = e.clientX - rect.left - 20 + "px";
    potato.style.top = e.clientY - rect.top - 20 + "px";
    potato.style.opacity = "1";

    clickArea.appendChild(potato);

    // Physics
    let velocityY = -6 - Math.random() * 2;
    let velocityX = Math.random() * 4 - 2;
    const gravity = 0.55;
    let posX = e.clientX - rect.left - 20;
    let posY = e.clientY - rect.top - 20;

    let rotation = Math.random() * 360;
    let rotationSpeed = Math.random() * 10 - 5;
    let opacity = 1;

    const animation = setInterval(() => {
      velocityY += gravity;
      posY += velocityY;
      posX += velocityX;

      rotation += rotationSpeed;
      opacity -= 0.05;

      potato.style.transform = `rotate(${rotation}deg)`;
      potato.style.left = posX + "px";
      potato.style.top = posY + "px";
      potato.style.opacity = opacity;

      if (opacity <= 0 || posY > e.clientY - rect.top) {
        clearInterval(animation);
        potato.remove();
      }
    }, 16);
  });

  let frenzy_amount;

  async function handleLogin() {
    lBtn.disabled = true;
    try {
      const res = await login(lUser.value.trim(), lPass.value);
      setToken(res.token);
      showMsg(lUser, "Logged in");
      showMsg(lPass, "");
      await updateAccountUI();
    } catch (e) {
      showMsg(lUser, "Login failed");
      console.error(e);
    } finally {
      lBtn.disabled = false;
    }
  }

  document.getElementById("logoutButton")?.addEventListener("click", () => {
    setToken(null);
    updateAccountUI();
    if (window.resetGame) window.resetGame(); // clear local game if needed
  });

  function autoClick() {
    if (frenzy === true) {
      frenzy_amount = 3;
    } else {
      frenzy_amount = 1;
    }
    const increment = (autoClickAmount * frenzy_amount) / 20;
    potatoes += increment;
    allTimePotatoes += increment;

    buildings.forEach((b) => {
      const incomeFromThisBuilding = (b.cps * b.owned) / 20;
      b.totalGenerated += incomeFromThisBuilding;
    });
    if (storeCount >= 10) {
      console.log("Secret")
      modalcodes.classList.add("open");
      storeCount = 0;
    }
    //checkAchievements();
    updatePotatoDisplay();
    setTimeout(autoClick, 50);
  }

  function setupPasswordToggle(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (!input || !toggle) return;
    toggle.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }

  setupPasswordToggle("loginPassword", "loginToggle");
  setupPasswordToggle("signupPassword", "signupToggle");

  // autosave: continuously save locally, check DB save interval
  async function autoSave() {
    // Always save locally for quick recovery
    saveLocal();
    
    // Check if we need to save to DB (20 minutes elapsed)
    if (window.authApi && window.authApi.getToken()) {
      const timeSinceLastDbSave = Date.now() - lastDbSaveTime;
      if (timeSinceLastDbSave >= DB_SAVE_INTERVAL_MS) {
        console.log("AFK save: 20 minutes elapsed - saving to DB");
        await saveToDb(false);
      }
    }

    setTimeout(autoSave, 10000); // check every 10 seconds
  }

  function renderBuildingsRegular() {
    renderBuildings();
    setTimeout(renderBuildingsRegular, 1000);
  }

  function renderUpgradesRegular() {
    renderUpgrades();
    setTimeout(renderUpgradesRegular, 1000);
  }

  let lastPlayerAction = Date.now();

  function markPlayerActivity() {
    lastPlayerAction = Date.now();
  }

  modalanouncements.classList.add("open");
  modalanouncements.style.display = "flex";

  loadGame();
  rateCounter();
  updatePotatoComments();
  updateStatsDisplay();
  autoClick();
  renderBuildingsRegular();
  renderUpgradesRegular();
  autoSave();
  renderSkins()
  setInterval(() => {
    idleTime = Math.floor((Date.now() - lastPlayerAction) / 1000);
    console.log("idleTime:", idleTime);
  }, 1000);
  setInterval(() => {
    upgradeTime++;
  }, 1000);
  console.log(`
    ---------------------------------------------------------------
    Potato Clicker!
    ---------------------------------------------------------------
    This is the potato clicker console. Don't mess around here unless you know what you are doing as you may accidentally wipe your game save

    Have fun and get clicking!
      - MaxTheRock
  `);

  document.addEventListener("contextmenu", e => e.preventDefault());

  // Expose functions to global scope for onclick handlers in HTML
  window.achievmentsAdd = achievmentsAdd;
  window.clearLocalData = clearLocalData;
  window.storeCounter = storeCounter;
//})();