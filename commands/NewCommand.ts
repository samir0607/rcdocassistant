import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
//import { scrapeWebPage } from '../scripts/scraper';

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

			await this.sendMessage(context, modify, "1");
			//scrapeWebPage(http, scrapeUrl);
			const response = await http.get(scrapeUrl);

			await this.sendMessage(context, modify, "2");


			if (!response || !response.content) {
				throw new Error('Failed to fetch the webpage.');
			}

			await this.sendMessage(context, modify, "3");
			
			const htmlContent = response.content;
			const textContent = htmlContent
				.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ') // Remove scripts
				.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')   // Remove styles
				.replace(/<\/(p|div|h[1-6]|li|br)>/gi, '\n')       // Replace closing tags with newlines
				.replace(/<\/?[^>]+(>|$)/g, '')                    // Remove remaining HTML tags
				.replace(/^\s+|\s+$/gm, '')                        // Trim lines
				.replace(/\n{2,}/g, '\n\n');                       // Reduce multiple new lines


			// const fs = require('fs');

			// fs.writeFileSync('output.txt', textContent, 'utf8');

			// console.log('Text written successfully.');


			await this.sendMessage(context, modify, `Scraped Text from ${url}: ${textContent.substring(0,1000)}...`);
		} catch (error: any) {
			await this.sendMessage(context, modify, `Error: ${error.text}`);
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
