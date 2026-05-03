#!/bin/bash
# Post-create script for GitHub Codespaces
# Writes the FACEIT_API_KEY codespace secret into the .env file

set -e

ENV_FILE="$(dirname "$0")/../.env"

if [ -n "$FACEIT_API_KEY" ]; then
	echo "FACEIT_API_KEY=\"${FACEIT_API_KEY}\"" > "$ENV_FILE"
	echo "✅ .env file created with FACEIT_API_KEY from Codespaces secret."
else
	echo "⚠️  FACEIT_API_KEY secret is not set. Creating .env from .env.example."
	if cp "$(dirname "$0")/../.env.example" "$ENV_FILE"; then
		echo "ℹ️  Copied .env.example to .env — remember to set FACEIT_API_KEY."
	else
		echo "⚠️  .env.example not found. Creating empty .env."
		echo "FACEIT_API_KEY=" > "$ENV_FILE"
	fi
fi
