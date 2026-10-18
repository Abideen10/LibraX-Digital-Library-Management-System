// ============================================
// Database Migration Script
// อัปเดตโครงสร้างฐานข้อมูลสำหรับ Pending/Rejected status
// ============================================

const { pool } = require('./connection');

async function runMigration() {
  console.log('🔄 Starting database migration...');

  try {
    // 1. อัปเดตตาราง borrowings
    console.log('⏳ Updating borrowings table status ENUM...');
    await pool.execute(`
      ALTER TABLE borrowings 
      MODIFY COLUMN status ENUM('Pending', 'Borrowed', 'Returned', 'Overdue', 'Rejected') 
      NOT NULL DEFAULT 'Pending'
    `);
    console.log('✅ borrowings table updated.');

    // 2. อัปเดตตาราง borrowing_items
    console.log('⏳ Updating borrowing_items table status ENUM...');
    await pool.execute(`
      ALTER TABLE borrowing_items 
      MODIFY COLUMN status ENUM('Pending', 'Borrowed', 'Returned', 'Overdue', 'Rejected') 
      NOT NULL DEFAULT 'Pending'
    `);
    console.log('✅ borrowing_items table updated.');

    console.log('\n🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runMigration();
