import path from 'path';

import { Command, Option } from 'commander';
import { prompt } from 'enquirer';
import { orange } from './../utils/colors';
import settings from '../settings';
import { download } from '../lib/install';
import {DEFAULT_APP_PATH} from '../lib/config';
const IConfigData = require('../types/IConfigData');

async function install(filter = 'install') {

    try {
        const initCommand = new Command()
        initCommand
            .name(filter)
            .description(orange(`teemops ${filter}`));

        initCommand.action(async (options) => {
            
            // //use a list of options instead of an input for apiUrl
            // const response = await prompt({
            //     type: 'select',
            //     name: 'type',
            //     message: 'Installation Type',
            //     choices: [
            //         'Development',
            //         'Production',
            //     ],
            //     initial: 0,
            // }) as any;

            await download(settings.git_url, DEFAULT_APP_PATH);

            console.log(orange(`teemops ${filter} completed`));
 
            
        });

        return initCommand;
    } catch (e) {
        throw e;
    }

}

export default install;