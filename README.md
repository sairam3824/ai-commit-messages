# 🤖 AI Commit Messages

Smart Git commit message generator powered by LLMs. Never write a bad commit message again.

![Demo](demo.gif)

[![Built with Claude](https://img.shields.io/badge/Built%20with-Claude-blueviolet)](https://claude.ai)
[![npm version](https://img.shields.io/npm/v/ai-commit-messages.svg)](https://www.npmjs.com/package/ai-commit-messages)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎯 Generates conventional commit messages (feat, fix, chore, etc.)
- 🤖 Powered by OpenAI GPT models
- 🎨 Optional gitmoji support
- 🔍 Auto-detects languages and frameworks
- ⚡️ Interactive selection with 3 message options
- 🛠️ Simple .env configuration
- 🧪 Dry-run mode for testing

## 📦 Installation
There are two ways to run this CLI tool based on your current setup.

### Option 1: Global Installation
```bash
# Clone the repository and navigate into it
npm install
npm link
```
Using `npm link` allows you to simply type `aicommit` anywhere on your computer instead of having to type the full path to the script!

### Option 2: Local Usage
```bash
npm install
node bin/aicommit.js generate
```

## 🚀 Quick Start

1. Start by configuring the AI model of your choice. You will need an API key for the platform you pick (OpenAI, Anthropic, or Gemini):

```bash
aicommit config
```
*(If you didn't do `npm link`, run it via `node bin/aicommit.js config` instead).*

2. Stage your git changes in the repository you're working on:

```bash
git add .
```

3. Generate a commit message based on your staged code!

```bash
aicommit generate
# or shorthand: aicommit g
```

## 🐛 Recent Bug Fixes
This repository was recently updated to fix bugs:
- **Parser Regex**: Modified the regex string extracting AI outputs so that it no longer breaks or falls back to 'chore:' when list formatting or scopes are present.
- **Regenerate Loop**: Fully implemented the `Regenerate` option in the terminal UI menu by wrapping the flow in a `while` loop, allowing for an endless querying without crashing.
- **Dead Code Extracted**: Removed unused logic across the CLI.

## 🎮 Usage

### Basic Usage

```bash
# Generate commit message from staged changes
aicommit generate

# Use shorthand
aicommit g
```

### Advanced Options

```bash
# Force a specific commit type
aicommit g --type feat

# Use gitmoji style
aicommit g --emoji

# Dry run (preview without committing)
aicommit g --dry-run

# Combine options
aicommit g --type fix --emoji --dry-run
```

### Configuration

```bash
# Interactive configuration
aicommit config

# Set specific options
aicommit config --provider anthropic
aicommit config --model claude-3-5-sonnet-20241022
aicommit config --api-key YOUR_API_KEY
```

## 🔑 Configuration

### Using .env file (Recommended)

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your OpenAI API key:
```bash
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4  # Optional, defaults to gpt-4
```

### Using CLI config

```bash
aicommit config --provider openai --api-key sk-...
aicommit config --model gpt-4
```

### Supported Models

- `gpt-4` (default, recommended)
- `gpt-4-turbo`
- `gpt-3.5-turbo` (faster, cheaper)

Note: The tool also supports Anthropic and Gemini providers. Check the code for implementation details.

## 📝 Conventional Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)

## 🎨 Gitmoji Support

Use the `--emoji` flag to add gitmojis to your commits:

```bash
aicommit g --emoji
```

Examples:
- ✨ feat: add new feature
- 🐛 fix: resolve bug
- 📝 docs: update readme

## ⚙️ Configuration

Configuration is stored in `~/.aicommit/config.json`:

```json
{
  "provider": "openai",
  "model": "gpt-4",
  "apiKey": "sk-..."
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

Built with [Claude](https://claude.ai) - AI assistant by Anthropic


