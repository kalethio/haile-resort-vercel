console.log("Node.js version:", process.version);
console.log("Current directory:", process.cwd());
try {
  console.log("Next path exists:", require('fs').existsSync('node_modules/next/dist/bin/next'));
} catch(e) {
  console.log("Error:", e.message);
}
