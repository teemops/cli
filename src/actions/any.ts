import { Command, Option } from 'commander';
import axios from 'axios';
import { yellow, red, green } from '../utils/colors';
var postman: any = {};
const anyCommand = new Command();


async function thisCommand(): Promise<Command> {
    postman = await require('../reference/Teemops.postman_collection.json');
    try {
        const anyCommand = new Command();
        anyCommand
            .name('any')
            .description('Query any teemops dataset')
            // .option('-t, --task <task>', 'Task to add')
            // .option('-p, --priority <priority>', 'Priority level of task')
            .action(async (options) => {
                console.log(yellow(postman.info._postman_id));
                //console.log(yellow(JSON.stringify(postman.item)));
            });

        postman.item.forEach((item: any) => {
            const path = item.request.url.path[0];
            anyCommand.addCommand(new Command(path)
                .description('Query ' + path)
                .action(async (options) => {
                    console.log(yellow(path));
                })
            )
        });

        return anyCommand;

    } catch (e) {
        console.log(yellow('Error getting templates'));
        console.log(red(e));
        throw e;
    }
};

export default thisCommand;
