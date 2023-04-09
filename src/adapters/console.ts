import { inspect } from "util";

// Intern
import Adapter from "../adapter";
import levels from "../levels";

// Types
import type { Log } from "../logger";

/**
    Farben.
*/
const colors = {
    RESET: "\u001b[0m",
    GRAY: "\u001b[90m",
    RED: "\u001b[91m",
    GREEN: "\u001b[92m",
    YELLOW: "\u001b[93m",
    BLUE: "\u001b[94m",
    MAGENTA: "\u001b[95m",
};

/**
    Adapter für die Konsole.
*/
class ConsoleAdapter extends Adapter {
    // #region Attribute
    /**
        Formatierer für Zeitstempel. 
    */
    private _timeFormatter: Intl.DateTimeFormat;

    /**
        Länge des längsten Levels.
    */
    private _levelPad: number;
    // #endregion

    /**
        Konstruktor.
    */
    constructor() {
        super();

        this._timeFormatter = new Intl.DateTimeFormat("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        this._levelPad = Math.max(
            ...Object.keys(levels).map((level) => level.length)
        );
    }

    /**
        Formatiert den Zeitstempel.
    */
    private _timestamp(timestamp: number) {
        return `[${colors.MAGENTA}${this._timeFormatter.format(timestamp)}${colors.RESET}] `;
    }

    /**
        Formatiert das Level.
    */
    private _level(level: number) {
        let levelName = "";
        let levelColor = "";

        switch(level) {
            // Debug
            case levels.DEBUG:
                levelName = "debug";
                levelColor = colors.BLUE;
                break;

            // Info
            case levels.INFO:
                levelName = "info";
                levelColor = colors.GREEN;
                break;

            // Warnung
            case levels.WARN:
                levelName = "warn";
                levelColor = colors.YELLOW;
                break;

            // Error
            case levels.ERROR:
                levelName = "error";
                levelColor = colors.RED;
                break;

            // Fatal
            case levels.FATAL:
                levelName = "fatal";
                levelColor = colors.RED;
                break;
        }

        return `${levelColor}${levelName.padEnd(this._levelPad)}${colors.GRAY} › ${colors.RESET}`;
    }

    /**
        Formatiert ein `Error`-Objekt.
    */
    private _error(error: Error) {
        let output = error.message;

        if(error.stack) {
            const stack = error.stack
                .split("\n")
                .slice(1)
                .join("\n");

            output += `\n${colors.GRAY}${stack}${colors.RESET}`; 
        }

        return output;
    }


    /**
        Formatiert ein Objekt.
    */
    private _object(object: Object) {
        let output = `${object.constructor.name}\n`;

        const inspection = inspect(object, false, null, false)
            .split("\n")
            .map((line) => " ".repeat(4) + line)
            .join("\n");

        output += `${colors.GRAY}${inspection}${colors.RESET}`;

        return output;
    }

    /**
        Führt den Adapter aus.
    */
    public write(log: Log) {
        let output = this._timestamp(log.timestamp) + this._level(log.level);

        if(log.data instanceof Error) {
            output += this._error(log.data);
        } else if(typeof log.data === "object" && log.data !== null) {
            output += this._object(log.data);
        } else {
            output += log.data;
        }

        process.stdout.write(output + "\n");
    }
};

export default ConsoleAdapter;