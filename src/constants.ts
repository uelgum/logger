/**
    Log-Level für den Logger.
*/
const levels = {
    DBG: 1,
    INFO: 2,
    WARN: 3,
    ERR: 4,
    FTL: 5
};

/**
    Farben für den Logger.
*/
const colors = {
    RESET: "\x1b[0m",
    GRAY: "\x1b[90m",
    RED: "\x1b[91m",
    RED_BG: "\x1b[41;1m",
    GREEN: "\x1b[92m",
    YELLOW: "\x1b[93m",
    MAGENTA: "\x1b[95m",
    CYAN: "\x1b[96m",
    WHITE: "\x1b[97m"
};

/**
    Farben der Level.
*/
const levelColors = {
    DBG: colors.CYAN,
    INFO: colors.GREEN,
    WARN: colors.YELLOW,
    ERR: colors.RED,
    FTL: colors.RED_BG
};

export {
    levels,
    colors,
    levelColors
};