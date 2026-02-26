const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

class HashService {
  generateMD5(input) {
    return crypto.createHash('md5').update(input).digest('hex');
  }

  generateSHA1(input) {
    return crypto.createHash('sha1').update(input).digest('hex');
  }

  generateSHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  generateSHA512(input) {
    return crypto.createHash('sha512').update(input).digest('hex');
  }

  async generateBcrypt(input, rounds = 10) {
    return await bcrypt.hash(input, rounds);
  }

  async verifyBcrypt(input, hash) {
    return await bcrypt.compare(input, hash);
  }

  generateHash(input, algorithm) {
    switch (algorithm.toUpperCase()) {
      case 'MD5':
        return this.generateMD5(input);
      case 'SHA1':
        return this.generateSHA1(input);
      case 'SHA256':
        return this.generateSHA256(input);
      case 'SHA512':
        return this.generateSHA512(input);
      case 'BCRYPT':
        return this.generateBcrypt(input);
      default:
        throw new Error(`Algoritmo '${algorithm}' no soportado`);
    }
  }

  async verifyHash(input, hash, algorithm) {
    if (algorithm.toUpperCase() === 'BCRYPT') {
      return await this.verifyBcrypt(input, hash);
    }
    
    const generatedHash = this.generateHash(input, algorithm);
    return generatedHash === hash;
  }

  async processFile(filePath, algorithm) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return this.generateHash(content, algorithm);
  }

  async processMultipleHashes(inputs, algorithm) {
    const results = [];
    for (const input of inputs) {
      results.push({
        input: input.trim(),
        hash: this.generateHash(input.trim(), algorithm)
      });
    }
    return results;
  }
}

module.exports = new HashService();
