// config.ts
var CONFIG = {
  server: "ts1.x1.europe.travian.com",
  village: {
    x: 150,
    y: 150
  },
  searchRadius: 50,
  cages: 5
};

// constants.ts
var ANIMALS = {
  Rat: 25,
  Spider: 35,
  Snake: 40,
  Bat: 66,
  "Wild Boar": 70,
  Wolf: 80,
  Bear: 140,
  Crocodile: 380,
  Tiger: 170,
  Elephant: 440
};

// main.ts
var results = [];
var animalPattern = (animal) => new RegExp(`title=\"${animal}\"/></td>\n\\s*<td class=\"val\">(\\d+)</td>`);
var promises = [];
for (let r = 1;r <= CONFIG.searchRadius; r++) {
  for (let dx = -r;dx <= r; dx++) {
    for (let dy = -r;dy <= r; dy++) {
      if (Math.abs(dx) !== r && Math.abs(dy) !== r) {
        continue;
      }
      const promise = new Promise(async (resolve) => {
        const x = CONFIG.village.x + dx;
        const y = CONFIG.village.y + dy;
        const response = await fetch(`${window ? window.location.origin : `https://${CONFIG.server}`}/api/v1/map/tile-details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: document ? document.cookie : process.env.AUTH_TOKEN || ""
          },
          body: JSON.stringify({ x, y })
        });
        const responseData = await response.json();
        const animalsArray = Object.keys(ANIMALS).reduce((acc, animal) => {
          const match = animalPattern(animal).exec(responseData.html);
          acc[animal] = match ? Array.from({ length: Number(match[1]) }) : [];
          return acc;
        }, {});
        if ((animalsArray["Elephant"] || []).length > 0) {
          let score = 0;
          let animalIndex = 0;
          let cagesLeft = CONFIG.cages;
          const animalsCaught = new Set;
          while (cagesLeft > 0) {
            if (Object.keys(animalsArray).length === 0) {
              break;
            }
            const animal = Object.keys(animalsArray)[animalIndex];
            if (animalsArray[animal]?.length === 0) {
              delete animalsArray[animal];
              continue;
            }
            if ((animalsArray[animal]?.length || 0) > 0) {
              score += ANIMALS[animal];
              animalsArray[animal]?.pop();
              animalsCaught.add(animal);
              cagesLeft--;
            }
            animalIndex = (animalIndex + 1) % Object.keys(animalsArray).length;
          }
          console.log(`${animalsCaught.size === 1 ? "\uD83D\uDC18\uD83D\uDC18\uD83D\uDC18" : "Elephants"} found at [${x}, ${y}]. Distance: ${r}. Score: ${score}.`);
          results.push({ x, y, distance: r, animals: animalsCaught, score });
        }
        resolve(null);
      });
      promises.push(promise);
      if (promises.length >= 10) {
        await Promise.all(promises);
        promises = [];
      }
    }
  }
}
await Promise.all(promises);
console.log(`${results.length} oasis found.`, results.sort((a, b) => b.score - a.score));
