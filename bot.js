const Discord = require('discord.js');
const client = new Discord.Client();
//const auth = require('./auth.json');
const timezones = require('./timezone.js')

const newUsers = new Discord.Collection();

const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const {credentials, calendarId} = require('keys.js')

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json'


const auth_tokens = {
	"access_token": process.env.access_token,
	"refresh_token": process.env.refresh_token,
	"scope": process.env.scope,
	"token_type": process.env.token_type,
	"expiry_date": process.env.expiry_date
}


const responseObject = {
	"boop": "UwU",
	"rino": "rino rino",
}


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', async msg => {

	if (msg.content.toLowerCase() == 'boop') {
		msg.reply('UwU!');
	}
	else if (msg.content.toLowerCase() == 'rino') {
		msg.reply('rino rino');
	}

	else if (msg.content == 'Time') {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime  = date + ' ' + time;

		msg.reply(dateTime);

	}

	else if (msg.content == '!marco') {
		msg.reply('polo')
	}

	else if (msg.content == '!info') {
		msg.reply('This is bot is being used for testing purpose, it will be replaced \n, the final bot will be available on www.github.com/sonamghosh/ \n, stay tuned! :3');
	}

	// Testing new evemt
	else if (msg.content == '!list-events') {
		let events = await ListEvents(msg, auth_tokens)
		msg.channel.send(events);
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


async function authorize(credentials, messageObj) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);
	// Check if token is already stored
	return new Promise((resolve, reject) => {
		fs.readFile(TOKEN_PATH, async (err, token) => {
		if (err) {
			// No token, create auth url
			getAccessUrl(oAuth2Client, messageObj)
		}
		else {
			oAuth2Client.setCredentials(JSON.parse(token));
			resolve(oAuth2Client);
		}
	})
	})
}

// Store new token after prompting for user authorization and then execute the given callback with the authorizede OAuth2 Client.
async function getAccessUrl(oAuth2Client, messageObj) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	messageObj.channel.send('Authorize the app by visiting the url ${authUrl}\n Reply with [!token-key (yourTokenKey)] to authenticate')
	return
}


async function getAccessToken(code) {
	const {client_secret, client_id, redirect_uris} = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	return new Promise((resolve, reject) => {
		oAuth2Client.getToken(code, (err, token) => {
			if (err) reject(err)
			if (token==null)  reject("Bad token key")
			// Store token to disk for later executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) reject(err)
				console.log('Token stored to', TOKEN_PATH);
		});
		resolve("Authenticated")
			});
		});
}

// List the next 10 events on the user's primary calendar
function listEvents(auth) {
	const calendar = google.calendar({version: 'v3', auth});
	return new Promise((resolve, reject) => {
		calendar.events.list({
			calendarId,
			timeMin: (new Date()).toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: 'startTime',
		}, (err, res) => {
			if (err) return reject('The API returned an error: ', + err)
			const events = res.data.items;
			if (events.length) {
				let eventString = 'Upcoming 10 events: \n'
				events.map((event, i) => {
					const start = event.start.dateTime || event.start.date;
					eventString += '\n${i+1}. ${event.summary} - ${start}.          (id: $(event.id})'
				});
			resolve(eventString)
			}
			else {
				resolve("No upcoming event found")
			}
		});
	})
}


async function ListEvents(messageObj, auth) {
	try {
		const oAuth2Client = new google.auth.OAuth2(
			process.env.client_id, process.env.client_secret, process.env.redirect_uris1);
		oAuth2Client.setCredentials(JSON.parse(auth));
		let result = listEvents(oAuth2Client);
		return await result
	} catch(e) {
		return e;
	}
}


module.exports = {
	authorize,
	credentials,
	listEvents,
	getAccessToken
}











//client.login(auth.token);
client.login(process.env.BOT_TOKEN);

