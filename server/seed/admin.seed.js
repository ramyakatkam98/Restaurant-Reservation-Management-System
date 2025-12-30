const db = require('../config/db');
const User = require('../models/User');

async function createAdmin() {
  await db();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await User.findOne({ email });
  if (existing) {
    // Delete existing admin to recreate with correct password hashing
    console.log('Deleting existing admin user to recreate...');
    await User.deleteOne({ email });
  }
  // Don't hash here - let the User model's pre-save hook handle it
  const admin = new User({ name: 'Admin', email, password, role: 'admin' });
  await admin.save();
  console.log('Admin created:', email);
  console.log('Default credentials:');
  console.log('  Email:', email);
  console.log('  Password:', password);
  process.exit(0);
}

createAdmin();