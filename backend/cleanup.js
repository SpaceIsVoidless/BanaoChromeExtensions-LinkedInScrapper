const sequelize = require('./config/database');
const Profile = require('./models/Profile');

async function cleanup() {
  try {
    await sequelize.sync();
    
    const deleted = await Profile.destroy({
      where: {
        name: ['Error', 'Scraping Error', 'Unknown User']
      }
    });
    
    console.log(`✅ Deleted ${deleted} error profiles`);
    
    const remaining = await Profile.findAll();
    console.log(`\n📊 Remaining profiles: ${remaining.length}`);
    remaining.forEach(p => {
      console.log(`  - ${p.name} (${p.url})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanup();
