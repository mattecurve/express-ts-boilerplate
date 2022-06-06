#!/usr/bin/env node
import yargs from 'yargs';

yargs
    .command('test', 'Test command', {}, () => {
        // eslint-disable-next-line no-console
        console.log('Test command called');
    })
    .strictCommands()
    .demandCommand(1)
    .parse();
