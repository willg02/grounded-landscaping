// Quick utility to split plants.json into category files
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const plants = JSON.parse(fs.readFileSync(path.join(dataDir, 'plants.json'), 'utf-8'));

const buckets = {};

for (const plant of plants) {
  // Determine the file bucket based on plantType
  let bucket;
  switch (plant.plantType) {
    case 'tree':
      bucket = 'trees';
      break;
    case 'shrub':
      bucket = 'shrubs';
      break;
    case 'perennial':
      bucket = 'perennials';
      break;
    case 'annual':
      bucket = 'annuals';
      break;
    case 'grass':
      bucket = 'grasses';
      break;
    case 'groundcover':
      bucket = 'groundcovers';
      break;
    case 'vine':
      bucket = 'vines';
      break;
    case 'fern':
      bucket = 'ferns';
      break;
    case 'succulent':
      bucket = 'succulents';
      break;
    case 'bulb':
      bucket = 'bulbs';
      break;
    default:
      bucket = 'other';
  }

  if (!buckets[bucket]) buckets[bucket] = [];
  buckets[bucket].push(plant);
}

// Write each bucket to its own file
for (const [bucket, items] of Object.entries(buckets)) {
  const filePath = path.join(dataDir, `plants-${bucket}.json`);
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2) + '\n');
  console.log(`  ✅ plants-${bucket}.json — ${items.length} plants`);
}

console.log(`\n🌿 Split complete: ${plants.length} plants across ${Object.keys(buckets).length} files`);
