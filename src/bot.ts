import {Api_helper, getAlarmString} from "./api_helper";

import {User, Client} from "discord.io";
import * as mylogger from "winston";

// Initialize Discord Bot
const bot = new Client({
    token: require('../auth.json').token,
    autorun: true
});
bot.on('ready', function (evt: any) {
    mylogger.info('Connected');
    mylogger.info('Logged in as: ');
    mylogger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user: User, userID: any, channelID: any, message: any, evt: any) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split(' ');
        const cmd = args[0];
        let response = {};

        mylogger.debug('we got a message');
        mylogger.debug(cmd);

        args = args.splice(1);
        switch (cmd) {
            case 'ping': {
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            }

            case 'alarms': {
                const alarms = Api_helper.getAlarms();
                for (let i = 0; i < alarms.length; i++) {
                    bot.sendMessage({to: channelID, message: getAlarmString(alarms[i], i)});
                }
                break;
            }

            case 'alarm': {
                switch (args[0]) {
                    case 'on': {
                        response = Api_helper.turnOn(args[1]);
                        bot.sendMessage({to: channelID, message: getAlarmString(response, '')});
                        break;
                    }

                    case 'off': {
                        response = Api_helper.turnOff(args[1]);
                        bot.sendMessage({to: channelID, message: getAlarmString(response, '')});
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
                            bot.sendMessage({to: channelID, message: 'Radio is playing!'});
                        } else {
                            bot.sendMessage({to: channelID, message: 'Radio is not playing!'});
                        }
                        break;
                    }

                    case 'p': {
                        response = Api_helper.startRadio();
                        mylogger.debug(response.toString());
                        bot.sendMessage({to: channelID, message: ''});
                        break;
                    }

                    case 's': {
                        response = Api_helper.stopRadio();
                        mylogger.debug(response.toString());
                        break;
                    }
                }
                break;
            }

            default: {
                mylogger.debug('DEFAULT');

                bot.sendMessage({to: channelID, message: `**THIS CALL IS UNKNOWN, YOU TRIED: \t ${cmd}**`});
                break;
            }
        }
    }
});
