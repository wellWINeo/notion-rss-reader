import { Client } from "@notionhq/client"
import { FeedItem } from "./models/feedItem";

export const getFeedItemsList = async (): Promise<FeedItem[]> => {
    const notion = new Client({ auth: process.env.NOTION_KEY })
    const readerDatabaseId = process.env.NOTION_READER_DATABASE_ID || ''

    const response = await notion.databases.query({
        database_id: readerDatabaseId,
    });

    return response.results.map((e: any) => {
        return {
            url: e.properties.URL.url,
            createdAt: new Date(e.properties['Created At'].rich_text[0].plain_text),
            read: e.properties.Read.checkbox,
            title: e.properties.Title.title[0].text.content,
        }
    });
}