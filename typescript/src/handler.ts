import * as http from 'https';

/**
 *
 * endpoints:
 *
 * /dog random (display a random image of a dog)
 * /dog breeds (display a list of breeds)
 * /dog breedSpecific (display a random image of the specific dog)
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */

const BASE_URL: string = 'https://dog.ceo/api';
const SLACK_TOKEN: string = '';

export async function dog(event: any, context: any, callback: any): Promise<any> {
	if (!event || !event.body || !event.body.text) {
		return callback(null, help());
	}

	if (event.body.token !== SLACK_TOKEN) {
		return callback(null, {
			text: "Invalid slack token!"
		});
	}

	const command: string = event.body.text.trim().toLowerCase();

	try {
		callback(null, await getPayload(command));
	} catch (err) {
		callback(err);
	}
}

async function getPayload(command: string): Promise<any> {
	switch (command) {
		case 'help':
			return help();
		case 'random':
			return await random();
		case 'breeds':
			return await list();
		default:
			return await random(command);
	}
}

// build the help menu
function help(): any {
	return {
		response_type: "in_channel",
		text: 'Here is a list of commands',
		attachments: [
			{
				text: '`/dog help` - displays this list of commands',
				mrkdwn_in: ['text']
			},
			{
				text: '`/dog random` - displays a random image of a random dog breed',
				mrkdwn_in: ['text']
			},
			{
				text: '`/dog breeds` - displays a list of all available dog breeds',
				mrkdwn_in: ['text']
			},
			{
				text: '`/dog {breed}` - display a random image of a dog with the given `{breed}`',
				mrkdwn_in: ['text']
			}
		]
	};
}

async function request(url: string): Promise<any> {
	return new Promise((resolve, reject) => {
		http.get(`${BASE_URL}${url}`, (req: http.IncomingMessage) => {
			let body: string = '';
			req.on('data', (data) => body += data);
			req.on('end', () => resolve(JSON.parse(body)));
		}).on('error', (err) => {
			console.error(err);
			reject(err);
		});
	});
}

export async function random(breed?: string): Promise<any> {
	const url: string = breed ? `/breed/${breed}/images/random` : '/breeds/image/random';
	const json: any = await request(url);
	return {
		response_type: "in_channel",
		text: 'Here ya go!',
		attachments: [
			{
				image_url: json.message
			}
		]
	};
}

export async function list(): Promise<any> {
	const json: any = await request('/breeds/list');
	return {
		response_type: "in_channel",
		text: 'Here are all the dog breeds I know about!',
		attachments: [
			{
				text: json.message.join('\n')
			}
		]
	};
}