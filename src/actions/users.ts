
import { Command } from 'commander';
import { yellow, red, green, blue, lightBlue, cyan, magenta, orange } from './../utils/colors';
const config = require('./../config');
interface apiRequest {
    name: string,
    path: string,
    method: string,
    fields?: Array<any>
}

async function users(filter = 'users') {

    try {
        // items = items.filter(item => item.request.url.path[0] == filter);

        const usersCommand = new Command()
        usersCommand
            .name(filter)
            .description(orange(`teemops ${filter}`));

        usersCommand.addCommand(await register());

        return usersCommand;
    } catch (e) {
        throw e;
    }

}

async function register() {
    try {
        const registerCommand = new Command()
        registerCommand
            .name('register')
            .description(orange(`register a new user`))
            .option('-e, --email <email>', 'email')
            .action(async (options) => {
                console.log(yellow('register'));
            });

        return registerCommand;
    } catch (e) {
        throw e;
    }
}

export default users;