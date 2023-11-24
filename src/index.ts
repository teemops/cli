#! /usr/bin/env node

import { Command } from 'commander';
import config from './config';
import run from './actions/run';
import actions from './actions/index';
import { yellow, red, green, blue, lightBlue, cyan, magenta, orange } from './utils/colors';

const program = new Command();

interface apiRequest {
    name: string,
    path: string,
    method: string,
    fields?: Array<any>
}


async function main() {
    program
        .version(magenta(config.version))
        .description(lightBlue(config.description))
        .option('-v, --version', magenta('output the current version'))
        .option('-h, --help', yellow('output usage information'))
        // .action(run);
        .addCommand(await actions['users']())
    // .addCommand(await anyCommand())

    await program.parseAsync(process.argv);
}

//run main as await async function
main().catch((e) => {
    console.log(red(e));
    process.exit(1);
}).then(() => {
    // console.log(green(result));
    process.exit(0);
});
