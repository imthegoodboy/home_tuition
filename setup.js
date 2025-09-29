const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Home Tuition Website...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' });
  console.log(`✅ Node.js version: ${nodeVersion.trim()}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if MongoDB is running
try {
  execSync('mongod --version', { encoding: 'utf8' });
  console.log('✅ MongoDB is available');
} catch (error) {
  console.log('⚠️  MongoDB might not be installed or running. Please ensure MongoDB is running.');
}

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install client dependencies
console.log('\n📦 Installing client dependencies...');
try {
  process.chdir('client');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Client dependencies installed');
} catch (error) {
  console.error('❌ Failed to install client dependencies');
  process.exit(1);
}

// Install server dependencies
console.log('\n📦 Installing server dependencies...');
try {
  process.chdir('../server');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Server dependencies installed');
} catch (error) {
  console.error('❌ Failed to install server dependencies');
  process.exit(1);
}

// Create .env file if it doesn't exist
console.log('\n⚙️  Setting up environment...');
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  const envContent = `MONGODB_URI=mongodb://localhost:27017/home-tuition
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
NODE_ENV=development
PORT=5000`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('✅ .env file already exists');
}

// Go back to root directory
process.chdir('..');

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Initialize the database with sample data:');
console.log('   cd server && npm run init-data');
console.log('3. Start the development server:');
console.log('   npm run dev');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend: http://localhost:5000');
console.log('\n👤 Sample accounts:');
console.log('   Admin: admin@hometuition.com / password123');
console.log('   Student: rahul@example.com / password123');
console.log('   Teacher: rajesh@example.com / password123');

