import { IHttp } from '@rocket.chat/apps-engine/definition/accessors';
export async function scrapeWebPage(http: IHttp, url: string) {
	if (!url) {
		throw new Error('Please provide a valid URL.');
	}
	const API_KEY = '4d317457811fe369d2cd942d178ab86c';
	const scrapeUrl = `https://api.scraperapi.com/?api_key=${API_KEY}&url=${encodeURIComponent(url)}&render=true`;

	try {

		const response = await http.get(scrapeUrl);

		if (!response || !response.content) {
			throw new Error('Failed to fetch the webpage.');
		}
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
		return textContent;
	} catch (error: any) {
		throw new Error(`Error: ${error.message}`);
	}
}
