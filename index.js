const { get } = require('powercord/http');
const { Plugin } = require('powercord/entities');

module.exports = class Bored extends Plugin {

    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'bored',
            description: 'Bust your boredom (hopefully)!',
            usage: '{c}',
            executor: this.search.bind(this)
        })
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('bored');
    }

    capitalize(s) {
        if (typeof(s) !== 'string') {
            s = s.toString();
        }
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    randomHexCode() {
        return Math.floor(Math.random() * 16777215);
    }

    async search() {
        const url = 'http://www.boredapi.com/api/activity/';
        const res = await get(url).then(r => r.body);

        if (!res.activity) {
            return {
                send: false,
                result: 'Something broke with the API :('
            };
        }

        const activityDescription = res.activity;
        delete res.activity;

        let information = [];

        for (let key in res) {
            let item;
            if (key === 'link' && res[key]) {
                item = `• ${this.capitalize(key)}: [Click Here](${res[key]})`
            } else {
                item = `• ${this.capitalize(key)}: ${this.capitalize(res[key] || 'none')}`
            }
            information.push(item);
        }

        return {
            send: false,
            result: {
                type: 'rich',
                title: 'Feeling bored? How about you...',
                description: `${activityDescription}!`,
                color: this.randomHexCode(),
                fields: [{
                    name: 'Extra information',
                    value: information.join('\n'),
                    inline: false
                }],
                footer: {
                    text: 'Sourced from https://www.boredapi.com/'
                }
            }
        };
    }
}
