<p align="center">
  <img alt="OpenAI Forge Logo" height="128" src="assets/icons/icon.svg" />
  <img alt="OpenAI Forge Header" width="100%" src="assets/docs/readme-header.svg" />
</p>

<p align="center">
  <a href="https://github.com/ivangabriele/openai-forge-vsce/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ivangabriele/openai-forge-vsce?style=for-the-badge" alt="AGPL License">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=ivangabriele.openai-forge-vsce">
    <img src="https://img.shields.io/visual-studio-marketplace/i/ivangabriele.openai-forge?style=for-the-badge" alt="Visual Studio Marketplace">
  </a>
  <a href="https://github.com/ivangabriele/openai-forge-vsce/actions?query=check">
    <img src="https://img.shields.io/github/actions/workflow/status/ivangabriele/openai-forge-vsce/check.yml?label=Tests&amp;style=for-the-badge" alt="Check Workflow Status">
  </a>
</p>

<p align="center"><b>Automate your communication between Visual Studio Code and ChatGPT 🤖.</b></p>

---

## Screencast

https://github.com/ivangabriele/openai-forge-vsce/assets/5957876/fbb5ba36-a9b5-4251-868c-0fa6ef1676b5

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
