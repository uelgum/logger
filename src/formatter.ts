import { inspect } from "util";
import DateFormat from "fast-date-format";
import { colors, levels, levelColors } from "./constants";
import type { Level } from "./logger";

/**
    Formatter für Logs.
*/
class Formatter {
    // #region Attribute
    /**
        Zeitstempel-Generator.
    */
    private date: DateFormat;
    // #endregion

    /**
        Konstruktor von `Formatter`.
    */
    constructor(dateFormat: string) {
        this.date = new DateFormat(dateFormat);
    }

    /**
        Formatiert das Level.
    */
    private formatLevel(level: Level) {
        return levelColors[level] + level.padEnd(4) + colors.RESET + colors.WHITE;
    }

    /**
        Formatiert den Zeitstempel.
    */
    private formatTimestamp() {
        const timestamp = this.date.format();
        
        const format = (`{W}[{M}${timestamp}{W}]`)
            .replace(/{W}/g, colors.WHITE)
            .replace(/{M}/g, colors.MAGENTA);

        return format;
    }

    /**
        Formatiert einen Log für die Konsole.
    */
    public formatConsole(level: Level, message: unknown) {
        const formattedLevel = this.formatLevel(level);
        const timestamp = this.formatTimestamp();

        let format = (`${timestamp} ${formattedLevel} {G}-{W} `)
            .replace(/{G}/g, colors.GRAY)
            .replace(/{W}/g, colors.WHITE)
            .replace(/{R}/g, colors.RESET);

        // Error
        if(message instanceof Error) {
            const error = message;
            format += (error.message + colors.RESET);

            return {
                log: format,
                extra: error.stack
            };
        }

        // Objekt
        if(typeof message === "object" && message !== null) {
            const object = message;
            format += (object.constructor.name + colors.RESET);

            return {
                log: format,
                extra: inspect(object, true, 2, true)
            };
        }

        // String
        format += (message + colors.RESET);

        return {
            log: format,
            extra: null
        };
    }

    /**
        Formatiert einen Log im JSON-Format für die Log-Datei.
    */
    public formatJson(level: Level, message: unknown) {
        const timestamp = Date.now();

        const output = {
            level: levels[level],
            timestamp,
            msg: null
        };

        // Error
        if(message instanceof Error) {
            const error = message;

            Object.assign(output, {
                err: {
                    type: error.name,
                    stack: error.stack
                }
            });

            return JSON.stringify(output);
        }

        // Objekt
        if(typeof message === "object" && message !== null) {
            const object = message;
            Object.assign(output, object);

            return JSON.stringify(output);
        }

        // String
        Object.assign(output, { msg: message });
        return JSON.stringify(output);
    }
}

export default Formatter;