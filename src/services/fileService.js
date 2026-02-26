const fs = require('fs');
const path = require('path');
const readline = require('readline');

class FileService {
  async processCSV(filePath) {
    return new Promise((resolve, reject) => {
      const results = [];
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

      rl.on('line', (line) => {
        if (line.trim()) {
          results.push(line.trim());
        }
      });

      rl.on('close', () => resolve(results));
      rl.on('error', reject);
    });
  }

  async processTXT(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) reject(err);
        const lines = data.split('\n').filter(line => line.trim());
        resolve(lines);
      });
    });
  }

  async processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.csv') {
      return await this.processCSV(filePath);
    } else if (ext === '.txt') {
      return await this.processTXT(filePath);
    } else {
      throw new Error('Formato de archivo no soportado. Use .txt o .csv');
    }
  }

  exportToCSV(results, outputPath) {
    const header = 'Input,Hash,Algorithm,Timestamp\n';
    const rows = results.map(r => 
      `"${r.input}","${r.hash}","${r.algorithm}","${new Date().toISOString()}"`
    ).join('\n');
    
    fs.writeFileSync(outputPath, header + rows);
    return outputPath;
  }

  exportToTXT(results, outputPath) {
    const content = results.map(r => 
      `Input: ${r.input}\nHash: ${r.hash}\nAlgorithm: ${r.algorithm}\n---`
    ).join('\n\n');
    
    fs.writeFileSync(outputPath, content);
    return outputPath;
  }

  validateFileExtension(filename) {
    const ext = path.extname(filename).toLowerCase();
    return ['.txt', '.csv'].includes(ext);
  }
}

module.exports = new FileService();
