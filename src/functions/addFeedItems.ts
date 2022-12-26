import { Client } from '@notionhq/client'
import { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import nmp from "node-meta-parser"
import Parser from 'rss-parser'
import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any

export const addFeedItems = async (
  newFeedItems: {
    [key: string]: TODO
  }[]
) => {
  const notion = new Client({ auth: process.env.NOTION_KEY })
  const databaseId = process.env.NOTION_READER_DATABASE_ID || ''

  newFeedItems.forEach(async (item: Parser.Item) => {
    
    const { title, link, content, enclosure, isoDate } = item
    const domain = link?.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)

    const properties: TODO = {
      Title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      URL: {
        url: link,
      },
      Domain: {
        select: {
          name: domain ? domain.at(1) : null,
        },
      },
      'Created At': {
        date: {
          start: isoDate
        }
      },
    }

    const { data: rawHtml } = await axios.get(link!, { headers: { "Accept-Encoding": "gzip,deflate,compress" } }) 
    const ogpImage = nmp.parseMetadata(rawHtml, ['og:image'])['og:image']

    const children: CreatePageParameters['children'] = []

    if (enclosure || ogpImage) {
      children.push({
        type: 'image',
        image: {
          type: 'external',
          external: {
            url: enclosure ? enclosure.url : ogpImage!
          }
        }
      })
    }

    if (content) {
      children.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              text: {
                content: content
              }
            }
          ]
        }
      })
    }

    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties,
        children,
      })
    } catch (error) {
      console.error(error)
    }
  })
}
