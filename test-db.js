const fs = require('fs');
const path = require('path');

// Manually read .env.local file
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      env[key] = valueParts.join('=').trim();
    }
  });
  return env;
}

const env = loadEnv();
const connectionString = env.DATABASE_URL;

console.log('DATABASE_URL exists:', !!connectionString);
if (connectionString) {
  console.log('DATABASE_URL starts with:', connectionString.substring(0, 30) + '...');
} else {
  console.log('DATABASE_URL starts with: NOT FOUND');
  console.log('\n📋 Make sure your .env.local has:');
  console.log('DATABASE_URL=postgresql://your_user:your_password@your_host.neon.tech/your_database?sslmode=require');
  process.exit(1);
}

// Test connection
const postgres = require('postgres');
const sql = postgres(connectionString);

sql`SELECT 1`
  .then(() => {
    console.log('✅ Connected to Neon successfully!');
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ Connection error:', e.message);
    process.exit(1);
  });