function run(task, action, ...args){
    const command = process.argv[2];
    const taskName = command && !command.startsWith('-') ? `${task}:${command}` : task;
    const start = new Date();
    process.stdout.write(`Starting '${taskName}'...\n`);
    return Promise.resolve().then(() => action(...args)).then(() => {
        process.stdout.write()
    })
}

process.nextTick(() => {consoel.log(require.main === module)});
module.exports = (task,action) => run.bind(undefined, task, action);