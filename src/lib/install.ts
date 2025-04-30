import fs from 'fs';
import path from 'path';
import axios from 'axios';
import unzipper from  'unzipper';
import * as config from './config';
import IConfigData from '../types/IConfigData';
import { spawn } from 'child_process';

const TOPS_ZIP_FILE = 'teemops.zip';
const TOPS_DIR = 'teemops-master';
const INSTALL_EXIT_MESSAGES={
    INSTALL: 'install_completed',
    UPDATE: 'update_completed',
    UNINSTALL: 'uninstall_completed',
    QUIT: 'user_quit',
}

async function download(url: String, appPath=config.DEFAULT_APP_PATH) {
    try {

        if (!fs.existsSync(config.TOPS_HOME_DIR)) {
            fs.mkdirSync(config.TOPS_HOME_DIR, { recursive: true });
            console.log(`Created teemops home directory at ${config.TOPS_HOME_DIR}`);
        } else {
            console.log(`teemops home directory already exists at ${config.TOPS_HOME_DIR}`);
        }
        //download teemops repo from github and put in the appPath
        const zipDownload=`${url}/archive/refs/heads/master.zip`;
        const zipPath = path.join(appPath, TOPS_ZIP_FILE);
        const appDirExists = fs.existsSync(appPath);
        if (appDirExists) {
            console.log(`teemops app already exists at ${appPath}`);
        }
        if (!fs.existsSync(appPath)) {
            fs.mkdirSync(appPath, { recursive: true });
            console.log(`Created teemops app directory at ${appPath}`);
        }
        const getResponse = await axios.get(zipDownload, {responseType: 'arraybuffer'});
        const fileData = Buffer.from(getResponse.data, 'binary');
        fs.writeFileSync(zipPath, fileData);
        //unzip the file
        await unzip(zipPath, appPath);
        //delete the zip file
        fs.unlinkSync(zipPath);
        console.log(`Downloaded and extracted teemops app to ${appPath}`);
        //run the install.sh script
        const result = await run_install(appPath);
        if (result) {
            console.log(`teemops app installed successfully at ${appPath}`);
        }
        return result;

    } catch (e) {
        throw e;
    }
}

async function unzip(zipPath: string, appPath: string) {
    try {
        //get the OS's temp directory
        
        const directory = await unzipper.Open.file(zipPath);
        //unzip the file to the appPath
        await directory.extract({ path: appPath});
        console.log(`Unzipped teemops app to ${appPath}`);
        
    } catch (e) {
        console.error(`Error unzipping teemops app: ${e}`);
        throw e;
    }
}

async function run_install(appPath: string) {
    //run the install.sh script in the teemops app directory
    //check if the install.sh file exists
    try {
        return new Promise((resolve, reject) => {
            const installPath = path.join(appPath, TOPS_DIR, 'install.sh');
            if (fs.existsSync(installPath)) {
                
                //const installer=spawn('bash', [installPath], {stdio: 'inherit'});
                const installer=spawn('bash', [installPath]);
                installer.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);
                    //convert the data to string and check if it contains "success"
                    const dataString = data.toString();
                    if (dataString.includes('4')) {
                        console.log(`install.sh completed successfully`);
                        resolve(true);
                    }
                });
                
                installer.stderr.on('data', (data) => {
                    console.error(`stderr: ${data}`);
                });
                installer.on('close', (code: number) => {
                    if (code === 0) {
                        console.log(`install.sh completed successfully`);
                        resolve(true);
                    }
                    else {
                        console.error(`install.sh exited with code ${code}`);
                        reject(new Error(`install.sh exited with code ${code}`));
                    }
                });
            } else {
                console.error(`install.sh not found at ${installPath}`);
                reject(new Error(`install.sh not found at ${installPath}`));
            }
        });
    }
    catch (e) {
        console.error(`Error running install.sh: ${e}`);
        throw e;
    }
}

function pre_check() {
    //check if the teemops app directory exists

}

function copy_env() {
    //copy the .env.example file to .env
    const envPath = path.join(config.TOPS_HOME_DIR, '.env');
    const envExamplePath = path.join(config.TOPS_HOME_DIR, '.env.example');
    if (fs.existsSync(envPath)) {
        console.log(`.env file already exists at ${envPath}`);
        return;
    }
    if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        console.log(`Copied .env.example to .env at ${envPath}`);
    } else {
        console.error(`.env.example file not found at ${envExamplePath}`);
        throw new Error(`.env.example file not found at ${envExamplePath}`);
    }
}

function generate_secrets() {
    //generate secrets for the teemops app
    //check if the secrets.json file exists
    const secretsPath = path.join(config.TOPS_HOME_DIR, 'secrets.json');
    if (fs.existsSync(secretsPath)) {
        console.log(`secrets.json already exists at ${secretsPath}`);
        return;
    }
    //create the secrets.json file
    const secrets = {
        api_key: config.DEFAULT_API_KEY,
        api_secret: config.DEFAULT_API_SECRET,
        api_url: config.DEFAULT_API_URL,
        api_port: config.DEFAULT_API_PORT,
        api_version: config.DEFAULT_API_VERSION,
    };
    fs.writeFileSync(secretsPath, JSON.stringify(secrets, null, 4));
    console.log(`Created secrets.json at ${secretsPath}`);
}

export { download};
