# CodeReview AI 🤖

Plataforma onde desenvolvedores compartilham trechos de código e recebem análises automáticas de qualidade geradas por Inteligência Artificial, além de feedback da comunidade.

## 🎯 Motivação

Projeto criado para explorar a integração de LLMs em aplicações reais, indo além de simples chamadas de chat — aqui a IA atua como um "revisor de código" automatizado, com respostas estruturadas e processamento assíncrono em background.

## ⚙️ Funcionalidades

- Autenticação de usuários com JWT
- Postagem de snippets de código
- Análise automática via IA (score de qualidade, pontos fortes, sugestões de melhoria)
- Processamento assíncrono (a IA analisa em background, sem travar a API)

## 🛠️ Tecnologias

**Backend:** Node.js, Express, Sequelize, MySQL, JWT, bcrypt
**IA:** Anthropic API (Claude)
**Em desenvolvimento:** React (frontend), React Native (mobile), Socket.io (tempo real)

## 🚀 Como rodar localmente

\`\`\`bash
cd backend
npm install
# configure o .env com suas credenciais (veja .env.example)
npm run dev
\`\`\`

## 📌 Status do projeto

🚧 Em desenvolvimento ativo — backend funcional, frontend e mobile em construção.

## 👤 Autor

Darlan — [LinkedIn](www.linkedin.com/in/darlan-flausino-89250526a) | [GitHub](https://github.com/Darlanfl)