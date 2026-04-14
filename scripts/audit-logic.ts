const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const { spiritsDb } = require('../lib/db/firestore-rest');
const { calculateInitialContentRating } = require('../lib/utils/content-rating');

async function auditData() {
  try {
    const ids = await spiritsDb.getPublishedSpiritIds();
    console.log(`📡 Total Published Spirits: ${ids.length}`);

    // Fetch a sample to find most and least rich
    const samples = await Promise.all(ids.slice(0, 50).map(id => spiritsDb.getById(id)));
    const validSamples = samples.filter(Boolean);

    const sortedByDescription = [...validSamples].sort((a, b) => 
      (b.description?.length || 0) - (a.description?.length || 0)
    );

    const mostRich = sortedByDescription[0];
    const leastRich = sortedByDescription[sortedByDescription.length - 1];

    console.log('\n--- [MOST RICH SAMPLE] ---');
    console.log(`ID: ${mostRich.id}`);
    console.log(`Name: ${mostRich.name}`);
    console.log(`Desc Length: ${mostRich.description?.length || 0}`);
    console.log(`Tags: ${mostRich.flavor_tags?.length || 0}`);
    console.log(`Bilingual: ${!!(mostRich.description && mostRich.metadata?.description_en)}`);

    const mostRichRating = calculateInitialContentRating(mostRich);
    console.log('Calculation Result:', JSON.stringify(mostRichRating, null, 2));

    console.log('\n--- [LEAST RICH SAMPLE] ---');
    console.log(`ID: ${leastRich.id}`);
    console.log(`Name: ${leastRich.name}`);
    console.log(`Desc Length: ${leastRich.description?.length || 0}`);
    console.log(`Tags: ${leastRich.flavor_tags?.length || 0}`);
    console.log(`Bilingual: ${!!(leastRich.description && leastRich.metadata?.description_en)}`);

    const leastRichRating = calculateInitialContentRating(leastRich);
    console.log('Calculation Result:', JSON.stringify(leastRichRating, null, 2));

  } catch (error) {
    console.error('Audit Error:', error);
  }
}

auditData();
