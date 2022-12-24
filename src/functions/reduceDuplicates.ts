import Parser from "rss-parser";
import { FeedItem } from "../models/feedItem";

export const reduceDuplicates = (rssFeed: Parser.Item[], databaseFeed: FeedItem[]): Parser.Item[] => {
    return rssFeed.filter(rss => !databaseFeed.some(e => e.url == rss.link))
}