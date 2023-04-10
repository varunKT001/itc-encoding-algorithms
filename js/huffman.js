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
  const codewords = huffman(data);

  // Output string in the format: a -> 0, b -> 10, c -> 11
  const codewordString = [...codewords]
    .map(([a, c]) => `${a.trim()} -> ${c.trim()}\n`)
    .join('');

  // Output the codewords
  output.value = codewordString;
});

function huffman(probabilities) {
  const nodes = probabilities.map(([key, probability]) => ({
    key,
    probability,
    left: null,
    right: null,
  }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.probability - b.probability);
    const left = nodes.shift();
    const right = nodes.shift();
    const newNode = {
      key: null,
      probability: left.probability + right.probability,
      left,
      right,
    };
    nodes.push(newNode);
  }

  const codewords = new Map();
  generateCodewords('', nodes[0]);

  function generateCodewords(prefix, node) {
    if (node.key !== null) {
      codewords.set(node.key, prefix);
    } else {
      generateCodewords(prefix + '0', node.left);
      generateCodewords(prefix + '1', node.right);
    }
  }

  return codewords;
}
