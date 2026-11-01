const { spawn, spawnSync } = require('child_process');
const fs = require('fs');

const jar = 'karate/karate.jar';
const url = 'https://github.com/karatelabs/karate/releases/download/v1.4.1/karate-1.4.1.jar';

async function main() {
  if (!fs.existsSync(jar)) {
    console.log('Downloading Karate...');
    const res = await fetch(url);
    fs.writeFileSync(jar, Buffer.from(await res.arrayBuffer()));
  }

  const server = spawn('node', ['src/server.js'], {
    env: { ...process.env, PORT: '3456' },
    stdio: 'inherit',
  });
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const result = spawnSync('java', ['-jar', jar, 'karate/student.feature'], { stdio: 'inherit' });
  server.kill();

  if (result.error) {
    console.log('Java was not found. Please install Java and try again.');
    process.exit(1);
  }
  process.exit(result.status);
}

main();