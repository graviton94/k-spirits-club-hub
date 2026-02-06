import 'dotenv/config';
import { newsDb } from '../lib/db/firestore-rest';

async function main() {
    console.log('Fetching latest news (New Logic)...');
    try {
        const items = await newsDb.getLatest(3);
        console.log(`Fetched ${items.length} items.`);
        if (items.length > 0) {
            console.log('Sample item:', JSON.stringify(items[0], null, 2));
        } else {
            console.log('No items found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
