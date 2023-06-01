// #region Types
/**
    Optionen für den Logger.
*/
export type LoggerOptions = {
    /**
        Log-Level.
    */
    level?: Level;

    /**
        Liste von Adaptern.
    */
    adapters?: Adapter[];
};

/**
    Log.
*/
export type Log = {
    /**
        Log-Level.
    */
    level: Level;

    /**
        Zeitstempel.
    */
    timestamp: Date;

    /**
        Auszugebende Daten.
    */
    data: any;
};

/**
    Adapter.
*/
export interface Adapter {
    /**
        Führt den Adapter aus.
    */
    write(log: Log): Promise<void> | void;
};
// #endregion

/**
    Log-Level.
*/
export enum Level {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
};

/**
    Logger.
*/
export class Logger {
    // #region Attribute
    /**
        Liste von Adaptern.
    */
    private _adapters: Adapter[];

    /**
        Log-Level.
    */
    public readonly level: Level;
    // #endregion

    /**
        Konstruktor.
    */
    constructor(options: LoggerOptions) {
        this._adapters = options.adapters || [];
        this.level = options.level || Level.INFO;
    }

    /**
        Führt alle Adapter aus.
    */
    private _write(level: Level, data: any) {
        if(level < this.level) {
            return;
        }

        const log: Log = {
            level,
            timestamp: new Date(),
            data
        };

        for(const adapter of this._adapters) {
            adapter.write(log);
        }
    }

    /**
        Gibt einen `debug`-Log aus.
    */
    public debug(data: any) {
        this._write(Level.DEBUG, data);
    }

    /**
        Gibt einen `info`-Log aus.
    */
    public info(data: any) {
        this._write(Level.INFO, data);
    }

    /**
        Gibt einen `warn`-Log aus.
    */
    public warn(data: any) {
        this._write(Level.WARN, data);
    }

    /**
        Gibt einen `error`-Log aus.
    */
    public error(data: any) {
        this._write(Level.ERROR, data);
    }

    /**
        Gibt einen `fatal`-Log aus.
    */
    public fatal(data: any) {
        this._write(Level.FATAL, data);
    }
};