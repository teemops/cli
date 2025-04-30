import path from 'path';

import { Command, Option } from 'commander';
import { prompt } from 'enquirer';
import { orange } from './../utils/colors';
const config = require('../lib/config');
//const IConfigData = require('../types/IConfigData');

const DEFAULT_CONFIG = {
    apiUrl: 'https://api.teem.cloud',
    timeout: 5000,
};

async function init(filter = 'init') {

    try {
        var configData;
        const initCommand = new Command()
        initCommand
            .name(filter)
            .description(orange(`teemops ${filter}`));

        initCommand.action(async (options) => {
            
            if (config.getConfig()) {
  
                //prompt user to overwrite
                const overwrite = await prompt({
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'teemops.json already exists. Do you want to overwrite it?',
                    initial: false,
                });
                if (!overwrite) {
                    throw new Error('teemops init cancelled');
                }
            }

            //use a list of options instead of an input for apiUrl
            const response = await prompt({
                type: 'select',
                name: 'apiUrl',
                message: 'API URL',
                choices: [
                    'https://api.teem.cloud',
                    'http://localhost:8080',
                    'Custom',
                ],
                initial: 0,
            }) as any;
            
            //if other is selected, prompt for input
            if (response.apiUrl === 'Other') {
                const otherResponse = await prompt({
                    type: 'input',
                    name: 'apiUrl',
                    message: 'API URL',
                    initial: DEFAULT_CONFIG.apiUrl,
                });
                configData = {
                    ...DEFAULT_CONFIG,
                    ...otherResponse,
                };
            }else{
                configData = {
                    ...DEFAULT_CONFIG,
                    ...response,
                };
            }
            await config.add(configData);
        });

        return initCommand;
    } catch (e) {
        throw e;
    }

}

export default init;