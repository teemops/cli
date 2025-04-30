
import { Command } from 'commander';
import actions from './index';
import { yellow, red, green, blue, lightBlue, cyan, magenta, orange } from './../utils/colors';

async function run() {

    try {
        const anyCommand = new Command()

        anyCommand
            .name('any')
            .description(orange('Query any teemops dataset'));
        // .option('-t, --task <task>', 'Task to add')
        // .option('-p, --priority <priority>', 'Priority level of task')
        // .action(async (options) => {
        //     console.log(yellow(postman.info._postman_id));
        //     //console.log(yellow(JSON.stringify(postman.item)));
        // });

        anyCommand.addCommand(await actions['users']());

        return anyCommand;
    } catch (e) {
        throw e;
    }

}

export default run;