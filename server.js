const Discord = require('discord.js');
const client = new Discord.Client();

const tokenfile = require("./token.json");

const prefix = '/';
const ownerID = '269787936936034304';
const active = new Map();

const serverStats = {
    guildID: '329618429915037696',
    totalUsersID: '512332759641882634',
    memberCountID: '512332868018765824',
    botCountID: '512332936083931157'
};

let statuses = ['discord.gg/ADnw9D7', 'Bonjour le monde !', 'Serveur Minecraft', 'Survivre ...', 'Drakaria Network', 'Nouvelle mise à jour !', 'Minecraft'];
client.on('ready', () => {

    setInterval(function() {
     
        let status = statuses[Math.floor(Math.random()*statuses.length)];

        client.user.setPresence({ game: { name: status }, status: 'online' });

        client.user.setPresence({ activity: { name: status }, status: 'online' });



    }, 10000)

});

client.on('message', message => {

    let args = message.content.slice(prefix.length).trim().split(' ');
    let cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    try {

        delete require.cache[require.resolve(`./commands/${cmd}.js`)];

        let ops = {
            ownerID: ownerID,
            active: active
        }

        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args, ops);
    } catch (e) {
        console.log(e.stack);
    }
});

client.on('ready', () => console.log('Lancer !'));

client.on('guildMemberAdd', member => {

    if (member.guild.id !== serverStats.guildID) return;

    client.channels.get(serverStats.totalUsersID).setName(`Total Users : ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);


});

client.on('guildMemberRemove', member => {

    if (member.guild.id !== serverStats.guildID) return;

    client.channels.get(serverStats.totalUsersID).setName(`Total Users : ${member.guild.memberCount}`);
    client.channels.get(serverStats.memberCountID).setName(`Member Count : ${member.guild.members.filter(m => !m.user.bot).size}`);
    client.channels.get(serverStats.botCountID).setName(`Bot Count : ${member.guild.members.filter(m => m.user.bot).size}`);

});

client.login(tokenfile.token);