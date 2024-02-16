import { Animal, AnimalInfo, Config } from './types';

const CONFIG: Config = {
  server: 'ts1.x1.europe.travian.com',
  village: {
    x: 150,
    y: 150,
  },
  searchRadius: 50,
  animals: ['elephant'], // rat, spider, snake, bat, boar, wolf, bear, crocodile, tiger, elephant
};

const results: AnimalInfo[] = [];
const animalPattern = new RegExp(
  `title="Crop"><\/i><\/td>\\s*<td class="val">(${CONFIG.animals.join('|')})<\/td>`
);

let promises: Promise<any>[] = [];
for (let r = 1; r <= CONFIG.searchRadius; r++) {
  for (let dx = -r; dx <= r; dx++) {
    for (let dy = -r; dy <= r; dy++) {
      if (Math.abs(dx) !== r && Math.abs(dy) !== r) {
        continue;
      }

      const promise = new Promise(async (resolve) => {
        const x = CONFIG.village.x + dx;
        const y = CONFIG.village.y + dy;
        const response = await fetch(
          `${window ? window.location.origin : `https://${CONFIG.server}`}/api/v1/map/tile-details`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': document ? document.cookie : process.env.AUTH_TOKEN || '',
            },
            body: JSON.stringify({ x, y }),
          }
        );

        const responseData = await response.json();
        const match = animalPattern.exec(responseData.html);
        if (match) {
          const animal = match[1] as Animal;
          console.log(
            `${animal[0].toUpperCase()}${animal.slice(1)}s found at [${x}, ${y}]. Distance ${r}`
          );
          results.push({ x, y, distance: r, animal });
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

console.log(`${results.length} animal locations found.`, results);
