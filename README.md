# playwright-chrome-recorder



This repo provides tools to export P Tests from [Google Chrome DevTools' Recordings](https://goo.gle/devtools-recorder) programmatically.

## Prerequisites

In order to export JSON files from Chrome DevTools Recorder you will need to be on Chrome 101 or newer.

`dblClick` and `rightclick` require Chrome 103 or newer.

## Installation

```sh
$ npm install -g playwright-chrome-recorder
```

## Usage

### Via CLI

To use the interactive CLI, run:

```sh
$ npx playwright-chrome-recorder
```

The CLI will prompt you to enter the path of the directory or file that you would like to modify as well as a path to write the generated playwright tests to.

If you prefer to enter paths via the CLI, you can run the following command to export individual recordings:

```sh
$ npx playwright-chrome-recorder <relative path to target test file>
```

or for folders containing multiple recordings:

```sh
$ npx playwright-chrome-recorder <relative path to target test folder>/*.json
```

By default the output will be written to a `playwright` folder in the current working directory.

If you prefer a different output directory, specify that via CLI:

```sh
$ npx playwright-chrome-recorder <relative path to target test folder>/*.json --output=folder-name
```

or via the interactive CLI prompts.

### CLI Options

| Option       | Description                                               |
| ------------ | --------------------------------------------------------- |
| -f, --force  | Bypass Git safety checks and force exporter to run        |
| -d, --dry    | Dry run (no changes are made to files)                    |
| -o, --output | Output location of the files generated by the exporter    |
| -p, --print  | Print transformed files to stdout, useful for development |

### Via Import

```js
import { playwrightStringifyChromeRecording } from 'playwright-chrome-recorder';

const stringifiedContent = await playwrightStringifyChromeRecording(
  recordingContent
);

return stringifiedContent;
```

## Supported Chrome Recorder Step Types

Below are the step types that are currently supported:

| Type                | Description                                   |
| ------------------- | --------------------------------------------- |
| change              | becomes **page.locator("_element_").type("text")**  |
| click               | becomes **page.locator("_element_").click();**      |
| click (right click) | becomes **page.locator("_element_").click({ button: 'right' });** |
| doubleClick         | becomes **page.locator("_element_").dblclick();**   |
| hover               | becomes **page.locator("_element_").hover();**    |
| keyDown             | becomes **page.keyboard.down("{key}")**                  |
| keyUp               | _not exported at this time_                   |
| navigate            | becomes **await page.goto("url")**                   |
| setViewport         | becomes **await page.setViewportSize({ width, height })**        |
| scroll              | becomes **await page.mouse.wheel(x, y)** |


If a step type is not listed above, then a warning message should be displayed in the CLI.

## License

This project is licensed under the terms of the [MIT license](/LICENSE).