const Discord = require('discord.js');
const client = new Discord.Client();
//const auth = require('./auth.json');
const timezones = require('./timezone.js')

const newUsers = new Discord.Collection();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {

	if (msg.content.toLowerCase() == 'boop') {
		msg.reply('UwU!');
	}
	else if (msg.content == 'rino') {
		msg.reply('rino rino');
	}

	else if (msg.content == 'Time') {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime  = date + ' ' + time;

		msg.reply(dateTime);

	}

	else if (msg.content == '!info') {
		msg.reply('This is bot is being used for testing purpose, it will be replaced \n, the final bot will be available on www.github.com/sonamghosh/ \n, stay tuned! :3');
	}
});

// Testing for Welcome Msg when user gets added
client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  newUsers.set(member.id, member.user);

  if (newUsers.size > 10) {
    const defaultChannel = guild.channels.find(channel => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
    const userlist = newUsers.map(u => u.toString()).join(" ");
    defaultChannel.send("Welcome our new users!\n" + userlist);
    newUsers.clear();
  }
});

//client.login(auth.token);
client.login(process.env.BOT_TOKEN);

