export const isPrime = (num) => {
  num = parseInt(num);
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

export const processArray = (data) => {
  const numbers = data.filter(item => !isNaN(item));
  const alphabets = data.filter(item => isNaN(item));
  const lowercaseAlphabets = alphabets.filter(char => char.match(/[a-z]/));
  const highestLowercase = lowercaseAlphabets.length > 0 ? 
    [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : 
    [];
  const hasPrime = numbers.some(num => isPrime(num));

  return {
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase,
    is_prime_found: hasPrime
  };
};

export const processFile = (fileB64) => {
  if (!fileB64) {
    return {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: 0
    };
  }

  try {
    // Remove data URL prefix if present
    const base64String = fileB64.replace(/^data:[^;]+;base64,/, '');
    
    // Calculate file size: base64 string length * 0.75 gives us the byte size
    // (since base64 encoding increases size by ~33%)
    const sizeInBytes = Math.ceil((base64String.length * 3) / 4);
    const sizeInKB = Math.round(sizeInBytes / 1024);

    // Detect MIME type from base64 header
      // Default values
      let mimeType = null;
  
      // Check if it's a data URL
      if (fileB64.startsWith('data:')) {
        const matches = fileB64.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64String = matches[2];
        }
      } else {
        // If not a data URL, try to detect MIME type from the base64 header
        const buffer = Buffer.from(fileB64, 'base64');
        const header = buffer.slice(0, 4);
        
        // Check magic numbers for common file types
        if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
          mimeType = 'image/jpeg';
        } else if (
          header[0] === 0x89 && header[1] === 0x50 && 
          header[2] === 0x4E && header[3] === 0x47
        ) {
          mimeType = 'image/png';
        } else if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46) {
          mimeType = 'image/gif';
        } else if (
          header[0] === 0x42 && header[1] === 0x4D
        ) {
          mimeType = 'image/bmp';
        } else {
          // If no specific type detected, check if it's valid base64
            const decodedBuffer = Buffer.from(base64String, 'base64');
            if (decodedBuffer.length > 0) {
              mimeType = 'application/octet-stream';
            }
        }
      }

    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: sizeInKB
    };
  } catch (error) {
    return {
      file_valid: false,
      file_mime_type: null,
      file_size_kb: 0
    };
  }
};