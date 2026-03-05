import inquirer from 'inquirer';
import chalk from 'chalk';

export async function selectCommitMessage(messages) {
  console.log(chalk.cyan('\n📝 Generated commit messages:\n'));

  const choices = [
    ...messages.map((msg, i) => ({
      name: `${i + 1}. ${msg}`,
      value: msg
    })),
    { name: chalk.yellow('✏️  Edit custom message'), value: 'EDIT' },
    { name: chalk.gray('🔄 Regenerate'), value: 'REGENERATE' }
  ];

  const { selected } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selected',
      message: 'Select a commit message:',
      choices
    }
  ]);

  if (selected === 'EDIT') {
    const { custom } = await inquirer.prompt([
      {
        type: 'input',
        name: 'custom',
        message: 'Enter your commit message:',
        validate: (input) => input.trim().length > 0 || 'Message cannot be empty'
      }
    ]);
    return custom;
  }

  if (selected === 'REGENERATE') {
    return 'REGENERATE';
  }

  return selected;
}
