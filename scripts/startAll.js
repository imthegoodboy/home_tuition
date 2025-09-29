const { execSync, spawn } = require('child_process');
const path = require('path');

// Cross-platform port killing for Windows (powershell)
function killPort(port) {
  try {
    if (process.platform === 'win32') {
      // use netstat to find pid then taskkill
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      const lines = out.split('\n').map(l => l.trim()).filter(Boolean);
      const pids = new Set();
      for (const line of lines) {
        const parts = line.split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        try {
          console.log(`Killing PID ${pid} using port ${port}`);
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
        } catch (e) {
          // ignore
        }
      }
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: 'inherit' });
    }
  } catch (err) {
    // no process using the port or command failed; that's fine
  }
}

function portIsFree(port) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
      return !out.split('\n').map(l => l.trim()).filter(Boolean).length;
    }
    const out = execSync(`lsof -i:${port}`, { encoding: 'utf8' });
    return !out.split('\n').map(l => l.trim()).filter(Boolean).length;
  } catch (err) {
    return true;
  }
}

function waitForPortFree(port, retries = 6, delayMs = 500) {
  return new Promise((resolve) => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (portIsFree(port) || attempts >= retries) {
        clearInterval(interval);
        resolve(portIsFree(port));
      }
    }, delayMs);
  });
}

(async () => {
  try {
    console.log('Stopping processes on ports 3000 and 5000 if any...');
    killPort(3000);
    killPort(5000);

    console.log('Waiting for ports to be freed...');
    await waitForPortFree(3000);
    await waitForPortFree(5000);

    console.log('Starting backend and frontend...');

    // Start server first
    const server = spawn('cmd', ['/c', 'npm run server'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });

    // Small delay before starting client to reduce race on port reuse
    await new Promise(res => setTimeout(res, 500));

    // Start client
    const client = spawn('cmd', ['/c', 'npm run client'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true,
    });

    // Forward exit
    const onExit = (code) => process.exit(code);
    server.on('exit', onExit);
    client.on('exit', onExit);
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
})();
