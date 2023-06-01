import fs from "node:fs";
import path from "node:path";

// Intern
import { Level } from "../logger";

// Types
import type { WriteStream } from "node:fs";
import type { Adapter, Log } from "../logger";

// #region Types
/**
    Output des Adapters.
*/
type Output = {
    /**
        Sonstige Werte.
    */
    [ key: string ]: any;

    /**
        Level.
    */
    level: Level;

    /**
        Zeitstempel.
    */
    timestamp: Date;

    /**
        Auszugebende Daten.
    */
    data?: any;
};
// #endregion

/**
    Datei-Adapter.
*/
export class FileAdapater implements Adapter {
    // #region Attribute
    /**
        Pfad zu den Log-Dateien.
    */
    private _logPath: string;

    /**
        Aktuelles Datum.
    */
    private _date: Date;

    /**
        Datei-Stream.
    */
    private _stream: WriteStream;
    // #endregion

    /**
        Konstruktor.
    */
    constructor(logPath: string) {
        this._logPath = logPath;
        this._date = new Date();
        this._stream = this._createStream();
    }

    /**
        Fügt eine Null an den Anfang von einstelligen Zahlen
        hinzu.
    */
    private _padNumber(value: number) {
        return (value < 10) ? `0${value}` : `${value}`;
    }
    
    /**
        Erstellt einen Datei-Stream.
    */
    private _createStream() {
        try {
            fs.accessSync(this._logPath, fs.constants.F_OK);
        } catch(error) {
            fs.mkdirSync(this._logPath, {
                mode: 0o744,
                recursive: true
            });
        }

        const year = this._date.getFullYear();
        const month = this._date.getMonth() + 1;
        const day = this._date.getDate();

        const filename =
            year +
            this._padNumber(month) +
            this._padNumber(day) +
            ".log";

        const filePath = path.join(this._logPath, filename);

        return fs.createWriteStream(filePath, {
            encoding: "utf-8",
            flags: "a"
        });
    }

    /**
        Öffnet einen neuen Datei-Stream und schließt den alten.
    */
    private _rotateStream() {
        this._stream.close();
        
        this._date = new Date();
        this._stream = this._createStream();
    }

    /**
        Überprüft, ob ein neuer Tag begonnen hat.
    */
    private _isNewDay() {
        const now = new Date();

        return (
            now.getDate() > this._date.getDate() ||
            now.getMonth() + 1 > this._date.getMonth() + 1 ||
            now.getFullYear() > this._date.getFullYear()
        );
    }

    /**
        Formatiert den Error-Stack eines Logs.
    */
    private _formatErrorStack(stack: string) {
        return stack
            .split("\n")
            .slice(1)
            .join("\n");
    }

    /**
        Führt den Adapter aus. Schreibt den Log in eine Log-Datei.
    */
    public write(log: Log) {
        if(this._isNewDay()) {
            this._rotateStream();
        }
        
        const output: Output = {
            level: log.level,
            timestamp: log.timestamp
        };

        if(log.data instanceof Error) {
            const error = log.data;

            output.data = error.message;
            output.stack = (error.stack) ?
                this._formatErrorStack(error.stack) :
                null;
        } else if(typeof log.data === "object" && log.data !== null) {
            Object.assign(output, log.data);
        } else {
            output.data = log.data;
        }

        this._stream.write(
            JSON.stringify(output) + "\n",
            "utf-8"
        );
    }
};