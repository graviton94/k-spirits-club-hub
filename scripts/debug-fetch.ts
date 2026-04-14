import './load-env';
console.log('DEBUG: FIREBASE_CLIENT_EMAIL after load-env:', process.env.FIREBASE_CLIENT_EMAIL ? 'FOUND' : 'MISSING');
import { spiritsDb } from '../lib/db/firestore-rest';
console.log('Spirits DB imported');
console.log('PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Attempting to fetch spirit IDs...');
spiritsDb.getPublishedSpiritIds()
  .then(ids => console.log('Found IDs:', ids.length))
  .catch(err => console.error('Error fetching IDs:', err));
