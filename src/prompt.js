const GITMOJI_MAP = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '💄',
  refactor: '♻️',
  perf: '⚡️',
  test: '✅',
  build: '👷',
  ci: '💚',
  chore: '🔧'
};

export function buildPrompt(diff, languages, options) {
  const langContext = languages.length > 0
    ? `Languages detected: ${languages.join(', ')}\n`
    : '';

  const typeConstraint = options.type
    ? `You MUST use the commit type: ${options.type}\n`
    : '';

  const emojiInstruction = options.emoji
    ? 'Add appropriate gitmoji emoji at the start of each message.\n'
    : '';

  return `Generate 3 conventional commit messages for the following git diff.

${langContext}${typeConstraint}${emojiInstruction}
Rules:
- Use conventional commit format: type(scope): description
- Types: feat, fix, chore, refactor, docs, test, style, perf, ci, build
- Keep messages concise (max 72 characters)
- Focus on WHAT changed and WHY, not HOW
- Each message on a new line

Git diff:
${diff}

Generate 3 different commit messages:`;
}


