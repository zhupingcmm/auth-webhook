import pkg from 'log4js';
import path from 'path';
const { configure, getLogger } = pkg;

export const initLog = () => {
    const CMD = process.cwd();
    const configFile = path.join(CMD, "config", "log", "log4j.json");
    configure(configFile);
};

export const logFactory =(category: string) => {
    return getLogger(category);
}
  