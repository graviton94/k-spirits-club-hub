const path = require('path');
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const { spiritsDb } = require('../lib/db/firestore-rest');
const { calculateInitialContentRating } = require('../lib/utils/content-rating');

async function auditData() {
  try {
    const ids = await spiritsDb.getPublishedSpiritIds();
    console.log(`📡 Total Published Spirits: ${ids.length}`);

    // Fetch more samples to find a truly "rich" one
    // We'll peek at 100 items
    const samples = await Promise.all(ids.slice(0, 100).map(id => spiritsDb.getById(id)));
    const validSamples = samples.filter(Boolean);

    // Scoring logic for "Richness" (sum of various descriptive fields)
    const getRichness = (s) => {
      let score = 0;
      score += (s.description_ko?.length || 0);
      score += (s.description_en?.length || 0);
      score += (s.nose_tags?.length || 0) * 50;
      score += (s.palate_tags?.length || 0) * 50;
      score += (s.finish_tags?.length || 0) * 50;
      score += (s.pairing_guide_ko?.length || 0);
      return score;
    };

    const sortedByRichness = [...validSamples].sort((a, b) => getRichness(b) - getRichness(a));

    const mostRich = sortedByRichness[0];
    const leastRich = sortedByRichness[sortedByRichness.length - 1];

    console.log('\n=================================================');
    console.log('🏆 MOST RICH SAMPLE DATA');
    console.log('=================================================');
    console.log(JSON.stringify(mostRich, null, 2));
    
    const mostRichRating = calculateInitialContentRating(mostRich);
    console.log('\n⭐ [Logic Calculation Result - MOST RICH]');
    console.log(JSON.stringify(mostRichRating, null, 2));

    console.log('\n=================================================');
    console.log('📉 LEAST RICH SAMPLE DATA');
    console.log('=================================================');
    console.log(JSON.stringify(leastRich, null, 2));

    const leastRichRating = calculateInitialContentRating(leastRich);
    console.log('\n⭐ [Logic Calculation Result - LEAST RICH]');
    console.log(JSON.stringify(leastRichRating, null, 2));

  } catch (error) {
    console.error('Audit Error:', error);
  }
}

auditData();
