import type { Log } from "./logger";

/**
    Adapter.
*/
abstract class Adapter {
    /**
        Führt den Adapter aus.
    */
    public abstract write(log: Log): Promise<void> | void;
};

export default Adapter;