import levels from "./levels";
import ConsoleAdapter from "./adapters/console";

// Types
import type Adapter from "./adapter";
import type { Level } from "./levels";

// #region Types
/**
    Optionen.
*/
type Options = {
    /**
        Liste von zu hinzufügenden Adaptern.
    */
    adapters?: Adapter[];

    /**
        Log-Level.
    */
    level?: Level;
};

/**
    Log.
*/
type Log = {
    /**
        Log-Level.
    */
    level: number;

    /**
        Zeitpunkt, an dem der Log erstellt wurde.
    */
    timestamp: number;

    /**
        Vom Nutzer übergebenen Daten.
    */
    data: any;
};
// #endregion

/**
    Uelgum-Logger.    
*/
class Logger {
    // #region Attribute
    /**
        Liste von Adaptern.
    */
    private _adapters: Adapter[];

    /**
        Log-Level.
    */
    private _level: number;
    // #endregion

    /**
        Konstruktor.
    */
    constructor(options?: Options) {
        this._adapters = (options?.adapters) ?
            options.adapters :
            [ new ConsoleAdapter() ];
    
        this._level = (options?.level) ? levels[options.level] : levels.INFO;
    }

    /**
        Erstellt einen Log und gibt diesen an alle Adapter weiter.
    */
    private _write(level: number, data: any) {
        if(level < this._level) return;
        
        const log: Log = {
            level,
            timestamp: Date.now(),
            data
        };

        for(const adapter of this._adapters) {
            adapter.write(log);
        }
    }

    /**
        Log-Level.
    */
    public get level() {
        return this._level;
    }

    /**
        Erstellt einen `debug`-Log.
    */
    public debug(message: any) {
        this._write(levels.DEBUG, message);
    }

    /**
        Erstellt einen `info`-Log.
    */
    public info(message: any) {
        this._write(levels.INFO, message);
    }

    /**
        Erstellt einen `warn`-Log.
    */
    public warn(message: any) {
        this._write(levels.WARN, message);
    }

    /**
        Erstellt einen `error`-Log.
    */
    public error(message: any) {
        this._write(levels.ERROR, message);
    }

    /**
        Erstellt einen `fatal`-Log.
    */
    public fatal(message: any) {
        this._write(levels.FATAL, message);
    }
};

export type {
    Options,
    Log
};

export default Logger;