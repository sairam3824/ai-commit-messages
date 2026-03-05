# Setup Guide

## Quick Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure OpenAI API Key:**
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

3. **Link the CLI globally (for development):**
```bash
npm link
```

4. **Test it:**
```bash
git add .
aicommit g --dry-run
```

## Usage

```bash
# Generate commit message
aicommit g

# Preview without committing
aicommit g --dry-run

# Force commit type
aicommit g --type feat

# Add emoji
aicommit g --emoji
```

## Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to your `.env` file

## Troubleshooting

**"API key not found" error:**
- Make sure `.env` file exists in the project root
- Check that `OPENAI_API_KEY` is set correctly
- No quotes needed around the key value

**"No staged changes" message:**
- Run `git add .` or `git add <files>` first
- Check `git status` to see staged files
