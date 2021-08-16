const { get } = require('powercord/http');
const { Plugin } = require('powercord/entities');

const boredApiUrl = 'http://www.boredapi.com/api/activity/';
let jsonBody;

module.exports = class Bored extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: 'bored',
      description: 'Bust your boredom... hopefully!',
      usage: '{c}',
      executor: this.search.bind(this)
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand('bored');
  }

  get getRandomColour() {
    return Math.floor(Math.random() * 16777215);
  }



  async search() {
    function doCapitalize(string) {
        string = String(string)
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const fallback = {
      send: false,
      result: 'Something broke with the API :('
    };

    try {
      jsonBody = await get(boredApiUrl).then(resp => resp.body);
    } catch (error) {
        console.error('Error occurred in Bored plugin: ', error);
        return fallback;
      }

    if (!jsonBody.activity) {
      return fallback;
    }

    let information = [];

    Object.entries(jsonBody).forEach((arrayItem) => {
      const [ key, value ] = arrayItem;
      const keyCapitalized = `• ${doCapitalize(key)}: `;
      let valueCapitalized; // gotta do this otherwise reference errors

      if (key === 'link' && value) {
        valueCapitalized = `[Click Here](${value})`;
      } else {
          valueCapitalized = doCapitalize(value || 'none');
      }
      information.push(keyCapitalized + valueCapitalized);
    });

    return {
      send: false,
      result: {
        type: 'rich',
        title: 'Feeling bored? How about you...',
        description: `${jsonBody.activity}!`,
        color: this.getRandomColour,
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
