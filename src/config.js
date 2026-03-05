import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import inquirer from 'inquirer';

const CONFIG_DIR = path.join(os.homedir(), '.aicommit');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_CONFIG = {
  provider: 'openai',
  model: 'gpt-4',
  apiKey: ''
};

export async function getConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf-8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
  } catch (error) {
    return DEFAULT_CONFIG;
  }
}

export async function setConfig(options) {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  
  const currentConfig = await getConfig();
  
  if (!options.provider && !options.model && !options.apiKey) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'provider',
        message: 'Select AI provider:',
        choices: ['openai', 'anthropic', 'gemini'],
        default: currentConfig.provider
      },
      {
        type: 'input',
        name: 'model',
        message: 'Enter model name:',
        default: (answers) => {
          const defaults = {
            openai: 'gpt-4',
            anthropic: 'claude-3-5-sonnet-20241022',
            gemini: 'gemini-pro'
          };
          return defaults[answers.provider];
        }
      },
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter API key:',
        default: currentConfig.apiKey
      }
    ]);
    
    options = answers;
  }
  
  const newConfig = {
    ...currentConfig,
    ...(options.provider && { provider: options.provider }),
    ...(options.model && { model: options.model }),
    ...(options.apiKey && { apiKey: options.apiKey })
  };
  
  await fs.writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
}
