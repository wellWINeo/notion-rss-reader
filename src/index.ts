import { addFeedItems } from '@/functions/addFeedItems'
import { getFeedItemsList } from './functions/getFeedItemsList'
import { getFeedUrlList } from './functions/getFeedUrlList'
import { getNewFeedItems } from './functions/getNewFeedItems'
import { reduceDuplicates } from './functions/reduceDuplicates'
import dotenv from 'dotenv'
import { purgeFeedItems } from './functions/purgeFeedItems'

dotenv.config()

async function index() {
  const feedUrlList = await getFeedUrlList()
  const feedItems = await getFeedItemsList()
  feedUrlList.forEach(async (feedUrl: string) => {
    if (feedUrl) {
      try {
        const rssItems = await getNewFeedItems(feedUrl)

        await addFeedItems(reduceDuplicates(rssItems, feedItems))
      } catch (error) {
        // TODO: Provide some kind of notification to the user.
        console.error(error)
      }
    }
  })

  await purgeFeedItems(feedItems)
}

export const handler = async () => {
  await index()

  return { code: 200 }
}