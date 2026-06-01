import { XMLParser } from "fast-xml-parser";

export interface Episode {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  audioUrl: string;
  duration?: string;
  imageUrl?: string;
  podcastName?: string;
  podcastId?: number;
}

export async function fetchEpisodesFromFeed(feedUrl: string, limit: number = 10): Promise<Episode[]> {
  try {
    const response = await fetch(feedUrl);
    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const jsonObj = parser.parse(xmlText);
    const channel = jsonObj?.rss?.channel;

    if (!channel) return [];

    // iTunes podcasts can have channel-level images
    const channelImage = channel.image?.url || channel["itunes:image"]?.["@_href"];
    const channelTitle = channel.title;

    let items = channel.item;
    if (!items) return [];

    // Normalize to array if it's a single item
    if (!Array.isArray(items)) {
      items = [items];
    }

    const episodes: Episode[] = items.slice(0, limit).map((item: any) => {
      // Find the audio URL (enclosure)
      let audioUrl = "";
      if (item.enclosure && item.enclosure["@_url"]) {
        audioUrl = item.enclosure["@_url"];
      } else if (item.enclosure && item.enclosure.url) {
        audioUrl = item.enclosure.url;
      }

      // Find the episode image
      const imageUrl = item["itunes:image"]?.["@_href"] || channelImage;

      // Extract duration
      const duration = item["itunes:duration"] || "";

      // Ensure we have an ID
      const id = item.guid?.["#text"] || item.guid || audioUrl;

      return {
        id: String(id),
        title: String(item.title || ""),
        description: typeof (item.description || item["itunes:summary"]) === 'string' 
          ? (item.description || item["itunes:summary"]) 
          : JSON.stringify(item.description || item["itunes:summary"] || ""),
        pubDate: String(item.pubDate || ""),
        audioUrl,
        duration: String(duration),
        imageUrl,
        podcastName: channelTitle,
      };
    });

    // Filter out items that don't have audio
    return episodes.filter((ep) => ep.audioUrl);
  } catch (error) {
    console.log("Error fetching feed:", feedUrl, error);
    return [];
  }
}
