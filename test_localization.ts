import { localizeCategory, localizeCountry } from './lib/utils/localize-field';

console.log("=== Category Localization Test ===");
const cats = [
    "레드 와인 (샤르도네)",
    "화이트 와인 (소비뇽 블랑)",
    "스파클링 와인 (세미용, 까베르네 프랑)",
    "레드 와인 (코르비나, 론디넬라, 몰리나라 블렌드)",
    "아네호",
    "Unknown Category",
    "Red Wine (Pinot Noir)",
];

console.log("\n[EN translations]");
cats.forEach(c => console.log(`${c} -> ${localizeCategory(c, 'en')}`));

console.log("\n[KO translations]");
cats.forEach(c => console.log(`${c} -> ${localizeCategory(c, 'ko')}`));

console.log("\n=== Country Localization Test ===");
const countries = [
    "도미니카 공화국",
    "Dominican Republic",
    "Jamaica",
    "자메이카",
    "United States",
    "Finland",
    "Sweden"
];

console.log("\n[EN translations]");
countries.forEach(c => console.log(`${c} -> ${localizeCountry(c, 'en')}`));

console.log("\n[KO translations]");
countries.forEach(c => console.log(`${c} -> ${localizeCountry(c, 'ko')}`));
