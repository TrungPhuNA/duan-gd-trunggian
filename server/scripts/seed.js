const { sequelize } = require('../config/database');
const { User, Room, Transaction, SystemSetting } = require('../models');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create admin user
    const admin = await User.findOrCreate({
      where: { phone: 'admin' },
      defaults: {
        name: 'System Administrator',
        phone: 'admin',
        email: 'admin@safetrade.com',
        passwordHash: 'admin123456',
        role: 'admin',
        isVerified: true,
        isActive: true
      }
    });
    console.log('✅ Admin user created/found');

    // Create demo buyer
    const buyer = await User.findOrCreate({
      where: { phone: '0901234567' },
      defaults: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'buyer@example.com',
        passwordHash: '123456',
        role: 'buyer',
        isVerified: true,
        isActive: true
      }
    });
    console.log('✅ Demo buyer created/found');

    // Create demo seller
    const seller = await User.findOrCreate({
      where: { phone: '0907654321' },
      defaults: {
        name: 'Trần Thị B',
        phone: '0907654321',
        email: 'seller@example.com',
        passwordHash: '123456',
        role: 'seller',
        isVerified: true,
        isActive: true
      }
    });
    console.log('✅ Demo seller created/found');

    // Create demo room
    const room = await Room.findOrCreate({
      where: { name: 'Phòng Điện Thoại' },
      defaults: {
        name: 'Phòng Điện Thoại',
        description: 'Giao dịch mua bán điện thoại, máy tính bảng',
        category: 'electronics',
        ownerId: seller[0].id,
        status: 'active',
        memberCount: 2
      }
    });
    console.log('✅ Demo room created/found');

    // Create demo transaction
    const transaction = await Transaction.findOrCreate({
      where: { productName: 'iPhone 14 Pro Max' },
      defaults: {
        buyerId: buyer[0].id,
        sellerId: seller[0].id,
        roomId: room[0].id,
        productName: 'iPhone 14 Pro Max',
        productDescription: 'Máy mới 99%, fullbox, bảo hành 11 tháng',
        amount: 25000000,
        status: 'PENDING_SELLER'
      }
    });
    console.log('✅ Demo transaction created/found');

    // Create system settings
    const settings = [
      { key: 'default_fee_percentage', value: '2.00', description: 'Default transaction fee percentage' },
      { key: 'min_transaction_amount', value: '10000', description: 'Minimum transaction amount in VND' },
      { key: 'max_transaction_amount', value: '1000000000', description: 'Maximum transaction amount in VND' },
      { key: 'dispute_auto_resolve_days', value: '7', description: 'Days after which disputes are auto-resolved' },
      { key: 'maintenance_mode', value: 'false', description: 'System maintenance mode flag' }
    ];

    for (const setting of settings) {
      await SystemSetting.findOrCreate({
        where: { settingKey: setting.key },
        defaults: {
          settingKey: setting.key,
          settingValue: setting.value,
          description: setting.description,
          updatedBy: admin[0].id
        }
      });
    }
    console.log('✅ System settings created/found');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo accounts:');
    console.log('Admin: phone=admin, password=admin123456');
    console.log('Buyer: phone=0901234567, password=123456');
    console.log('Seller: phone=0907654321, password=123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
