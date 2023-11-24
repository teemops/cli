# Teemops CLI

## Installation

```bash
npm install -g teemops
```

## Usage

```bash
teemops --help
```

## Commands

### `teemops init`

### Development

Run npm install

    ```bash
    npm install
    ```

When running locally you can use

    ```bash
    npm run dev
    ```

When passing arguments e.g '-e myemail@example.com' you need to include '--' so that npm ignores the arguments and passes them to the script.

    ```bash
    npm run dev -- users register -e myemail@example.com
    ```

If developing locally you can run the following command to link the local version of the CLI to your global npm modules.

```bash
npm link
```
