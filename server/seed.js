require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGODB_URI;

const categories = [
  { name: 'Grains & Rice',    emoji: '🌾', sortOrder: 1 },
  { name: 'Flours',           emoji: '🌿', sortOrder: 2 },
  { name: 'Pulses & Dal',     emoji: '🫘', sortOrder: 3 },
  { name: 'Spices',           emoji: '🌶️', sortOrder: 4 },
  { name: 'Oil & Ghee',       emoji: '🫙', sortOrder: 5 },
  { name: 'Sugar & Salt',     emoji: '🧂', sortOrder: 6 },
  { name: 'Dry Fruits',       emoji: '🥜', sortOrder: 7 },
];

const getProducts = (catMap) => [
  // ── Grains & Rice ──────────────────────────────────────────
  { name: 'Basmati Rice',       price: 120, unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Sona Masoori Rice',  price: 60,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Kolam Rice',         price: 55,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Wheat (Gehun)',       price: 35,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Jowar',               price: 40,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Bajra (Vatlo)',       price: 38,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Nagli (Ragi)',        price: 50,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Makai (Corn)',        price: 32,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Barley (Jav)',        price: 45,  unit: '1 kg',  category: catMap['Grains & Rice'] },
  { name: 'Poha (Flattened Rice)', price: 55, unit: '1 kg', category: catMap['Grains & Rice'] },
  { name: 'Sabudana',            price: 90,  unit: '1 kg',  category: catMap['Grains & Rice'] },

  // ── Flours ─────────────────────────────────────────────────
  { name: 'Wheat Flour (Atta)',  price: 42,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Jowar Flour',         price: 48,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Bajra Flour',         price: 45,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Nagli Flour (Ragi)',   price: 60,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Besan (Gram Flour)',   price: 70,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Maida',               price: 38,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Rice Flour',          price: 45,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Suji (Rava)',         price: 40,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Corn Flour',          price: 55,  unit: '1 kg',  category: catMap['Flours'] },
  { name: 'Nachni Flour',        price: 58,  unit: '1 kg',  category: catMap['Flours'] },

  // ── Pulses & Dal ───────────────────────────────────────────
  { name: 'Toor Dal',            price: 140, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Moong Dal (Yellow)',  price: 120, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Moong Dal (Green)',   price: 110, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Chana Dal',           price: 95,  unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Urad Dal (White)',    price: 130, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Urad Dal (Black)',    price: 125, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Masoor Dal (Red)',    price: 100, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Rajma (Kidney Beans)', price: 130, unit: '1 kg', category: catMap['Pulses & Dal'] },
  { name: 'Chole (Kabuli Chana)', price: 110, unit: '1 kg', category: catMap['Pulses & Dal'] },
  { name: 'Val Dal',             price: 105, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Matki',               price: 100, unit: '1 kg',  category: catMap['Pulses & Dal'] },
  { name: 'Chawli (Lobia)',      price: 95,  unit: '1 kg',  category: catMap['Pulses & Dal'] },

  // ── Spices ─────────────────────────────────────────────────
  { name: 'Turmeric (Haldi)',    price: 80,  unit: '200 g', category: catMap['Spices'] },
  { name: 'Red Chilli Powder',   price: 90,  unit: '200 g', category: catMap['Spices'] },
  { name: 'Coriander Powder',    price: 60,  unit: '200 g', category: catMap['Spices'] },
  { name: 'Cumin (Jeera)',       price: 70,  unit: '100 g', category: catMap['Spices'] },
  { name: 'Mustard Seeds (Rai)', price: 40,  unit: '100 g', category: catMap['Spices'] },
  { name: 'Garam Masala',        price: 80,  unit: '100 g', category: catMap['Spices'] },
  { name: 'Hing (Asafoetida)',   price: 50,  unit: '50 g',  category: catMap['Spices'] },
  { name: 'Methi Seeds',         price: 45,  unit: '100 g', category: catMap['Spices'] },

  // ── Oil & Ghee ─────────────────────────────────────────────
  { name: 'Groundnut Oil',       price: 180, unit: '1 L',   category: catMap['Oil & Ghee'] },
  { name: 'Sunflower Oil',       price: 150, unit: '1 L',   category: catMap['Oil & Ghee'] },
  { name: 'Coconut Oil',         price: 200, unit: '1 L',   category: catMap['Oil & Ghee'] },
  { name: 'Mustard Oil',         price: 160, unit: '1 L',   category: catMap['Oil & Ghee'] },
  { name: 'Desi Ghee',           price: 550, unit: '500 g', category: catMap['Oil & Ghee'] },
  { name: 'Vanaspati Ghee',      price: 130, unit: '500 g', category: catMap['Oil & Ghee'] },

  // ── Sugar & Salt ───────────────────────────────────────────
  { name: 'Sugar (Cheeni)',      price: 45,  unit: '1 kg',  category: catMap['Sugar & Salt'] },
  { name: 'Jaggery (Gur)',       price: 60,  unit: '1 kg',  category: catMap['Sugar & Salt'] },
  { name: 'Rock Salt (Sendha)',  price: 35,  unit: '500 g', category: catMap['Sugar & Salt'] },
  { name: 'Iodised Salt',        price: 20,  unit: '1 kg',  category: catMap['Sugar & Salt'] },
  { name: 'Powdered Sugar',      price: 55,  unit: '500 g', category: catMap['Sugar & Salt'] },

  // ── Dry Fruits ─────────────────────────────────────────────
  { name: 'Almonds (Badam)',     price: 700, unit: '250 g', category: catMap['Dry Fruits'] },
  { name: 'Cashews (Kaju)',      price: 800, unit: '250 g', category: catMap['Dry Fruits'] },
  { name: 'Raisins (Kishmish)', price: 200, unit: '250 g', category: catMap['Dry Fruits'] },
  { name: 'Peanuts (Mungfali)', price: 60,  unit: '250 g', category: catMap['Dry Fruits'] },
  { name: 'Walnuts (Akhrot)',   price: 600, unit: '250 g', category: catMap['Dry Fruits'] },
  { name: 'Dates (Khajur)',     price: 180, unit: '250 g', category: catMap['Dry Fruits'] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear old data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared old categories and products');

    // Insert categories
    const insertedCats = await Category.insertMany(
      categories.map(c => ({ ...c, isActive: true }))
    );
    console.log(`✅ Inserted ${insertedCats.length} categories`);

    // Build name → _id map
    const catMap = {};
    insertedCats.forEach(c => { catMap[c.name] = c._id; });

    // Insert products
    const products = getProducts(catMap);
    const insertedProds = await Product.insertMany(
      products.map(p => ({ ...p, isActive: true, inStock: true }))
    );
    console.log(`✅ Inserted ${insertedProds.length} products`);

    console.log('\n🎉 Seed complete! Your store is stocked.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();