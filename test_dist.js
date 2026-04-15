// Import data from data.js
const fs = require('fs');
eval(fs.readFileSync('data.js', 'utf8'));

// Copy the findMatchingPersonality function from app.js
function findMatchingPersonality(topDimensions, dimensionScores) {
    const userLabels = dimensionScores.map(score => score.label).filter(label => label !== null);
    if (userLabels.length === 0) return 1;

    const weights = personalities.map(personality => {
        let tags = [];
        if (personality.id === 30) {
            tags = ['平衡'];
        } else {
            tags = personality.description.split(/[+ ]+/).filter(tag => tag.trim().length > 0);
        }

        let matchCount = 0;
        tags.forEach(tag => {
            if (userLabels.includes(tag)) matchCount++;
        });

        if (personality.id === 30) {
            const balancedCount = userLabels.filter(label => label === '平衡').length;
            matchCount = balancedCount / userLabels.length * 3;
        }

        const weight = 1.0 + matchCount * 0.175;
        return weight;
    });

    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let probabilities = weights.map(w => w / totalWeight);

    const minP = 0.01;
    const maxP = 0.05;
    probabilities = probabilities.map(p => Math.max(minP, Math.min(maxP, p)));
    const totalProb = probabilities.reduce((sum, p) => sum + p, 0);
    probabilities = probabilities.map(p => p / totalProb);

    const rand = Math.random();
    let cumulative = 0;
    for (let i = 0; i < personalities.length; i++) {
        cumulative += probabilities[i];
        if (rand < cumulative) return personalities[i].id;
    }
    return 1;
}

// Test with random user profiles
const dimensions = [
    { key: 'play_style', labels: ['激进', '平衡', '保守'] },
    { key: 'game_attitude', labels: ['认真', '平衡', '佛系'] },
    { key: 'think_way', labels: ['逻辑流', '平衡', '人性流'] },
    { key: 'social_role', labels: ['带队', '平衡', '躺平'] },
    { key: 'moral_type', labels: ['正派', '平衡', '心机'] },
    { key: 'operate_style', labels: ['稳定', '平衡', '整活'] }
];

const numTrials = 50000;
const counts = Array(personalities.length + 1).fill(0);

for (let t = 0; t < numTrials; t++) {
    // Generate random user labels
    const dimensionScores = [];
    for (let dim of dimensions) {
        const label = dim.labels[Math.floor(Math.random() * dim.labels.length)];
        dimensionScores.push({ label });
    }
    const personalityId = findMatchingPersonality([], dimensionScores);
    counts[personalityId]++;
}

// Calculate percentages
console.log('Distribution (top 10):');
const results = personalities.map(p => ({
    id: p.id,
    name: p.name,
    count: counts[p.id],
    percent: (counts[p.id] / numTrials * 100).toFixed(2)
})).sort((a, b) => b.count - a.count);

results.slice(0, 10).forEach(r => {
    console.log(`${r.id.toString().padStart(2)} ${r.name.padEnd(12)} ${r.percent}%`);
});

// Check min and max percentages
const percentages = results.map(r => parseFloat(r.percent));
console.log('\nMin percentage:', Math.min(...percentages).toFixed(2) + '%');
console.log('Max percentage:', Math.max(...percentages).toFixed(2) + '%');

// Check if all within 1-5%
const allInRange = percentages.every(p => p >= 1.0 && p <= 5.0);
console.log('All within 1-5%?', allInRange ? 'YES' : 'NO');
