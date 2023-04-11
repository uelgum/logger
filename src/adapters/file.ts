import os from "os";
import path from "path";
import { getStream as createStream } from "file-stream-rotator";

// Intern
import Adapter from "../adapter";

// Types
import type { Log } from "../logger";

// #region Types
/**
    Stream aus `file-stream-rotator`.
*/
type Stream = ReturnType<typeof createStream>;

/**
    Optionen.
*/
type Options = {
    /**
        Pfad zum Logs-Ordner.
    */
    path: string;
};

/**
    Output.
*/
type Output = {
    /**
        Sonstige Daten.
    */
    [ key: string ]: any;

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
    msg?: string;
};
// #endregion

/**
	Adapter für Log-Dateien.
*/
class FileAdapter extends Adapter {
    // #region Attribute
    /**
        Stream aus `file-stream-rotator`.
    */
    private _stream: Stream;
    // #endregion

    constructor(options: Options) {
        super();

        this._stream = createStream({
            filename: path.join(options.path, "%DATE%"),
            frequency: "daily",
            date_format: "YYYY-MM-DD",
            size: "10K",
            audit_file: path.join(os.tmpdir(), "audit.json"),
            extension: ".log"
        });
    }

    /**
        Formatiert den Error-Stack.
    */
    private _formatErrorStack(stack: string) {
        return stack
            .split("\n")
            .slice(1)
            .join("\n");
    }

    /**
        Führt den Adapter aus.
    */
    public write(log: Log) {
        const output: Output = {
            level: log.level,
            timestamp: log.timestamp
        };

        if(log.data instanceof Error) {
            const error = log.data;

            output.msg = error.message;

            if(error.stack) {
                output.stack = this._formatErrorStack(error.stack);
            }
        } else if (typeof log.data === "object" && log.data !== null) {
            Object.assign(output, log.data);
        } else {
            output.msg = log.data;
        }

        this._stream.write(JSON.stringify(output) + "\n", "utf-8");
    }
};

export default FileAdapter;
