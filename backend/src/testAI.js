require('dotenv').config();
const { analyzeCode } = require('./services/aiService');

async function test() {
    const resultado = await analyzeCode(
        'function soma(a, b) {\n  return a + b;\n}',
        'javascript'
    );
    console.log('Resultado da IA:', resultado);
}

test();