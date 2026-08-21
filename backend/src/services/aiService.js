const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function analyzeCode(code, language) {
    const prompt = `Você é um revisor de código sênior. Analise o código abaixo escrito em ${language} e responda APENAS com um JSON válido, sem nenhum texto adicional antes ou depois, no seguinte formato exato:

{
  "score": <número de 0 a 100>,
  "pontos_fortes": ["item1", "item2"],
  "sugestoes": ["item1", "item2"],
  "complexidade": "baixa" | "media" | "alta"
}

Código para análise:
${code}`;

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
    });

    const textResponse = response.content[0].text;

    // Remove possíveis blocos de markdown (```json ... ```) que o modelo às vezes adiciona
    const cleaned = textResponse.replace(/```json|```/g, '').trim();

    return JSON.parse(cleaned);
}

module.exports = { analyzeCode };