import { getNewFeedItems } from '@/getNewFeedItems'
import { getFeedUrlList } from '@/getFeedUrlList'
import { addFeedItems } from '@/addFeedItems'
import dotenv from 'dotenv'
import { getFeedItemsList } from './getFeedItemsList'
import { reduceDuplicates } from './reduceDuplicates'
dotenv.config()

async function index() {
  const feedUrlList = await getFeedUrlList()
  const feedItems = await getFeedItemsList()
  feedUrlList.forEach(async (feedUrl: string) => {
    if (feedUrl) {
      try {
        const rssItems = await getNewFeedItems(feedUrl)
        
        await addFeedItems(reduceDuplicates(rssItems, feedItems));
      } catch (error) {
        // TODO: Provide some kind of notification to the user.
        console.error(error)
      }
    }
  })
}

index()
