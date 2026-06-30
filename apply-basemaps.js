const fs = require('fs');
const json5 = require('json5');

const nmPath = 'wwwroot/init/nm.json';
const settingsPath = 'datasources/000_settings.json';

const settings = json5.parse(fs.readFileSync(settingsPath, 'utf8'));
const nm = JSON.parse(fs.readFileSync(nmPath, 'utf8'));

if (settings.baseMaps) {
  nm.baseMaps = settings.baseMaps;
}

fs.writeFileSync(nmPath, JSON.stringify(nm, null, 2), 'utf8');
console.log('Successfully applied baseMaps to', nmPath);
