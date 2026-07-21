import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { ServiceRequest } from '../models/ServiceRequest';

dotenv.config();

const seedData = async () => {
  try {
    // ✅ Check if seed mode is active
    if (process.env.DB_SEED_MODE !== 'active') {
      console.error('❌ Error: Seeding is locked. Set DB_SEED_MODE=active in server/.env to run.');
      process.exit(1);
    }

    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('❌ Error: MONGODB_URI is not defined.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await ServiceRequest.deleteMany({});
    console.log('✅ Cleared existing database entries.');

    // Hash passwords
    const userPasswordHash = await bcrypt.hash('User@123', 10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);

    // Create regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isActive: true,
    });

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isActive: true,
    });

    console.log('✅ Created Users:');
    console.log(`  - User: ${regularUser.email} (Password: User@123)`);
    console.log(`  - Admin: ${adminUser.email} (Password: Admin@123)`);

    // Create sample request 1 - VPN Issue (OPEN)
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
          comment: 'Initial submission',
          changedAt: new Date(),
        },
      ],
    });

    // Create sample request 2 - Software Issue (IN_PROGRESS)
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
          comment: 'Initial submission',
          changedAt: new Date(Date.now() - 86400000), // 1 day ago
        },
        {
          status: 'IN_PROGRESS',
          changedBy: adminUser._id,
          comment: 'Assigned to admin for license keys replacement',
          changedAt: new Date(),
        },
      ],
    });

    // Create sample request 3 - Hardware Issue (RESOLVED)
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
          comment: 'Initial submission',
          changedAt: new Date(Date.now() - 172800000), // 2 days ago
        },
        {
          status: 'RESOLVED',
          changedBy: adminUser._id,
          comment: 'Battery replaced and verified.',
          changedAt: new Date(Date.now() - 86400000), // 1 day ago
        },
      ],
    });

    // Create sample request 4 - Access Issue (CANCELLED)
    const request4 = await ServiceRequest.create({
      title: 'Database Access Request',
      description: 'Need read access to production database for analytics.',
      category: 'ACCESS',
      priority: 'MEDIUM',
      status: 'CANCELLED',
      createdBy: regularUser._id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: regularUser._id,
          comment: 'Initial submission',
          changedAt: new Date(Date.now() - 259200000), // 3 days ago
        },
        {
          status: 'CANCELLED',
          changedBy: regularUser._id,
          comment: 'Cancelled by user - no longer needed',
          changedAt: new Date(Date.now() - 172800000), // 2 days ago
        },
      ],
    });

    // Create sample request 5 - Network Issue (URGENT)
    const request5 = await ServiceRequest.create({
      title: 'URGENT: Internet Down for Entire Office',
      description: 'All staff in office cannot connect to internet. Critical business impact.',
      category: 'NETWORK',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      createdBy: adminUser._id,
      assignedTo: adminUser._id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: adminUser._id,
          comment: 'Initial submission - Critical issue',
          changedAt: new Date(Date.now() - 3600000), // 1 hour ago
        },
        {
          status: 'IN_PROGRESS',
          changedBy: adminUser._id,
          comment: 'ISP notified, working on fix',
          changedAt: new Date(),
        },
      ],
    });

    const requestCount = await ServiceRequest.countDocuments();
    console.log(`✅ Seeded ${requestCount} service requests.`);
    
    // Log summary
    console.log('\n📊 Seed Summary:');
    console.log(`  - Users: 2 (1 User, 1 Admin)`);
    console.log(`  - Requests: ${requestCount}`);
    console.log(`  - Status: OPEN (1), IN_PROGRESS (2), RESOLVED (1), CANCELLED (1)`);
    console.log('\n🔑 Login Credentials:');
    console.log(`  - User:  user@example.com / User@123`);
    console.log(`  - Admin: admin@example.com / Admin@123`);
    
    await mongoose.disconnect();
    console.log('\n✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();