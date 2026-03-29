
import dotenv from 'dotenv';
dotenv.config();

async function testRegistration() {
    console.log('--- Testing Spirit Registration API ---');
    const payload = {
        name: "검증 테스트 위스키 " + new Date().getTime(),
        category: "Whisky",
        isPublished: true,
        distillery: "Antigravity Distillery",
        abv: 43,
        volume: 700
    };

    try {
        const response = await fetch('http://127.0.0.1:3000/api/admin/spirits', {
            method: 'POST',


            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const text = await response.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${text}`);

        if (status === 201) {
            const data = JSON.parse(text);
            console.log(`✅ Success! Created ID: ${data.id}`);
            console.log(`   isPublished: ${data.spirit.isPublished}`);
            console.log(`   status: ${data.spirit.status}`);
        } else {
            console.log('❌ Failed');
        }
    } catch (error) {
        console.error('Error during fetch:', error);
    }
}

testRegistration();
