const fs = require('fs');
try {
  let code = fs.readFileSync('client/src/pages/temp_restore.tsx', 'utf8');
  let lines = code.split(/\r?\n/);
  lines = lines.map(line => line.replace(/^\d+: /, ''));
  code = lines.join('\n');
  fs.writeFileSync('client/src/pages/EnhancedHome.tsx', code);
  fs.unlinkSync('client/src/pages/temp_restore.tsx');
  console.log('Restoration complete!');
} catch (e) {
  console.error('Error:', e);
}
