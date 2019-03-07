/**
 * Caesar Cipher Function Inspired by https://gist.github.com/EvanHahn/2587465
 *
 * @param {String} string
 * @param {Number} amount
 * @return {String}
 */
export function superFancyEncrypter(string, amount = 13) {
  if (amount < 0) {
    return superFancyEncrypter(string, amount + 26);
  }
  let output = '';
  // Go through each character
  for (let i = 0; i < string.length; i++) {
    // Get the character we'll be appending
    let char = string[i];
    // Check if this character is a letter
    if (char.match(/[a-z]/i)) {
      // Get character code
      const code = string.charCodeAt(i);
      // Convert Uppercase letters
      if ((code >= 65) && (code <= 90)) {
        char = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      }
      // Convert Lowercase letters
      else if ((code >= 97) && (code <= 122)) {
        char = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }
    output += char;
  }
  // All done!
  return output;
}
