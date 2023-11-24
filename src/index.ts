#! /usr/bin/env node

import { Command } from 'commander';
import config from './config';
import axios from 'axios';
const log = console.log;
import { yellow, red, green, blue, lightBlue, cyan, magenta, orange } from './utils/colors';
import apiCommand from './actions/api';
import anyCommand from './actions/any';
import { Console } from 'console';
const program = new Command();

interface apiRequest {
    path: string,
    method: string,
    fields?: Array<any>
}

async function run() {

    try {
        const anyCommand = new Command()
        var postman = await require('./reference/Teemops.postman_collection.json');

        anyCommand
            .name('any')
            .description(orange('Query any teemops dataset'))
        // .option('-t, --task <task>', 'Task to add')
        // .option('-p, --priority <priority>', 'Priority level of task')
        // .action(async (options) => {
        //     console.log(yellow(postman.info._postman_id));
        //     //console.log(yellow(JSON.stringify(postman.item)));
        // });
        var paths = [] as Array<string>;
        var promises = [] as Array<any>;
        postman.item.forEach(async (item: any) => {
            const level = 0;
            const path = item.request.url.path[level];
            const description = item.name;


            if (paths.filter(p => p == path).length === 0) {
                paths.push(path);
                const methods = await listPathMethodsAtLevel(level, path, postman.item);
                promises.push(methods);
                const pathCommand = new Command();
                pathCommand
                    .name(path)
                    .description(`${path} : ${description}`)
                    .action(async (options) => {

                        console.log(cyan(path));
                    });
                // methods.forEach(async (method: any) => {
                //     pathCommand.addCommand(new Command(method.method)
                //         .description(`${method.method} ${path}`)
                //         .action(async (options) => {
                //             console.log(yellow(method.method));
                //             try {
                //                 const result = await runRequest(method);
                //                 console.log(green(result));
                //             } catch (e) {
                //                 console.log(red(e));
                //             }
                //         })
                //     )
                // });

                await Promise.all(promises)
                console.log(yellow(JSON.stringify(methods, null, 2)));
                anyCommand.addCommand(pathCommand);
            }

        });

        return anyCommand;
    } catch (e) {
        throw e;
    }

}

/**
 * Run a request
 * 
 * @param request 
 * @param id 
 * @returns 
 */
async function runRequest(request: apiRequest, id?: string) {

    var result = {} as any;
    try {
        switch (request.method) {
            case 'GET':

                result = await axios.get(`${config.api_endpoint}${request.path}`);

                break;
            case 'POST':

                result = await axios.post(`${config.api_endpoint}${request.path}`, request.fields);

                break;
            case 'PUT':

                result = await axios.put(`${config.api_endpoint}${request.path}`, request.fields);

                break;
            case 'DELETE':

                result = await axios.delete(`${config.api_endpoint}${request.path}${id}`);

                break;
            default:
                break;
        }
        return result.data;
    } catch (e) {
        throw e;
    }
}

/**
 * Needs to return an apiRequest object
 * {
 *  path: string,
 *  method: string,
 *  fields: Array<any> | optional
 * }
 * 
 * Example of calling this method:
 * {
 *  level: 0;
 *  path: 'users',
 *  items: [
 *      ...
 *  ]
 * }
 * 
 * @param level 
 * @param path
 * @param items 
 * @returns 
 */
async function listPathMethodsAtLevel(level: number, path: string, items: Array<any>): Promise<Array<apiRequest>> {
    var apiRequests = [] as Array<any>;
    items.forEach(async (item: any) => {
        // const
        //when all conditions are met:
        //level is the same as the url path length e.g. 0
        //path is the same e.g. users
        //item request url path length at level is the same e.g. users
        if (item.request.url.path.length - 1 === level && item.request.url.path[level] === path) {
            apiRequests.push({
                name: item.name,
                path: item.request.url.path[level],
                method: item.request.method,
                fields: item.request.body.raw
            });
        }
    })


    // apiRequests = items.filter(async (item: any) => {
    //     //when all conditions are met:
    //     //level is the same as the url path length e.g. 0
    //     //path is the same e.g. users
    //     //item request url path length at level is the same e.g. users
    //     return item.request.url.path.length - 1 === level && item.request.url.path[level] === path;
    // });
    // apiRequests = apiRequests.map(async (item: any) => {
    //     return {
    //         path: item.request.url.path[level],
    //         method: item.request.method,
    //         fields: item.request.body.raw
    //     }
    // });
    return apiRequests;
}

async function main() {
    program
        .version(magenta(config.version))
        .description(lightBlue(config.description))
        .option('-v, --version', magenta('output the current version'))
        .option('-h, --help', yellow('output usage information'))
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
