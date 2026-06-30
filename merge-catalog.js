const fs = require('fs');
const path = require('path');
const json5 = require('json5');

const datasourcesDir = path.join(__dirname, 'datasources');
const settingsFile = path.join(datasourcesDir, '000_settings.json');
const outputFile = path.join(__dirname, 'wwwroot', 'init', 'nm.json');

// Read base settings
const settingsText = fs.readFileSync(settingsFile, 'utf8');
const settings = json5.parse(settingsText);

settings.catalog = [];

// Read all other files
const files = fs.readdirSync(datasourcesDir);
const jsonFiles = files
  .filter(f => f.endsWith('.json') && f !== '000_settings.json')
  .sort();

console.log('Merging files in this order:', jsonFiles);

for (const file of jsonFiles) {
  const filePath = path.join(datasourcesDir, file);
  try {
    const contentText = fs.readFileSync(filePath, 'utf8');
    const content = json5.parse(contentText);
    if (content.catalog && Array.isArray(content.catalog)) {
      settings.catalog.push(...content.catalog);
    }
  } catch (e) {
    console.error(`Error parsing file: ${file}`, e);
  }
}

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

// Write output as formatted JSON
fs.writeFileSync(outputFile, JSON.stringify(settings, null, 2), 'utf8');
console.log('Successfully wrote merged catalog to', outputFile);
