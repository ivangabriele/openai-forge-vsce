<p align="center">
  <img alt="OpenAI Forge Logo" height="128" src="assets/icons/x512.png" />
  <h1 align="center">OpenAI Forge</h1>
</p>

<p align="center">
  <a href="https://github.com/ivangabriele/openai-forge-vsce/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/ivangabriele/openai-forge-vsce?style=for-the-badge" alt="AGPL License">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=ivangabriele.openai-forge">
    <img src="https://img.shields.io/visual-studio-marketplace/i/ivangabriele.openai-forge?style=for-the-badge" alt="Visual Studio Marketplace">
  </a>
  <a href="https://github.com/ivangabriele/openai-forge-vsce/actions?query=check">
    <img src="https://img.shields.io/github/actions/workflow/status/ivangabriele/openai-forge-vsce/check.yml?label=Tests&amp;style=for-the-badge" alt="Check Workflow Status">
  </a>
</p>

<p align="center"><b>Automate your communication between Visual Studio Code and ChatGPT 🤖.</b></p>

---

## Screencast


<video src="https://github-production-user-asset-6210df.s3.amazonaws.com/5957876/253832578-fbb5ba36-a9b5-4251-868c-0fa6ef1676b5.mp4" width="100%"></video>

https://github.com/ivangabriele/openai-forge-vsce/assets/5957876/fbb5ba36-a9b5-4251-868c-0fa6ef1676b5

## Getting Started

Check the [WELCOME](docs/WELCOME.md) document to get started.

## How it works?

OpenAI Forge VSCode extension runs a WebSocket server while the OpenAI Forge browser extension runs a WebSocket client
when you have `https://chat.openai.com` open in your browser. That's how VSCode can communicate with ChatGPT web
application to automatically fill the prompt and submit it.

As for the errors, OpenAI Forge VSCode extension runs an **Evaluator**_**, that is a CLI command able to output errors
while attempting to compile or lint your code. This _evaluator_ command is run in a child process, its `stderr` output
is extracted and embedded along your selected documents source code, before being sent to ChatGPT prompt, along with
your document source code.

## Features

Directly from Visual Studio Code, you can:

- [x] Send all the source code of one or multiple documents at once
- [x] Send evaluation errors to ask ChatGPT for fixes
- [x] Add a custom message to the generated prompt request (or don't)

### ChatGPT Prompt Contextualization

OpenAI Forge add some contextual information to the automated prompt message in order to help improve ChatGPT accuracy:

- [x] Source code documents paths
- [x] Some workspace information "guessed" from you files path and extensions _(can be disabled in settings)_

## Current limitations

_In progress..._

## Known issues

_In progress..._
