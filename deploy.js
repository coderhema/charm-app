const fs = require('fs');
const https = require('https');

console.log('🚀 PALLY-WRITE DEPLOYMENT TO CHARMING');
console.log('======================================');

// Read files
const moduleContent = fs.readFileSync('pally_write_module.js', 'utf-8');
const uiContent = fs.readFileSync('pally_write_ui.js', 'utf-8');

// Create payload
const payload = JSON.stringify({
  module: moduleContent,
  ui: uiContent
});

console.log('📦 Payload size: ' + payload.length + ' bytes');

// Deploy
const options = {
  hostname: 'charm.ing',
  path: '/app',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer chrm_user_iKsmpfknvBNu4rP859vMsBW4HXg0BsWaXHHxNVcp3zw',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log('📤 Sending deployment request...\n');

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('✅ Response:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
      if (parsed.ok === true) {
        console.log('\n🎉 SUCCESS! Pally-Write is now live on charming!');
      } else if (parsed.id) {
        console.log('\n🎉 SUCCESS! App deployed with ID: ' + parsed.id);
      }
    } catch (e) {
      console.log(data);
    }
    console.log('\n✨ Deployment complete!');
  });
});

req.on('error', (e) => {
  console.error('❌ Deployment failed:', e.message);
  process.exit(1);
});

req.write(payload);
req.end();
