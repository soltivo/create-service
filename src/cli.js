import arg from 'arg';
import { createProject } from './main';


function parseArgumentsIntoOptions(rawArgs) {    
    return {
        skipPrompts: false,
        git: true,
        template: 'Javascript',
        runInstall: true
    };
}

async function promptForMissingOptions(options) {

    return {
        ...options,
        template: options.template,
        git: options.git
    };
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}