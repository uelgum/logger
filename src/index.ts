import Logger from "./logger";
import levels from "./levels";
import Adapter from "./adapter";
import ConsoleAdapter from "./adapters/console";
import FileAdapter from "./adapters/file";

// Types
import type { Level } from "./levels";
import type { Log, Options } from "./logger";

export {
    levels,
    Adapter,
    ConsoleAdapter,
    FileAdapter
};

export type {
    Options,
    Level,
    Log
};

export default Logger;