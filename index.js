const { get } = require("powercord/http");
const { Plugin } = require("powercord/entities");

const API_URL = "http://www.boredapi.com/api/activity/";

module.exports = class Bored extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: "bored",
      description: "Bust your boredom... hopefully!",
      usage: "{c}",
      executor: this.search.bind(this)
    })
    console.log("Hello")
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("bored")
  }

  get randomColour() {
    return Math.floor(Math.random() * 16777215)
  }

  capitalizeString(value) {
    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1)
    } else {
      return value
    }
  }

  async search() {
    const fallback = {
      send: false,
      result: "Something broke with the API :("
    }

    let jsonBody
    try {
      jsonBody = await get(API_URL).then(resp => resp.body)
    } catch (error) {
      console.error("Error occured in Bored plugin: ", error)
      return fallback
    }

    const activity = jsonBody.activity
    if (!activity) {
      return fallback
    }

    delete jsonBody.activity
    let information = []

    Object.entries(jsonBody).forEach((arr) => {
      const [ attr, value ] = arr

      if (!(value === null || value.length === 0)) {
        let finalValue
        const finalAttr = `• ${this.capitalizeString(attr)}: `

        if (attr === "link" && finalValue.startsWith("http")) {
          finalValue = value // Lame
        } else {
          finalValue = this.capitalizeString(value)
        }

        information.push(finalAttr + finalValue)
      }
    })

    return {
      send: false,
      result: {
        type: "rich",
        title: "Feeling bored? How about you...",
        description: `${activity}!`,
        color: this.randomColour,
        fields: [
          {
            name: "Extra information",
            value: information.join("\n"),
            inline: false
          }
        ],
        footer: {
          text: "Sourced from https://www.boredapi.com/"
        }
      }
    }
  }
}