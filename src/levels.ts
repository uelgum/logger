// #region Types
/**
    Log-Level.
*/
type Level = keyof typeof levels;
// #endregion

/**
    Log-Level.
*/
const levels = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
};

export type {
    Level
};

export default levels;