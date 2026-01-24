import axios from 'axios';

const USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
];

function buildSearchUrl(query: string): string {
    const params = new URLSearchParams({
        as_st: "y",
        as_q: query,
        as_oq: "bottle OR packaging",
        as_eq: "glass interior",
        udm: "2",
        tbs: "isz:m",
        hl: "ko"
    });
    return `https://www.google.com/search?${params.toString()}`;
}

export async function fetchSpiritImage(nameEn: string, distillery: string): Promise<string | null> {
    const query = `${nameEn} ${distillery}`;
    const url = buildSearchUrl(query);
    const headers = {
        "User-Agent": USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
    };

    try {
        const { data: html } = await axios.get(url, { headers, timeout: 15000 });

        // Regex to find Google Image JSON pattern ["URL", height, width]
        // Matches: ["https://example.com/image.jpg",1000,800]
        const regex = /\[\"(https?:\/\/[^\"\s]+\.(?:jpg|jpeg|png|webp))\",(\d+),(\d+)\]/g;
        let match;

        while ((match = regex.exec(html)) !== null) {
            const imgUrl = match[1];
            const height = parseInt(match[2], 10);
            const width = parseInt(match[3], 10);

            // Filter 1: Vertical (Portrait) images only
            if (width > height) continue;

            // Filter 2: Skip gstatic / google thumbnails if possible (unless valid resolution)
            if (imgUrl.includes('gstatic.com') || imgUrl.includes('google')) {
                // Keep looking if it's just a thumbnail
                if (imgUrl.length < 50) continue;
            }

            return imgUrl; // Found a good candidate
        }

        return null;
    } catch (error) {
        console.error(`Image Fetch Error for ${query}:`, error);
        return null;
    }
}
