/**
 * Calculate distance between two geographical points using Haversine formula
 * @param {Object} point1 - {lat, lng}
 * @param {Object} point2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
function calculateDistance(point1, point2) {
    // Implement the Haversine formula to calculate geographic distance
   const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Earth's radius in kilometers
    const lat1 = toRadians(point1.lat);
    const lon1 = toRadians(point1.lng);
    const lat2 = toRadians(point2.lat);
    const lon2 = toRadians(point2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers 
}

/**
 * Recommend events for a user
 * @param {Object} user - User data including preferences and location
 * @param {Array} events - Array of event objects
 * @param {Object} eventSimilarity - Object mapping events to similar events
 * @param {number} limit - Maximum number of recommendations to return
 * returns {Array} Array of recommended event objects
 */
function getRecommendedEvents(user, events, eventSimilarity, limit = 5) {
    // Step 1: Filter out attended events
    const attendedSet = new Set(user.attendedEvents);
    const candidates = events.filter(event => !attendedSet.has(event.id));

    // Step 2: Compute content-based similarity scores
    const attendedCount = user.attendedEvents.length;
    const similarCounts = new Map();

    if (attendedCount > 0) {
        for (const eventId of user.attendedEvents) {
            const similarEvents = eventSimilarity[eventId] || [];
            for (const similarId of similarEvents) {
                similarCounts.set(similarId, (similarCounts.get(similarId) || 0) + 1);
            }
        }
    }

    // Step 3: Prepare user preferences as a Set
    const userPrefs = new Set(user.preferences);
    const prefCount = user.preferences.length;

    // Step 4: Compute min-max normalization for popularity
    const minPop = Math.min(...events.map(e => e.popularity), 0); // Ensure non-empty events
    const maxPop = Math.max(...events.map(e => e.popularity), 1); // Prevent divide-by-zero

    // Step 5: Score all candidate events
    const maxDist = 100; // Cap for normalization of distance-based scoring
    const scored = candidates.map(event => {
        // Content-based score (30% weight)
        const contentScore = attendedCount > 0
            ? ((similarCounts.get(event.id) || 0) / attendedCount) * 0.3
            : 0;

        // Preference match score (40% weight) with log scaling
        let prefMatch = 0;
        if (prefCount > 0) {
            const matches = event.categories.filter(cat => userPrefs.has(cat)).length;
            prefMatch = (matches / prefCount) * 0.4 * Math.log(1 + matches);
        }

        // Geographic proximity score (20% weight) with normalization
        const distance = calculateDistance(user.location, event.location);
        const geoScore = ((maxDist - Math.min(distance, maxDist)) / maxDist) * 0.2;

        // Popularity score (10% weight) with normalization
        const popScore = maxPop > minPop 
            ? ((event.popularity - minPop) / (maxPop - minPop)) * 0.1 
            : 0;

        // Total score
        const total = contentScore + prefMatch + geoScore + popScore;

        return { event, score: total };
    });

    // Step 6: Sort and return top results
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(entry => entry.event);
}

module.exports = {
    calculateDistance,
    getRecommendedEvents
};