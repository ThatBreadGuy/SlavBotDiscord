const command = require("discord.js-commando");
const Jimp = require("jimp");
const shortid = require("shortid");
const fs = require('fs');
var resultHandler = function(err) { 
    if(err) {
       console.log("unlink failed", err);
    } else {
       console.log("file deleted");
    }
}
var CommandCounter = require("../../index.js")

class ClassCommand extends command.Command
 {
    constructor(client)
    {
        super(client, {
            name: "class",
            group: "imageshit",
            memberName: "class",
            description: "***Choose your class.*** Takes random users and puts their profile pictures in the image. Alternatively, you can use the images parameter to use the last uploaded images (up to 6 images only).",
            examples: ["`!class`", "`!class images`"]
        });
    }

    async run(message, args)
    {
        message.channel.startTyping();
        CommandCounter.addCommandCounter(message.author.id)
        var commandPrefix= "!"
        if(message.guild != null)
        {
            commandPrefix = message.guild.commandPrefix
        }

        if(args.toString().toLowerCase() == "images")
        {
            message.channel.fetchMessages({ around: message.id })
            .then(messages => {
                var urls = [];
                var arrayMessages = messages.array();
                for(var i = 0; i < arrayMessages.length; i++)
                {
                    if(arrayMessages[i].attachments.first() != undefined)
                    {
                        for(var i2 = arrayMessages[i].attachments.array().length - 1; i2 > -1; i2--)
                        {
                            if(urls.length < 6)
                            {
                                if(arrayMessages[i].attachments.array()[i2].height > 0)
                                {
                                    urls.splice(0, 0, arrayMessages[i].attachments.array()[i2].url)
                                }
                            }
                        }
                    }
                }

                if(urls.length == 0)
                {
                    message.reply("no images found, use `" + commandPrefix + "help class` for help.").catch(error => console.log("Send Error - " + error));
                    message.channel.stopTyping();
                    return;
                }

                while(urls.length < 6)
                {
                    urls.push("blank.png")
                }

                message.reply("***taking images***").catch(error => console.log("Send Error - " + error));
                Jimp.read("class.png").then(function (classImage) {
                    console.log("got image");
                    var BG = new Jimp(classImage.bitmap.width, classImage.bitmap.height)
                    Jimp.read(urls[0]).then(function (image1) {
                        image1.scaleToFit(196, 196)
                        BG.composite(image1, 19, 89)
                        Jimp.read(urls[1]).then(function (image2) {
                            image2.scaleToFit(201, 201)
                            BG.composite(image2, 249, 86)
                            Jimp.read(urls[2]).then(function (image3) {
                                image3.scaleToFit(197, 197)
                                BG.composite(image3, 471, 87)
                                Jimp.read(urls[3]).then(function (image4) {
                                    image4.scaleToFit(199, 199)
                                    BG.composite(image4, 15, 301)
                                    Jimp.read(urls[4]).then(function (image5) {
                                        image5.scaleToFit(204, 204)
                                        BG.composite(image5, 241, 299)
                                        Jimp.read(urls[5]).then(function (image6) {
                                            image6.scaleToFit(200, 200)
                                            BG.composite(image6, 467, 301)
                                            
                                            var mergedImage = BG.composite(classImage, 0, 0);
                                
                                            var file = shortid.generate() + ".png"
                                            mergedImage.write(file, function(error){
                                                if(error) throw error;
                                                console.log("got merged image");
                                                console.log(file);
                                                message.channel.send("***Choose your class:**", {
                                                    files: [file]
                                                }).then(function(){
                                                    message.channel.stopTyping();
                    
                                                    setTimeout(function(){
                                                        fs.unlink(file, resultHandler);
                                                        console.log("Deleted " + file);
                                                    }, 10000);
                                                }).catch(function (err) {
                                                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                    console.log(err.message);
                                                    message.channel.stopTyping();
                                                    setTimeout(function(){
                                                        fs.unlink(file, resultHandler);
                                                        console.log("Deleted " + file);
                                                    }, 10000);
                                                });
                                                console.log("Message Sent");
                                            });
                                        }).catch(function (err) {
                                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                            console.log(err.message);
                                            message.channel.stopTyping();
                                        });
                                    }).catch(function (err) {
                                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                        console.log(err.message);
                                        message.channel.stopTyping();
                                    });
                                }).catch(function (err) {
                                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                    console.log(err.message);
                                    message.channel.stopTyping();
                                });
                            }).catch(function (err) {
                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                console.log(err.message);
                                message.channel.stopTyping();
                            });
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                        });
                    }).catch(function (err) {
                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        message.channel.stopTyping();
                    });
                }).catch(function (err) {
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
        else
        {
            if(message.guild == null)
            {
                return;
            }
            var profileURLs = [];
            var profiles = [];
            console.log("users class");
            var users = message.guild.members.array()
            while(profileURLs.length < 6)
            {
                if(profileURLs.length >= users.length)
                {
                    console.log("Added blank")
                    profileURLs.push("blank.png")
                }
                else
                {
                    console.log("Adding user")
                    var user = users[Math.floor(Math.random() * users.length)].id
                    var alreadyAdded = false;
                    for(var i = 0; i < profiles.length; i++)
                    {
                        if(profiles[i] == user)
                        {
                            alreadyAdded = true;
                        }
                    }

                    if(!alreadyAdded)
                    {
                        console.log("Added user")
                        profiles.push(user)
                        message.channel.client.fetchUser(user)
                            .then(User => {
                            profileURLs.push(User.avatarURL);
                            }, rejection => {
                                console.log(rejection.message);
                        });
                    }
                }
            }    


            Jimp.read("class.png").then(function (classImage) {
                console.log("got image");
                var BG = new Jimp(classImage.bitmap.width, classImage.bitmap.height)
                Jimp.read(profileURLs[0]).then(function (image1) {
                    image1.resize(196, 196)
                    BG.composite(image1, 19, 89)
                    Jimp.read(profileURLs[1]).then(function (image2) {
                        image2.resize(201, 201)
                        BG.composite(image2, 249, 86)
                        Jimp.read(profileURLs[2]).then(function (image3) {
                            image3.resize(197, 197)
                            BG.composite(image3, 471, 87)
                            Jimp.read(profileURLs[3]).then(function (image4) {
                                image4.resize(199, 199)
                                BG.composite(image4, 15, 301)
                                Jimp.read(profileURLs[4]).then(function (image5) {
                                    image5.resize(204, 204)
                                    BG.composite(image5, 241, 299)
                                    Jimp.read(profileURLs[5]).then(function (image6) {
                                        image6.resize(200, 200)
                                        BG.composite(image6, 467, 301)
                                        
                                        var mergedImage = BG.composite(classImage, 0, 0);
                            
                                        var file = shortid.generate() + ".png"
                                        mergedImage.write(file, function(error){
                                            if(error) throw error;
                                            console.log("got merged image");
                                            console.log(file);
                                            message.channel.send("***Choose your class:**", {
                                                files: [file]
                                            }).then(function(){
                                                message.channel.stopTyping();
                
                                                setTimeout(function(){
                                                    fs.unlink(file, resultHandler);
                                                    console.log("Deleted " + file);
                                                }, 10000);
                                            }).catch(function (err) {
                                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                                console.log(err.message);
                                                message.channel.stopTyping();
                                                setTimeout(function(){
                                                    fs.unlink(file, resultHandler);
                                                    console.log("Deleted " + file);
                                                }, 10000);
                                            });
                                            console.log("Message Sent");
                                        });
                                    }).catch(function (err) {
                                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                        console.log(err.message);
                                        message.channel.stopTyping();
                                    });
                                }).catch(function (err) {
                                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                    console.log(err.message);
                                    message.channel.stopTyping();
                                });
                            }).catch(function (err) {
                                message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                                console.log(err.message);
                                message.channel.stopTyping();
                            });
                        }).catch(function (err) {
                            message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                            console.log(err.message);
                            message.channel.stopTyping();
                        });
                    }).catch(function (err) {
                        message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                        console.log(err.message);
                        message.channel.stopTyping();
                    });
                }).catch(function (err) {
                    message.reply("Error - " + err.message).catch(error => console.log("Send Error - " + error));
                    console.log(err.message);
                    message.channel.stopTyping();
                });
            }).catch(function (err) {
                console.log(err.message);
                message.channel.stopTyping();
            });
        }
    }
}

module.exports = ClassCommand;