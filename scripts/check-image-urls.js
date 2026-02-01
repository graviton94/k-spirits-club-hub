
const { spiritsDb } = require('./lib/db/firestore-rest');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
if (fs.existsSync('.env.local')) {
    dotenv.config({ path: '.env.local' });
}
dotenv.config();

async function checkImageUrls() {
    try {
        const spirits = await spiritsDb.getAll({ isPublished: true });
        console.log(`Checking ${Math.min(spirits.length, 5)} image URLs:`);
        spirits.slice(0, 5).forEach(s => {
            console.log(`- ${s.name}: ${s.imageUrl}`);
        });
    } catch (e) {
        console.error('Error:', e);
    }
}

checkImageUrls();
