import { getNotionClient } from "@/getNotionClient"

export const removeFeedItem = async (id: string) => {
    const client = getNotionClient()
    await client.pages.update({ page_id: id, archived: true });
}