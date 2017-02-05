module.exports.isValidCoords = function(long, lat) {
  if (isNaN(long) || isNaN(lat)) {
    return false;
  }

  if (long < -180.0 || long > 180.0) {
    return false;
  }

  if (lat < -90.0 || lat > 90.0) {
    return false;
  }

  return true;
};
