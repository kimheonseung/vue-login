
import cryptoJs from "crypto-js";

const key = 'devh0000000000000000000000000000';

const converter = {
    wordToByteArray : (word, length) => {
        let ba = [];
        const xFF = 0xFF;
        if (length > 0)
          ba.push(word >>> 24);
        if (length > 1)
          ba.push((word >>> 16) & xFF);
        if (length > 2)
          ba.push((word >>> 8) & xFF);
        if (length > 3)
          ba.push(word & xFF);

        return ba;
    },
    wordArrayToByteArray : (wordArray, length) => {
        if (Object.prototype.hasOwnProperty.call(wordArray, 'sigBytes') && 
            Object.prototype.hasOwnProperty.call(wordArray, 'words')) {
          length = wordArray.sigBytes;
          wordArray = wordArray.words;
        }

        let result = [];
        let bytes;
        let i = 0;
        while (length > 0) {
          bytes = converter.wordToByteArray(wordArray[i], Math.min(4, length));
          length -= bytes.length;
          result.push(bytes);
          i++;
        }
        return [].concat.apply([], result);
    },
    byteArrayToWordArray : (ba) => {
        let wa = [];
        for (let i = 0; i < ba.length; i++) {
          wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
        }
        return cryptoJs.lib.WordArray.create(wa, ba.length);
    }
}

const encrypt = (str) => {
    const salt = cryptoJs.lib.WordArray.random(128 / 8);
    const iv = cryptoJs.lib.WordArray.random(128 / 8);
    const key256Bits = cryptoJs.PBKDF2(key, salt, {
        keySize: 256 / 32,
        iterations: 1000
    });
    const encrypted = cryptoJs.AES.encrypt(cryptoJs.enc.Utf8.parse(str), key256Bits, {
        iv: iv,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7
    });

    let result = [];
    converter.wordArrayToByteArray(salt).forEach(w => result.push(w));
    converter.wordArrayToByteArray(iv).forEach(w => result.push(w));
    converter.wordArrayToByteArray(encrypted.ciphertext).forEach(w => result.push(w));
    return cryptoJs.enc.Base64.stringify(converter.byteArrayToWordArray(result));
    // return salt.toString(cryptoJs.enc.Hex) + iv.toString(cryptoJs.enc.Hex) + cryptoJs.enc.Base64.stringify(encrypted.ciphertext)
}

export default {
    encrypt: encrypt
}