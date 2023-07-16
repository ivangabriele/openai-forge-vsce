<p align="center">
  <img alt="OpenAI Forge Logo" height="128" src="assets/icons/x512.png" />
  <hgroup>
    <p align="center" style="color: #e52b50; font-size: 250%; linee-height: 0; margin-bottom: 0">OpenAI Forge</p>
    <p align="center" style="font-size: 125%">Visual Studio Code Extension</p>
  </hgroup>
</p>

---

> OpenAI Forge automates your communication between Visual Studio Code and ChatGPT 🤖.

## Requirements

**YOU MUST INSTALL OpenAI Forge Browser Extension or this extension can't work.**

The communication with ChatGPT is done through the Browser Extension, via WebSocket.

## Features

Directly from Visual Studio Code, you can:

- [x] Send all the source code of one or multiple documents at once
- [x] Send evaluation errors to ask ChatGPT for fixes
  - [x] Rust
- [x] Add a custom message to the generated prompt request (or don't)

### Bonus (for a better ChatGPT contextualization)

- [x] Automatically include documents relative in prompt
- [x] Automatically "guess" and include some project information in the prompt header (can be disabled in settings)
