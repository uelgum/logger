# `@uelgum/logger`
Proprietärer Logger für Node.js.

> ⚠️ Dieses Projekt wird nicht mehr unterstützt.

## Übersicht
- [Installation](#installation)
- [Benutzung](#benutzung)
- [Lizenz](#lizenz)

## Installation
```sh-session
$ npm install uelgum/logger
```

## Benutzung
```ts
import {
    Logger,
    ConsoleAdapter
} from "@uelgum/logger";

const logger = new Logger({
    adapters: [
        new ConsoleAdapter()
    ]
});

logger.info("Hallo Welt!");
```

## Lizenz
[![license](https://img.shields.io/badge/Lizenz-GPL--3.0-brightgreen?style=flat-square)](./LICENSE)