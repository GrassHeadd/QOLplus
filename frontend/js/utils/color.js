/**
 * Generates a random color string, typically for CSS
 * 
 * TODO: Improve color similarity checker (e.g. shades of green that are too close won't be accepted)
 * 
 * @colorStrs Array containing all color strings to avoid
 * @tolerance For each RGB value, will avoid values within tolerance from other RGB values in colorStrs
 * @returns {String} A random string in the format: rgb(r, g, b)
 */
export function getRandomColorStr(colorStrs, tolerance = 10) {
  var r = Math.round(Math.random() * 255), g = Math.round(Math.random() * 255), b = Math.round(Math.random() * 255);
  var colorStr = "rgb(" + r + ", " + g + ", " + b + ")";

  var similarFound = false;
  for (var i = 0; i < colorStrs.length; i++) {
    var otherStrParts = colorStrs[i].replaceAll("rgb(", "")
      .replaceAll(")", "").replaceAll(" ", "").split(",");
    var otherR = parseInt(otherStrParts[0]),
      otherG = parseInt(otherStrParts[1]), otherB = parseInt(otherStrParts[2]);
    if (Math.abs(r - otherR) <= tolerance
      && Math.abs(g - otherG) <= tolerance
      && Math.abs(b - otherB) <= tolerance) {
      similarFound = true;
      break;
    }
  }

  return similarFound ? getRandomColorStr(colorStrs) : colorStr;
}