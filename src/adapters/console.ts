import { inspect } from "node:util";

// Intern
import { Level } from "../logger";

// Types
import type { Adapter, Log } from "../logger";

/**
    Länge des längsten Levels.
*/
const LEVEL_PAD = 5;

/**
    Einrückung von Objekt-Attributen.
*/
const OBJECT_PROPERTY_INDENT = 4;

/**
    ANSI-Farbcodes.
*/
const enum Color {
    RESET = "\u001b[0m",
    GRAY = "\u001b[90m",
    RED = "\u001b[91m",
    GREEN = "\u001b[92m",
    YELLOW = "\u001b[93m",
    BLUE = "\u001b[94m",
    MAGENTA = "\u001b[95m",
};

/**
    Konsolen-Adapter.
*/
export class ConsoleAdapter implements Adapter {
    // #region Attribute
    /**
        Formatierer f+r Zeitstempel.
    */
    private _timeFormatter: Intl.DateTimeFormat;
    // #endregion

    /**
        Konstruktor.
    */
    constructor() {
        this._timeFormatter = new Intl.DateTimeFormat("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }

    /**
        Formatiert den Zeitstempel eines Logs.
    */
    private _formatTimestamp(date: Date) {
        return (
            "[" +
            Color.MAGENTA +
            this._timeFormatter.format(date) +
            Color.RESET +
            "] "
        );
    }

    /**
        Formatiert das Level eines Logs.
    */
    private _formatLevel(level: Level) {
        let levelName: string;
        let levelColor: Color;

        switch(level) {
            // Debug
            case Level.DEBUG: {
                levelName = "debug";
                levelColor = Color.BLUE;
                break;
            }

            // Info
            case Level.INFO: {
                levelName = "info";
                levelColor = Color.GREEN;
                break;
            }

            // Warn
            case Level.WARN: {
                levelName = "warn";
                levelColor = Color.YELLOW;
                break;
            }

            // Error
            case Level.ERROR: {
                levelName = "error";
                levelColor = Color.RED;
                break;
            }

            // Fatal
            case Level.FATAL: {
                levelName = "fatal";
                levelColor = Color.RED;
                break;
            }
        }

        return (
            levelColor +
            levelName.padEnd(LEVEL_PAD) +
            Color.GRAY +
            " › " +
            Color.RESET
        );
    }

    /**
        Formatiert ein `Error`-Objekt.
    */
    private _formatError(error: Error) {
        let output = error.message;

        if(error.stack) {
            const stack = error.stack
                .split("\n")
                .slice(1)
                .join("\n");

            output += (
                "\n" +
                Color.GRAY +
                stack +
                Color.RESET
            );
        }

        return output;
    }

    /**
        Formatiert ein Objekt.
    */
    private _formatObject(object: Object) {
        const inspection = inspect(object, false, null, true)
            .split("\n")
            .map((line) => line.padStart(line.length + OBJECT_PROPERTY_INDENT))
            .join("\n");

        return (
            object.constructor.name + 
            "\n" +
            inspection
        );
    }

    /**
        Führt den Adapter aus. Druckt den Log in die Konsole aus.
    */
    public write(log: Log) {
        let output =
            this._formatTimestamp(log.timestamp) +
            this._formatLevel(log.level);

        if(log.data instanceof Error) {
            output += this._formatError(log.data);
        } else if(typeof log.data === "object" && log.data !== null) {
            output += this._formatObject(log.data);
        } else {
            output += log.data;
        }

        process.stdout.write(output + "\n");
    }
};