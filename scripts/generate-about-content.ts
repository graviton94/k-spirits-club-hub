/**
 * 일회성 스크립트: About Us 페이지 콘텐츠 생성
 * Gemini API를 사용하여 한/영 전문 텍스트 생성 후 콘솔 출력
 * 
 * 실행: npx tsx scripts/generate-about-content.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateKoreanContent() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `당신은 글로벌 주류 데이터 전문 에디터입니다. K-Spirits Club의 About Us 페이지를 위한 전문적이고 신뢰할 수 있는 한국어 텍스트를 작성해주세요.

K-Spirits Club은:
- 한국 및 글로벌 주류 정보를 제공하는 플랫폼
- 공공데이터와 AI를 활용한 데이터 기반 추천 시스템
- 사용자의 취향을 분석하여 맞춤형 주류를 추천
- 위스키, 전통주, 증류주 등 다양한 주류 정보 데이터베이스

4개 섹션을 작성해주세요 (각 섹션 200-250자):

1. **비전 (Vision)**
   - K-Spirits Club이 추구하는 목표
   - 주류 문화의 민주화
   - 데이터 기반 추천의 중요성

2. **공공데이터 활용 방식**
   - 신뢰할 수 있는 데이터 소스
   - 공공데이터 정제 및 검증 과정
   - 투명한 정보 제공

3. **AI 취향 분석 기술**
   - Gemini API 활용
   - 사용자 리뷰 데이터 분석
   - 개인화된 추천 알고리즘

4. **글로벌 주류 문화 기여**
   - 한국 전통주의 세계화
   - 글로벌 주류 트렌드 소개
   - 지식 공유 커뮤니티

전문적이고 신뢰감 있는 톤으로 작성하되, 과장된 마케팅 문구는 피하세요.
JSON 형식으로 출력:
{
  "vision": "...",
  "data": "...",
  "ai": "...",
  "global": "..."
}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function generateEnglishContent() {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `You are a senior editor for a global spirits data platform. Write professional and trustworthy English text for K-Spirits Club's About Us page.

K-Spirits Club is:
- A platform providing Korean and global spirits information
- A data-driven recommendation system using public data and AI
- Personalized spirits recommendations based on user taste analysis
- A comprehensive database of whisky, traditional Korean spirits, and distilled spirits

Write 4 sections (200-250 characters each):

1. **Vision**
   - K-Spirits Club's mission
   - Democratization of spirits culture
   - Importance of data-driven recommendations

2. **Public Data Utilization**
   - Reliable data sources
   - Data refinement and verification process
   - Transparent information provision

3. **AI Taste Analysis Technology**
   - Gemini API integration
   - User review data analysis
   - Personalized recommendation algorithms

4. **Global Spirits Culture Contribution**
   - Globalization of Korean traditional spirits
   - Introduction of global spirits trends
   - Knowledge-sharing community

Write in a professional and trustworthy tone, avoiding exaggerated marketing language.
Output in JSON format:
{
  "vision": "...",
  "data": "...",
  "ai": "...",
  "global": "..."
}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function main() {
    console.log('🤖 Generating About Us content with Gemini...\n');

    try {
        console.log('📝 Generating Korean content...');
        const koResult = await generateKoreanContent();
        console.log('\n=== KOREAN CONTENT ===');
        console.log(koResult);

        console.log('\n\n📝 Generating English content...');
        const enResult = await generateEnglishContent();
        console.log('\n=== ENGLISH CONTENT ===');
        console.log(enResult);

        console.log('\n\n✅ Content generated successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Copy the JSON output above');
        console.log('2. Paste into lib/constants/about-content.ts');
        console.log('3. Remove ```json and ``` markers if present');

    } catch (error) {
        console.error('❌ Error generating content:', error);
    }
}

main();
