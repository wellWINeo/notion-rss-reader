import { FeedItem } from "@/models/feedItem";
import { removeFeedItem } from "./removeFeedItem";

export const purgeFeedItems =async (items:FeedItem[]) => {
    const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
    const twoWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 14))

    items.forEach(async item => {
        if ((!item.starred && !item.read && item.createdAt <= monthAgo) ||
            (!item.starred && item.read && item.createdAt <= twoWeeksAgo))
            await removeFeedItem(item.id);
    })
}