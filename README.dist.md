<p align="center">
  <img alt="OpenAI Forge Logo" height="128" src="assets/icons/x512.png" />
    <h3 align="center">OpenAI Forge</h3>
    <p align="center"><b>Visual Studio Code Extension</b></p>
</p>

---

**OpenAI Forge automates your communication between Visual Studio Code and ChatGPT 🤖.**

## Screencast

<video src="https://github.com/ivangabriele/openai-forge-vsce/assets/5957876/fbb5ba36-a9b5-4251-868c-0fa6ef1676b5" width="100%"></video>

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