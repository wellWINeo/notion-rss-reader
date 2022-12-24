import { getNotionClient } from "@/getNotionClient";
import { FeedItem } from "../models/feedItem";

export const getFeedItemsList = async (): Promise<FeedItem[]> => {
    const notion = getNotionClient()
    const readerDatabaseId = process.env.NOTION_READER_DATABASE_ID || ''

    const response = await notion.databases.query({
        database_id: readerDatabaseId,
    });

    return response.results.map((e: any) => {
        return {
            id: e.id,
            url: e.properties.URL.url,
            createdAt: new Date(e.properties['Created At'].rich_text[0].plain_text),
            read: e.properties.Read.checkbox,
            starred: e.properties.Starred.checkbox,
            title: e.properties.Title.title[0].text.content,
        }
    });
}