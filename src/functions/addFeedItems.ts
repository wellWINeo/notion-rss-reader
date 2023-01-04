import { Client } from '@notionhq/client'
import { BlockObjectRequest, CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
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
    
    const { title, link, contentSnippet, enclosure, isoDate } = item
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

    if (enclosure?.url && validateImageUrl(enclosure.url))
      children.push(getExternalImagePayload(enclosure.url))
    else if (ogpImage && validateImageUrl(ogpImage))
      children.push(getExternalImagePayload(ogpImage))

    if (contentSnippet) {
      children.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              text: {
                content: contentSnippet
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

const validateImageUrl = (url: string) => {
  const FORMATS = ['.png', '.jpg', '.jpeg', '.gif', '.tif', '.tiff', '.bmp', '.svg', '.heic']
  const lowerUrl = url.toLocaleLowerCase()
  return FORMATS.some(f => lowerUrl.endsWith(f))
}

const getExternalImagePayload = (url: string): BlockObjectRequest => {
  return {
    type: 'image',
    image: {
      type: 'external',
      external: {
        url: url
      }
    }
  }
}