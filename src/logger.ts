import path from "path";
import fsr from "file-stream-rotator";
import Formatter from "./formatter";
import { levels } from "./constants";

// Types
import type { WriteStream } from "fs";

// #region Types
/**
    Level des Loggers.
*/
type Level = "DBG" | "INFO" | "WARN" | "ERR" | "FTL";

/**
    Optionen für den Logger.
*/
type Options = {
    /**
        Level des Loggers.
    */
    level: Level;

    /**
        Format des Zeitstempels.
        @default "HH:mm:ss"
    */
    dateFormat?: string;

    /**
        Pfad zu den Log-Dateien.
        @default null
    */
    logPath?: string;

    /**
        Ob Logs zusätzlich in Dateien geschrieben werden sollen.
        @default false
    */
    writeFile?: boolean;
};
// #endregion

/**
    Uelgum-Logger.
*/
class Logger {
    // #region Attribute
    /**
        Level des Loggers.
    */
    private level: number;

    /**
        Format des Zeitstempels.
    */
    private dateFormat: string;

    /**
        Pfad zu den Log-Dateien.
    */
    private logPath: string | null;

    /**
        Stream für Log-Dateien.
    */
    private stream: WriteStream | null;

    /**
        Formatter für Logs.
    */
    private formatter: Formatter;
    // #endregion

    /**
        Konstruktor von `Logger`.
    */
    constructor(options: Options) {
        this.level = levels[options.level];

        if (!this.level) {
            throw new Error(`Ungültiges Log-Level '${options.level}'`);
        }

        this.dateFormat = options.dateFormat || "HH:mm:ss";

        this.logPath = options.logPath || null;
        this.stream = (options.writeFile) ? this.createStream() : null;

        this.formatter = new Formatter(this.dateFormat);
    }

    /**
        Erstellt einen Stream für Log-Dateien.
    */
    private createStream() {
        return fsr.getStream({
            filename: path.join(this.logPath!, "log_%DATE%"),
            extension: ".log",
            frequency: "custom",
            date_format: "YYMMDD",
            verbose: false
        });
    }

    /**
        Schreibt einen Log in die Konsole.
    */
    private writeConsole(level: Level, message: unknown) {
        const { log, extra } = this.formatter.formatConsole(level, message);

        console.log(log);

        if(extra) {
            console.log(`\n${extra}\n`);
        }
    }

    /**
        Schreibt einen Log im JSON-Format in die Log-Datei.
    */
    private writeStream(level: Level, message: unknown) {
        const output = this.formatter.formatJson(level, message);
        this.stream?.write(output + "\n");
    }

    /**
        Schreibt einen Log in die Konsole und den Stream für Log-Dateien,
        falls vorhanden.
    */
    private write(level: Level, message: unknown) {
        if(levels[level] < this.level) return;

        // Konsole
        this.writeConsole(level, message);

        // Log-Datei
        if(this.stream) {
            this.writeStream(level, message);
        }
    }

    /**
        Erstellt einen Debug-Log (`DBG`).
    */
    public debug(message: unknown) {
        this.write("DBG", message);
    }

    /**
        Erstellt einen Info-Log (`INFO`).
    */
    public info(message: unknown) {
        this.write("INFO", message);
    }

    /**
        Erstellt einen Warn-Log (`WARN`).
    */
    public warn(message: unknown) {
        this.write("WARN", message);
    }

    /**
        Erstellt einen Error-Log (`ERR`).
    */
    public error(message: unknown) {
        this.write("ERR", message);
    }

    /**
        Erstellt einen Fatal-Log (`FTL`).
    */
    public fatal(message: unknown) {
        this.write("FTL", message);
    }
}

export type {
    Options,
    Level
};

export default Logger;