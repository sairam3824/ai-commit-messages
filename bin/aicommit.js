#!/usr/bin/env node

import 'dotenv/config';
import { program } from 'commander';
import chalk from 'chalk';
import { getStagedDiff, commitChanges } from '../src/git.js';
import { generateCommitMessages } from '../src/llm.js';
import { selectCommitMessage } from '../src/interactive.js';
import { getConfig, setConfig } from '../src/config.js';

program
  .name('aicommit')
  .description('Generate smart git commit messages using AI')
  .version('1.0.0');

program
  .command('generate')
  .alias('g')
  .description('Generate commit message from staged changes')
  .option('--type <type>', 'Force commit type (feat, fix, chore, etc.)')
  .option('--emoji', 'Use gitmoji style')
  .option('--dry-run', 'Show what would be committed without committing')
  .action(async (options) => {
    try {
      const diff = await getStagedDiff();

      if (!diff) {
        console.log(chalk.yellow('No staged changes found. Use git add to stage changes.'));
        process.exit(0);
      }

      const config = await getConfig();

      let selected;
      while (true) {
        const messages = await generateCommitMessages(diff, config, options);
        selected = await selectCommitMessage(messages);

        if (selected !== 'REGENERATE') {
          break;
        }
      }

      if (options.dryRun) {
        console.log(chalk.blue('\n[DRY RUN] Would commit with message:'));
        console.log(chalk.green(selected));
      } else {
        await commitChanges(selected);
        console.log(chalk.green('\n✓ Changes committed successfully!'));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Configure AI provider and API keys')
  .option('--provider <provider>', 'Set provider (openai, anthropic, gemini)')
  .option('--model <model>', 'Set model name')
  .option('--api-key <key>', 'Set API key')
  .action(async (options) => {
    try {
      await setConfig(options);
      console.log(chalk.green('✓ Configuration saved successfully!'));
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
