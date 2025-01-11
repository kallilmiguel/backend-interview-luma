const R = 6371; // Radius of the earth in km

function calculateDistance(location1, location2) {
    const dLat = degreesToRadians(location2.lat - location1.lat);
    const dLong = degreesToRadians(location2.long - location1.long);
    // Haversine formula
    const a = 
        Math.sin(dLat/2) ** 2 +
        Math.cos(degreesToRadians(location1.lat)) * 
        Math.cos(degreesToRadians(location2.lat)) * 
        Math.sin(dLong/2) **2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    // Final distance is in km
    return R * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

module.exports = { calculateDistance };