
const mongoose = require("mongoose");
const Table = require("../models/Table");
require("dotenv").config();

const defaultTables = [
  { tableNumber: 1, capacity: 2 },
  { tableNumber: 2, capacity: 4 },
  { tableNumber: 3, capacity: 6 },
  { tableNumber: 4, capacity: 4 },
  { tableNumber: 5, capacity: 8 },
  { tableNumber: 6, capacity: 6 }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vibecoders').then(async () => {
  try {
    // Check existing tables
    const existingTables = await Table.find();
    
    if (existingTables.length > 0) {
      console.log(`Found ${existingTables.length} existing tables. Skipping seed.`);
      console.log('To reseed, delete existing tables first.');
      process.exit(0);
    }

    // Insert default tables
    const inserted = await Table.insertMany(defaultTables);
    console.log(`Successfully seeded ${inserted.length} tables:`);
    inserted.forEach(table => {
      console.log(`  - Table ${table.tableNumber}: Capacity ${table.capacity}`);
    });
    process.exit(0);
  } catch (err) {
    console.error('Error seeding tables:', err.message);
    if (err.code === 11000) {
      console.error('Duplicate table number detected. Some tables may already exist.');
    }
    process.exit(1);
  }
}).catch(err => {
  console.error('Database connection error:', err.message);
  process.exit(1);
});
