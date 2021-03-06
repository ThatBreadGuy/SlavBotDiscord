const command = require("discord.js-commando");
var CommandCounter = require("../../index.js")

class KickCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "kick",
            group: "moderation",
            memberName: "kick",
            description: "Kick a member or members.",
            examples: ["`!kick @User`", "`!kick @User1 @User2`"]
        });
    }

    async run(message, args)
    {
        if(message.guild == null)
        {
            return;
        }
        
        if(!message.guild.member(message.client.user.id).hasPermission("ADMINISTRATOR") && !message.guild.member(message.client.user.id).hasPermission("KICK_MEMBERS")){
            message.channel.send("<@" + message.author.id + "> Slav Bot does not have the Administrator or Kick Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }
        

        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR") && !message.guild.member(message.author).hasPermission("KICK_MEMBERS") && message.author.id != message.guild.owner.id){
            message.channel.send("<@" + message.author.id + "> This command is only available to the owner, or those with the Administrator or Kick Members Permission.").catch(error => console.log("Send Error - " + error))
            return;
        }

        CommandCounter.addCommandCounter(message.author.id)
        var users = [];

        if(args.length > 0)
        {
            console.log("args are present");
            var getUser = false;
            var userID = "";

            for(var i = 0; i < args.length; i++)
            {
                if(getUser)
                {
                    if(args[i].toString() == ">")
                    {
                        users.push(userID);
                        userID = "";
                        getUser = false;
                    }
                    else
                    {
                        if(args[i].toString() != "@" && !isNaN(args[i].toString()))
                        {
                            userID = userID + args[i].toString();
                        }
                    }
                }
                else
                {
                    if(args[i].toString() == "<")
                    {
                            getUser = true;
                    } 
                }
            }

            if(users.length == 0)
            {
                message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
                return;
            }
        }
        else
        {
            message.channel.send("<@" + message.author.id + "> No users mentioned.").catch(error => console.log("Send Error - " + error));
            return;
        }
        
        for(var i = 0; i < users.length; i++)
        {
            message.guild.fetchMember(users[i]).then(function(member){
                if(member.id == message.guild.owner.id)
                {
                    message.channel.send("<@" + message.author.id + "> You cannot kick the owner of the server.").catch(error => console.log("Send Error - " + error));
                }
                else
                {
                    member.kick().then(() => {
                        message.channel.send("<@" + message.author.id + "> Kicked <@" + member.id + ">").catch(error => console.log("Send Error - " + error))
                    }).catch(error => message.channel.send("Error - " + error).catch(error => console.log("Send Error - " + error)));
                }
                
            }).catch(function(error){
                console.log(error.message);
                message.channel.send("Error - " + error.message).catch(error => console.log("Send Error - " + error));
            })
        }
    }
}

module.exports = KickCommand;
