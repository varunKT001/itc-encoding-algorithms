/**
 * Get the input and output textarea elements
 */
const input1 = document.getElementById('input-1');
const input2 = document.getElementById('input-2');
const output = document.getElementById('output');

/**
 * Get the encode button
 */
const encodeButton = document.getElementById('encode');

/**
 * Set the event listeners for the encode button
 */
encodeButton.addEventListener('click', () => {
  // Get the input alphabets
  const alphabets = (input1.value || '').trim().replace(' ', '').split(',');

  // Get the input probabilities
  const probabilities = (input2.value || '')
    .trim()
    .split(',')
    .map((p) => parseFloat(p));

  const data = alphabets.map((a, i) => [a, probabilities[i]]);

  // Compress the text using Shannon-Fano
  const codewords = shannonFano(data);

  // Output string in the format: a -> 0, b -> 10, c -> 11
  const codewordString = [...codewords]
    .map(([a, c]) => `${a.trim()} -> ${c.trim()}\n`)
    .join('');

  // Output the codewords
  output.value = codewordString;
});

function shannonFano(probabilities) {
  const codewords = new Map();
  generateCodewords('', probabilities);

  function generateCodewords(prefix, probabilities) {
    if (probabilities.length === 1) {
      codewords.set(probabilities[0][0], prefix);
      return;
    }

    const half = splitInHalf(probabilities);
    generateCodewords(prefix + '0', probabilities.slice(0, half));
    generateCodewords(prefix + '1', probabilities.slice(half));
  }

  function splitInHalf(arr) {
    let totalSum = arr.reduce((sum, item) => sum + item[1], 0);
    let partialSum = 0;
    let i = 0;

    while (i < arr.length) {
      partialSum += arr[i][1];
      if (partialSum >= totalSum / 2) break;
      i++;
    }

    return i + 1;
  }

  return codewords;
}
