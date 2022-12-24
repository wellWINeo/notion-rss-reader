import { getNotionClient } from '@/getNotionClient'

export const getFeedUrlList = async (): Promise<string[]> => {
  const notion = getNotionClient()
  const feederDatabaseId = process.env.NOTION_FEEDER_DATABASE_ID || ''

  const response = await notion.databases.query({
    database_id: feederDatabaseId,
  })

  const feedUrlList = response.results.filter(
    (result: any) => result.properties.Enable.checkbox
  )

  return feedUrlList.map((result: any) => result.properties.Link.url as string)
}
