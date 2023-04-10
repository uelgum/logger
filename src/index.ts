import Logger from "./logger";
import levels from "./levels";
import Adapter from "./adapter";
import ConsoleAdapter from "./adapters/console";

// Types
import type { Level } from "./levels";
import type { Log, Options } from "./logger";

export {
    levels,
    Adapter,
    ConsoleAdapter
};

export type {
    Options,
    Level,
    Log
};

export default Logger;