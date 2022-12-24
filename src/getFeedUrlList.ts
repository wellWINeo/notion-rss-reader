import { Client } from '@notionhq/client'

export const getFeedUrlList = async (): Promise<string[]> => {
  const notion = new Client({ auth: process.env.NOTION_KEY })
  const feederDatabaseId = process.env.NOTION_FEEDER_DATABASE_ID || ''

  const response = await notion.databases.query({
    database_id: feederDatabaseId,
  })

  const feedUrlList = response.results.filter(
    (result: any) => result.properties.Enable.checkbox
  )

  return feedUrlList.map((result: any) => result.properties.Link.url as string)
}
