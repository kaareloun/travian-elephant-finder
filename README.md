![Travian Elephant Finder](./elephants.webp)

# Travian Elephant Finder

A script that automatically locates elephants around your village in the game Travian.

## Other tools

[🌾 Travian Crop Finder](https://github.com/kaareloun/travian-crop-finder)

[🐘 Travian Elephant Finder](https://github.com/kaareloun/travian-elephant-finder)

## How to use

- Login to Travian
- Open chrome console (ctrl + shift + j)
- Paste the following code, change `CONFIG` and press enter

```javascript
var CONFIG = {
  village: {
    x: 150,
    y: 150,
  },
  searchRadius: 50,
};
var results = [];
var elephantPattern = new RegExp(`title=\"Elephant\"/></td>\n\\s*<td class=\"val\">(\\d+)</td>`);
var promises = [];
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
        const match = elephantPattern.exec(responseData.html);
        if (match) {
          const elephants = match[1];
          console.log(`${elephants} elephants found at [${x}, ${y}]. Distance ${r}`);
          results.push({ x, y, distance: r, elephants: Number(elephants) });
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
var total = results.reduce((acc, info) => acc + Number(info.elephants), 0);
console.log(`${total} elephants found.`, results);
```

## Screenshots

![Console](./console.png)

## Using locally

```
git clone git@github.com:kaareloun/travian-elephant-finder.git
cd travian-elephant-finder
echo "AUTH_COOKIE=cookie" > .env
bun install
bun run main.ts
```
