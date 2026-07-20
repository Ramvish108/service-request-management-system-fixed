import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { ServiceRequest } from '../models/ServiceRequest';

dotenv.config();

const seedData = async () => {
  try {
    if (process.env.DB_SEED_MODE !== 'active') {
      console.error('Error: Seeding is locked. Set DB_SEED_MODE=active in server/.env to run.');
      process.exit(1);
    }

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('Error: MONGODB_URI is not defined.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany({});
    await ServiceRequest.deleteMany({});
    console.log('Cleared existing database entries.');

    const userPasswordHash = await bcrypt.hash('User@123', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isActive: true,
    });

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
    });

    console.log('Created Users:');
    console.log(`- User: ${regularUser.email} (Password: User@123)`);
    console.log(`- Admin: ${adminUser.email} (Password: Admin@123)`);

    const request1 = await ServiceRequest.create({
      title: 'VPN Connection Failure',
      description: 'Unable to connect to the corporate VPN from home network since this morning. Getting code 809.',
      category: 'NETWORK',
      priority: 'HIGH',
      status: 'OPEN',
      createdBy: regularUser._id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: regularUser._id,
          note: 'Initial submission',
        },
      ],
    });

    const request2 = await ServiceRequest.create({
      title: 'MS Office Activation Required',
      description: 'MS Word and Excel show "Product Unlicensed" popup and cannot edit files.',
      category: 'SOFTWARE',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      createdBy: regularUser._id,
      assignedTo: adminUser._id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: regularUser._id,
          note: 'Initial submission',
        },
        {
          status: 'IN_PROGRESS',
          changedBy: adminUser._id,
          note: 'Assigned to admin for license keys replacement',
        },
      ],
    });

    const request3 = await ServiceRequest.create({
      title: 'Laptop Battery Replacement',
      description: 'Laptop battery runs out in less than 30 minutes. Needs a replacement battery.',
      category: 'HARDWARE',
      priority: 'LOW',
      status: 'RESOLVED',
      createdBy: regularUser._id,
      assignedTo: adminUser._id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: regularUser._id,
          note: 'Initial submission',
        },
        {
          status: 'RESOLVED',
          changedBy: adminUser._id,
          note: 'Battery replaced and verified.',
        },
      ],
    });

    console.log(`Seeded ${await ServiceRequest.countDocuments()} service requests.`);
    
    await mongoose.disconnect();
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
