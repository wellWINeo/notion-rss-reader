import Parser from 'rss-parser'

const parser = new Parser()

export const getNewFeedItems = async (feedUrl: string): Promise<Parser.Item[]> => {
  const { items: newFeedItems } = await parser.parseURL(feedUrl)
  return newFeedItems
    .sort((a, b) => new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime())
    .slice(0, 10)
}
