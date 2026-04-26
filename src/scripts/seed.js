/**
 * Seed script — creates sample landlord, tenant, property, tenancy, and rent log.
 * Run: node src/scripts/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const Landlord = require('../models/Landlord');
const Tenant   = require('../models/Tenant');
const Property = require('../models/Property');
const Tenancy  = require('../models/Tenancy');
const RentLog  = require('../models/RentLog');

const seed = async () => {
  await connectDB();
  console.log('Connected. Seeding…');

  // Clean up previous seed data
  await Promise.all([
    Landlord.deleteMany({ phone: /^999/ }),
    Tenant.deleteMany({ phone: /^888/ }),
  ]);

  // 1. Landlord
  const landlord = await Landlord.create({
    phone: '9990000001',
    name:  'Ramesh Kumar',
    email: 'ramesh@example.com',
    address: {
      houseNumber: '12',
      society: 'Green Valley',
      locality: 'Sector 45',
      city: 'Gurugram',
      pinCode: '122003',
      state: 'Haryana',
    },
  });
  console.log('✓ Landlord:', landlord.phone);

  // 2. Tenant
  const tenant = await Tenant.create({
    phone: '8880000001',
    name:  'Suresh Sharma',
    email: 'suresh@example.com',
    address: {
      houseNumber: '5B',
      society: 'Sunrise Apartments',
      locality: 'Koregaon Park',
      city: 'Pune',
      pinCode: '411001',
      state: 'Maharashtra',
    },
  });
  console.log('✓ Tenant:', tenant.phone);

  // 3. Property
  const property = await Property.create({
    landlordId: landlord._id,
    name: 'Green Valley 2BHK',
    address: {
      houseNumber: '12',
      society: 'Green Valley',
      locality: 'Sector 45',
      city: 'Gurugram',
    },
    roomDetails: { bedrooms: 2, bathrooms: 2, parkingAvailable: true },
    areaDetails: { carpetArea: 900 },
    floorDetails: { totalFloors: 5, propertyOnFloor: 3 },
  });
  landlord.properties.push(property._id);
  await landlord.save();
  console.log('✓ Property:', property.name);

  // 4. Active Tenancy
  const tenancy = await Tenancy.create({
    tenantId:      tenant._id,
    landlordId:    landlord._id,
    propertyId:    property._id,
    rentAmount:    18000,
    depositAmount: 54000,
    startDate:     new Date('2025-01-01'),
    status:        'active',
  });
  console.log('✓ Tenancy:', tenancy._id);

  // 5. Rent logs for past 3 months
  const months = ['2025-01', '2025-02', '2025-03'];
  for (const month of months) {
    await RentLog.create({
      tenancyId: tenancy._id,
      month,
      amount: 18000,
      status: 'paid',
      paidAt: new Date(`${month}-05`),
    });
  }
  console.log('✓ Rent logs for:', months.join(', '));

  console.log('\n── Seed complete ──────────────────────────────');
  console.log('Landlord phone : 9990000001');
  console.log('Tenant phone   : 8880000001');
  console.log('Property ID    :', property._id.toString());
  console.log('Tenancy ID     :', tenancy._id.toString());
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
