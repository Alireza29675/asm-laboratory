const { exec } = require('child_process');
const chalk = require('chalk');

const MAX_ERROR_LINE_DIGITS = 3

const asmFile = 'app.playground.asm'
const labDir = './lab'

exec(`nasm -f elf32 ${asmFile} -o ${labDir}/app.o && ld -m elf_i386 ${labDir}/app.o -o ${labDir}/app`, (err) => {
    console.log('--------------------------------------------')
    if (err) {
        const messages = err.message.split('\n')
                                    .filter(msg => msg.startsWith(asmFile))
                                    .map(msg => stylizeError(msg))
        console.error(chalk`\n{bgRed.white  ✘ }{red  ${messages.length} compiler error${messages.length > 1 ? 's' : ''} occured!  }\n\n${messages.join('\n')}\n`);
        return;
    }
    exec(`${labDir}/app`, (err, stdout, stderr) => {
        console.log(chalk`\n{bgGreen.black  ✔ }{green  Code was compiled successfully  }\n\n{bgWhite.black ${stdout || ' '}}\n`);
    })
})

const stylizeError = (error) => {
    const parts = error.split(':')
    const file = parts.shift().trim()
    const line = parts.shift().trim()
    const type = parts.shift().trim()
    const message = parts.join(':').trim()
    return chalk`{bgRed.white  error line ${line.padEnd(MAX_ERROR_LINE_DIGITS, ' ')}} ${message}`;
}