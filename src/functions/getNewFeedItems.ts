import Parser from 'rss-parser'

const parser = new Parser()

export const getNewFeedItems = async (feedUrl: string): Promise<Parser.Item[]> => {
  const { items: newFeedItems } = await parser.parseURL(feedUrl)
  return newFeedItems;
}
