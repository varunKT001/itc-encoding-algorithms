/**
 * Get the input and output textarea elements
 */
const input = document.getElementById('input');
const output = document.getElementById('output');

/**
 * Get the encode and decode buttons
 */
const encodeButton = document.getElementById('encode');
const decodeButton = document.getElementById('decode');

/**
 * Set the event listeners for the encode button
 */
encodeButton.addEventListener('click', () => {
  // Get the input text
  const inputParagraph = input.value || '';

  // Compress the text
  const compressed = lempelZipCompression(inputParagraph, 100);

  // Get the coded characters string
  const codedCharactersString = compressed.reduce(
    (acc, [offset, length, nextChar]) => {
      return acc + `(${offset} ${length} ${nextChar}) `;
    },
    ''
  );

  // Set the output textarea value
  output.value = codedCharactersString;
});

/**
 * Set the event listeners for the decode button
 */
decodeButton.addEventListener('click', () => {
  // Get the input text
  const inputParagraph = input.value || '';

  // Get the coded characters array
  const codedCharacters = inputParagraph
    .split(') ')
    .filter((c) => c)
    .map((c) => {
      const [offset, length, nextChar] = c
        .replace('(', '')
        .split(' ')
        .map((c) => parseInt(c));
      return [offset, length, nextChar];
    });

  // Decompress the text
  const decompressed = lempelZipDecompression(codedCharacters);

  // Set the output textarea value
  output.value = decompressed;
});

function lempelZipCompression(text, windowSize) {
  const asciiText = text.split('').map((c) => c.charCodeAt(0));
  let compressed = [];
  let position = 0;

  while (position < asciiText.length) {
    let searchStartPosition = Math.max(0, position - windowSize);
    let searchEndPosition = position;
    let searchWindow = asciiText.slice(searchStartPosition, searchEndPosition);
    let maxLength = 0;
    let maxOffset = 0;

    for (let i = 0; i < searchWindow.length; i++) {
      let length = 0;
      while (
        asciiText[position + length] === searchWindow[i - length] &&
        position + length < asciiText.length
      ) {
        length++;
      }

      if (length > maxLength) {
        maxLength = length;
        maxOffset = searchWindow.length - i;
      }
    }

    compressed.push([maxOffset, maxLength, asciiText[position + maxLength]]);
    position += maxLength + 1;
  }

  return compressed;
}

function lempelZipDecompression(compressedData) {
  let decompressed = [];
  compressedData.forEach(([offset, length, nextChar]) => {
    const startPosition = decompressed.length - offset;

    for (let i = 0; i < length; i++) {
      decompressed.push(decompressed[startPosition + i]);
    }

    decompressed.push(nextChar);
  });

  return String.fromCharCode(...decompressed);
}

function compressionRatio(originalText, compressedData) {
  const originalSize = originalText.length * 8;
  const compressedSize = compressedData.length * (16 + 16 + 8);
  return originalSize / compressedSize;
}
