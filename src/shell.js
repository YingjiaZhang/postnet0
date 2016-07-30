'use strict';

const repl = require('repl');//
const pos = require('../src/pos.js');

function switchRouter(context, done) {

    let router = actions.find(item => item.name === currentAction);
    let result = router.doAction(context.cmd);
    let newRouter = actions.find(item => item.name === result);

    currentAction = newRouter.name;
    console.log(newRouter.help);
    done(null);
}

function handleCmd(cmd, context, filename, done) {
    switchRouter({
        cmd: cmd.trim()
    }, done);
    done(null);
}

var replServer = repl.start({prompt: "> ", eval: handleCmd});


class WelcomeAction {
    constructor() {
        this.name = 'init';
        this.help = 'xxxx';
    }

    doAction() {
        // dosomething
    }
}


const actions = [{
    name: 'init',
    help: "\nWelcome 欢迎进入转换界面\n* initMenu:\n  1 - 邮编转条码\n  2 - 条码转邮编\n  q - 退出",
    doAction: function (cmd) {
        switch (cmd) {
            case '1':
                return 'Postcode to Barcode';
            case '2':
                return 'Barcode to Postcode';
            case 'q':
                replServer.close();
                process.exit(0);
                return;
            default:
                console.log("无效的输入");
                return 'init'
        }
    }
}, {
    name: 'Barcode to Postcode',
    help: '\n * 条形码转换邮编的状态\n  a - 输入条形码并转换.\n  q - 返回主界面.',
    doAction: function (cmd) {
        switch (cmd) {
            case 'a':
                return 'deal barcode to postcode';
            default:
                console.log("无效的输入");
                return 'init'
        }
    }
}, {
    name: 'Postcode to Barcode',
    help: "\n * 邮编转条码的状态\n  1 - 输入并转换.\n  q - 返回主界面.",
    doAction: function (cmd) {
        switch (cmd) {
            case '1':
                return 'deal post to barcode';
            default:
                console.log("无效的输入");
                return 'init'
        }
    }
}, {
    name: 'deal post to barcode',
    help: ' * 请输入 ：',
    doAction: function (cmd) {
        let result = pos.printBarcode(cmd);
        if (!result) {
            result = '\nError! 输入格式有误.(邮编 5位,9位,或10位：xxxxx-xxxx数字字符构成)\n';
        }
        console.log(result);
        return 'Postcode to Barcode';
    }
}, {
    name: 'deal barcode to postcode',
    help: ' * 请输入 ：',
    doAction: function (cmd) {

        let result = pos.printPostCode(cmd);

        if (!result) {
            result = 'Error! 输入条码有误.\n';
        }
        console.log(result);
        return 'Barcode to Postcode'
    }
}];

let currentAction = 'init';
console.log(actions.find(item => item.name === currentAction).help);


