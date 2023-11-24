
import { Command, Option } from 'commander';
import { prompt } from 'enquirer';
import { yellow, red, green, blue, lightBlue, cyan, magenta, orange } from './../utils/colors';
import api from './api';
import apiRequest from '../types/apiRequest';
const config = require('./../config');


async function users(filter = 'users') {

    try {
        // items = items.filter(item => item.request.url.path[0] == filter);

        const usersCommand = new Command()
        usersCommand
            .name(filter)
            .description(orange(`teemops ${filter}`));

        usersCommand.addCommand(await check());
        usersCommand.addCommand(await register());

        return usersCommand;
    } catch (e) {
        throw e;
    }

}

async function check() {
    try {

        const checkCommand = new Command()
        checkCommand
            .name('check')
            .description(orange(`check if email is registered`))
            .requiredOption('-e, --email <email>', magenta('Provide an email to check'))
            .action(async (options) => {
                const request = {
                    method: 'GET',
                    path: `users/check/${options.email}`
                } as apiRequest;
                const result = await api(request);
                if (result.exists) {
                    console.log(green(`User ${options.email} exists`));
                } else {
                    console.log(yellow(`User ${options.email} does not exist`));
                }

            });

        return checkCommand;
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
            .requiredOption('-e, --email <email>', magenta('Provide an email to register'))
            .action(async (options) => {
                const request = {
                    method: 'GET',
                    path: `users/check/${options.email}`
                } as apiRequest;
                var result = await api(request);
                if (result.exists) {
                    console.log(yellow(`User ${options.email} exists, please use a different email`));
                } else {
                    console.log(yellow(`Registering with ${options.email} ...`));
                    const request = {
                        method: 'PUT',
                        path: `users`,
                        fields: {
                            email: options.email
                        }
                    } as apiRequest;
                    result = await api(request);
                    if (result.success) {
                        console.log(green(`A confirmation code has been sent to ${options.email}. Please enter the code and a strong password to complete registration.`));
                        //prompt for code
                        const response = await prompt([{
                            type: 'input',
                            name: 'code',
                            message: 'Code'
                        },
                        {
                            type: 'password',
                            name: 'password',
                            message: 'Password'

                        }]) as any;
                        const request = {
                            method: 'POST',
                            path: `users/verify`,
                            fields: {
                                email: options.email,
                                code: response.code,
                                password: response.password
                            }
                        } as apiRequest;
                        result = await api(request);
                        if (result.result === true) {
                            console.log(green(`Congratulations User ${options.email} registration complete.`));
                            console.log(green(`Please login with your email and password. Using the command: teemops login`));
                        } else {
                            console.log(red(`User ${options.email} registration failed. Please try again or contact support.`));
                        }
                    } else {
                        console.log(red(`User ${options.email} registration failed. Please try again or contact support.`));
                    }
                }

            });

        return registerCommand;
    } catch (e) {
        throw e;
    }
}

export default users;