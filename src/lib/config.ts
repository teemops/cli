import fs from 'fs';
import path from 'path';
import IConfigData from '../types/IConfigData';

const TOPS_HOME_DIR = `${process.env.HOME || process.env.USERPROFILE}/.teemops/`;
const DEFAULT_CONFIG_PATH = path.join(TOPS_HOME_DIR, 'config.json');
const DEFAULT_APP_PATH = path.join(TOPS_HOME_DIR, 'apps/');
const DEFAULT_LOG_PATH = path.join(TOPS_HOME_DIR, 'logs/');


async function add(config: IConfigData) {
    try {
        if (!fs.existsSync(TOPS_HOME_DIR)) {
            fs.mkdirSync(TOPS_HOME_DIR, { recursive: true });
            console.log(`Created teemops home directory at ${TOPS_HOME_DIR}`);
        } else {
            console.log(`teemops home directory already exists at ${TOPS_HOME_DIR}`);
        }
        fs.writeFileSync(DEFAULT_CONFIG_PATH, JSON.stringify(config, null, 2));
        fs.chmodSync(DEFAULT_CONFIG_PATH, 0o600);
        console.log(`teemops.json created in ${DEFAULT_CONFIG_PATH}`);
    } catch (e) {
        throw e;
    }
}

async function getConfig() {
    try {
        if (!fs.existsSync(DEFAULT_CONFIG_PATH)) {
            return null;
        }
        const configData = fs.readFileSync(DEFAULT_CONFIG_PATH, 'utf8');
        return JSON.parse(configData);
    } catch (e) {
        throw e;
    }
}

export { add, getConfig, TOPS_HOME_DIR, DEFAULT_CONFIG_PATH, DEFAULT_APP_PATH, DEFAULT_LOG_PATH };
