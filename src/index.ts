#! /usr/bin/env node

import { Command } from 'commander';
import config from './config';
import { yellow, red, green } from './utils/colors';
import apiCommand from './actions/api';
import anyCommand from './actions/any';
const program = new Command();

async function run() {
    const anyCommand = new Command()
    var postman = await require('./reference/Teemops.postman_collection.json');

    anyCommand
        .name('any')
        .description('Query any teemops dataset')
    // .option('-t, --task <task>', 'Task to add')
    // .option('-p, --priority <priority>', 'Priority level of task')
    // .action(async (options) => {
    //     console.log(yellow(postman.info._postman_id));
    //     //console.log(yellow(JSON.stringify(postman.item)));
    // });
    var paths = [] as Array<any>;
    postman.item.forEach(async (item: any) => {
        const path = item.request.url.path[0];
        if (paths.indexOf(path) === -1) {
            paths.push(path);
            anyCommand.addCommand(new Command(path)
                .description('Query ' + path)
                .action(async (options) => {
                    console.log(yellow(path));
                })
            )
        }
    });

    return anyCommand;
}

async function main() {
    program
        .version(config.version)
        .description(config.description)
        .option('-v, --version', 'output the current version')
        .option('-h, --help', 'output usage information')
        // .action(run);
        .addCommand(await run())
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
