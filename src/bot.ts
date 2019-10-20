import {Api_helper, getAlarmString} from "./api_helper";

import {Client} from "discord.js";
import * as winston from "winston";

const mylogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
    transports: [
        new winston.transports.Console({level: 'debug'}),
        new winston.transports.File({filename: 'infolog.log', level: 'info'})
    ]
});

// Initialize Discord Bot
const bot = new Client();
bot.on('ready', () => {
    mylogger.info("ONLINE");
});

bot.on('message', function (msg) {
    let message = msg.content;
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) === '!') {
        let args = message.substring(1).split(' -');
        const cmd = args[0];
        let response = {};
        args = args.splice(1);
        switch (cmd) {
            case 'ping': {
                msg.channel.send('Pong!');
                break;
            }

            case 'alarms': {
                const alarms = Api_helper.getAlarms();
                if (alarms.length == 0) {
                    msg.channel.send('no alarms found');
                }
                mylogger.info(alarms);
                let text = '';
                for (let i = 0; i < alarms.length; i++) {
                    text += getAlarmString(alarms[i], i) + '\n';
                }
                msg.channel.send(text);
                break;
            }

            case 'alarm': {
                switch (args[0]) {
                    case 'on': {
                        response = Api_helper.changeAlarm(args[1], {"on": true});
                        msg.channel.send(getAlarmString(response, ''));
                        break;
                    }

                    case 'off': {
                        response = Api_helper.changeAlarm(args[1], {"on": false});
                        msg.channel.send(getAlarmString(response, ''));
                        break;
                    }
                }
                break;
            }

            case 'radio': {
                switch (args[0]) {
                    case 'i': {
                        response = Api_helper.getRadio();
                        mylogger.debug(response.toString());
                        if (response['isPlaying']) {
                            msg.channel.send('Radio is playing!');
                        } else {
                            msg.channel.send('Radio is not playing!');
                        }
                        break;
                    }

                    case 'p': {
                        response = Api_helper.startRadio();
                        msg.channel.send('isPlaying: ' + response['isPlaying']);
                        break;
                    }

                    case 's': {
                        response = Api_helper.stopRadio();
                        msg.channel.send('isPlaying: ' + response['isPlaying']);
                        break;
                    }

                    default: {
                        msg.channel.send('A option is required!');
                    }
                }
                break;
            }

            case 'help': {
                msg.channel.send("**Help** \n alarms   \t\t\t\t\t\t\t\t\t\t\t\t\t\t returns all the alarms \n alarm \t\t -[on/off] -[index]\t\t\t\t\t turns alarm on or off \n radio \t\t\t\t\t\t-[i] \t\t\t\t\t\t\t\tgets information if playing\n \t\t\t\t\t\t\t\t  -[p] \t\t\t\t\t\t\t\tstarts playing\n \t\t\t\t\t\t\t\t  -[s] \t\t\t\t\t\t\t\tstops playing"
                );
                break;
            }

            default: {
                msg.channel.send(`**THIS CALL IS UNKNOWN, YOU TRIED: \t ${cmd}**`);
                break;
            }
        }
    }
});

bot.login(require('../config.json').token);
