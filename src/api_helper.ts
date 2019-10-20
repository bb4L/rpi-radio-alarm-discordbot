import * as config from '../config.json';

export class Api_helper {
    private static xmlHttp = new (require("xmlhttprequest").XMLHttpRequest)();

    public static getAlarms: any = function () {
        Api_helper.xmlHttp.open("GET", config.host + 'alarm', false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", " application/json");
        Api_helper.xmlHttp.send();
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static changeAlarm: any = function (index: number, data: any) {
        Api_helper.xmlHttp.open("PUT", config.host + 'alarm/' + index, false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send(JSON.stringify(data));
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static turnOff: any = function (index: number) {
        Api_helper.xmlHttp.open("PUT", config.host + 'alarm/' + index, false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send(JSON.stringify({"on": "false"}));
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static turnOn: any = function (index: number) {
        Api_helper.xmlHttp.open("PUT", config.host + 'alarm/' + index, false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send(JSON.stringify({"on": "true"}));
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static getRadio: any = function () {
        Api_helper.xmlHttp.open("GET", config.host + 'radio', false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send();
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static stopRadio: any = function () {
        Api_helper.xmlHttp.open("POST", config.host + 'radio', false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send(JSON.stringify({'switch': 'off'}));
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

    public static startRadio: any = function () {
        Api_helper.xmlHttp.open("POST", config.host + 'radio', false);
        Api_helper.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        Api_helper.xmlHttp.send(JSON.stringify({'switch': 'on'}));
        return JSON.parse(Api_helper.xmlHttp.responseText);
    };

}

export function getAlarmString(alarm, index) {
    return `__**Alarm ${index}**__  \n Name: ${alarm['name']} \n Time ${alarm['hour']}: ${alarm['min']}  \n Days: ${alarm['days']} \n on: ${alarm['on']}`;
}
