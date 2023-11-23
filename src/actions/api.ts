import { Command, Option } from 'commander';
import axios from 'axios';
import { yellow, red, green } from '../utils/colors';
const apiCommand = new Command();

apiCommand
    .name('templates')
    .description('View availabe templates')
    // .option('-t, --task <task>', 'Task to add')
    // .option('-p, --priority <priority>', 'Priority level of task')
    .action(async (options) => {
        console.log('Getting templates');
        try {
            const templates = await getTemplates();
            console.table(templates);
        } catch (e) {
            console.log(yellow('Error getting templates'));
            console.log(red(e));
        }
    });

async function getTemplates() {
    try {
        const result = await axios.get('https://api.tcg.app.teemops.com/templates');

        // const detailedTemplates = templates.data.templates.map(async (template: any) => {
        //     return {

        //     }
        // })
        return result.data.templates;
    } catch (e) {
        throw e;
    }

}


export default apiCommand;