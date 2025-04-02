import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class NewCommand implements ISlashCommand {
	public command = 'scrape'; 
	public i18nParamsExample = '[URL]';
	public i18nDescription = 'Fetch full webpage content using ScraperAPI';
	public providesPreview = false;

	private readonly API_KEY = '4d317457811fe369d2cd942d178ab86c';

	public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
		const [url] = context.getArguments();

		if (!url) {
			throw new Error('Please provide a valid URL.');
		}

		const scrapeUrl = `https://api.scraperapi.com/?api_key=${this.API_KEY}&url=${encodeURIComponent(url)}&render=true`;

		try {
			const response = await http.get(scrapeUrl);

			if (!response || !response.content) {
				throw new Error('Failed to fetch the webpage.');
			}

			const textContent = response.content.replace(/<[^>]*>/g, ' ').substring(1000, 2000); 

			await this.sendMessage(context, modify, `Scraped Content from ${url}:

${textContent}`);
		} catch (error: any) {
			await this.sendMessage(context, modify, `Error: ${error.message}`);
		}
	}

	private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
		const messageStructure = modify.getCreator().startMessage();
		const sender = context.getSender();
		const room = context.getRoom();

		messageStructure
			.setSender(sender)
			.setRoom(room)
			.setText(message);

		await modify.getCreator().finish(messageStructure);
	}
}
