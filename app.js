const { exec } = require('child_process');
const chalk = require('chalk');

const asmFile = 'app.playground.asm'
const labDir = './lab'

exec(`nasm -f elf32 ${asmFile} -o ${labDir}/app.o && ld -m elf_i386 ${labDir}/app.o -o ${labDir}/app`, (err) => {
    if (err) {
        const message = err.message.split('\n').filter(errmsg => errmsg.startsWith('app.asm')).join('\n');
        console.error(chalk`\n{bgRed.white  Compiling error!  }\n\n${message}\n`);
        return;
    }
    exec(`${labDir}/app`, (err, stdout, stderr) => {
        console.log(chalk`\n{bgGreen.black  App compiled  }\n\n{bgWhite.black ${stdout || ' '}}\n`);
    })
})
