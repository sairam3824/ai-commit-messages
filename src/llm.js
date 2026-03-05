import fetch from 'node-fetch';
import ora from 'ora';
import { detectLanguages } from './git.js';
import { buildPrompt } from './prompt.js';

const MAX_TOKENS = 4000;

function truncateDiff(diff) {
  if (diff.length <= MAX_TOKENS * 4) return diff;
  
  const lines = diff.split('\n');
  const summary = lines.filter(l => l.startsWith('+++') || l.startsWith('---')).slice(0, 50);
  return summary.join('\n') + '\n\n[Diff truncated for length]';
}

export async function generateCommitMessages(diff, config, options) {
  const spinner = ora('Generating commit messages...').start();
  
  try {
    const languages = detectLanguages(diff);
    const truncatedDiff = truncateDiff(diff);
    const prompt = buildPrompt(truncatedDiff, languages, options);
    
    const apiKey = config.apiKey || process.env[`${config.provider.toUpperCase()}_API_KEY`];
    
    if (!apiKey) {
      throw new Error(`API key not found. Set it with: aicommit config --api-key YOUR_KEY`);
    }
    
    let messages;
    
    switch (config.provider) {
      case 'openai':
        messages = await callOpenAI(prompt, config.model, apiKey);
        break;
      case 'anthropic':
        messages = await callAnthropic(prompt, config.model, apiKey);
        break;
      case 'gemini':
        messages = await callGemini(prompt, config.model, apiKey);
        break;
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
    
    spinner.succeed('Generated commit messages');
    return messages;
  } catch (error) {
    spinner.fail('Failed to generate messages');
    throw error;
  }
}

async function callOpenAI(prompt, model, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });
  
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return parseMessages(data.choices[0].message.content);
}

async function callAnthropic(prompt, model, apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return parseMessages(data.content[0].text);
}

async function callGemini(prompt, model, apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return parseMessages(data.candidates[0].content.parts[0].text);
}

function parseMessages(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const messages = lines
    .map(l => l.replace(/^(?:\d+\.\s*|[-*]\s*)/, '').trim())
    .filter(l => /^(?:[^\w\s]+\s*)?(feat|fix|chore|refactor|docs|test|style|perf|ci|build)(\([^)]+\))?:/.test(l));
  
  return messages.length >= 3 ? messages.slice(0, 3) : [
    ...messages,
    ...Array(Math.max(0, 3 - messages.length)).fill('chore: update code')
  ];
}
