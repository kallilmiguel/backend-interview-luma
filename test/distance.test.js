const { calculateDistance } = require('../src/utils');

test('should calculate the distance between two locations', () => {
    const location1 = {
        lat: 42.7825,
        long: -30.7198
    };
    const location2 = {
        lat: 40.7306,
        long: -31.9518
    };
    const distance = calculateDistance(location1, location2);
    expect(distance).toBeCloseTo(250, 1);
});