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
        let args = message.substring(1).split(' -');
        const cmd = args[0];
        let response = {};

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
                        response = Api_helper.changeAlarm(args[1], {"on": "true"});
                        bot.sendMessage({to: channelID, message: getAlarmString(response, '')});
                        break;
                    }

                    case 'off': {
                        response = Api_helper.changeAlarm(args[1], {"on": "false"});
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
                        bot.sendMessage({to: channelID, message: 'isPlaying: ' + response['isPlaying']});
                        break;
                    }

                    case 's': {
                        response = Api_helper.stopRadio();
                        bot.sendMessage({to: channelID, message: 'isPlaying: ' + response['isPlaying']});
                        break;
                    }
                }
                break;
            }

            case 'help': {
                bot.sendMessage({
                    to: channelID,
                    message: "**Help** \n alarms   \t\t\t\t\t\t\t\t\t\t\t\t\t\t returns all the alarms \n alarm \t\t -[on/off] -[index]\t\t\t\t\t turns alarm on or off \n radio \t\t\t\t\t\t-[i] \t\t\t\t\t\t\t\tgets information if playing\n \t\t\t\t\t\t\t\t  -[p] \t\t\t\t\t\t\t\tstarts playing\n \t\t\t\t\t\t\t\t  -[s] \t\t\t\t\t\t\t\tstops playing"
                });
                break;
            }

            default: {
                bot.sendMessage({to: channelID, message: `**THIS CALL IS UNKNOWN, YOU TRIED: \t ${cmd}**`});
                break;
            }
        }
    }
});
