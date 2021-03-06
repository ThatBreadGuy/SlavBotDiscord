const command = require("discord.js-commando");
var catMe = require('cat-me')
var CommandCounter = require("../../index.js")

class CadeCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "cade",
            group: "textshit",
            memberName: "cade",
            description: "Gives random cade in ASCII art.",
            examples: ["`!cade`"]
        });
    }

    async run(message, args)
    {
        CommandCounter.addCommandCounter(message.author.id)
        message.channel.send("", {embed: {color: 63487, description: "```" + catMe() + "```"}}).catch(error => console.log("Send Error - " + error));
    }
}

module.exports = CadeCommand;