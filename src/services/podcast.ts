export interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
  artworkUrl600: string;
  feedUrl?: string;
  genres?: string[];
}

const BASE_URL = "https://itunes.apple.com/search";

export async function searchPodcasts(
  term: string
): Promise<Podcast[]> {
  try {
    const response = await fetch(
      `${BASE_URL}?term=${encodeURIComponent(
        term
      )}&media=podcast&limit=25`
    );

    const data = await response.json();

    return cleanPodcasts(data.results);
  } catch (error) {
    console.log("Podcast search error:", error);
    return [];
  }
}

export async function getTrendingPodcasts(): Promise<
  Podcast[]
> {
  const searches = [
    "huberman lab",
    "lex fridman",
    "modern wisdom",
    "tim ferriss",
    "acquired",
    "science podcast",
    "technology podcast",
    "business podcast",
    "philosophy podcast",
    "ai podcast",
  ];

  try {
    const responses = await Promise.all(
      searches.map(async (term) => {
        const response = await fetch(
          `${BASE_URL}?term=${encodeURIComponent(
            term
          )}&media=podcast&limit=10`
        );

        return response.json();
      })
    );

    const merged = responses.flatMap(
      (res) => res.results
    );

    return cleanPodcasts(merged);
  } catch (error) {
    console.log(
      "Trending podcasts fetch error:",
      error
    );

    return [];
  }
}

function cleanPodcasts(
  podcasts: any[]
): Podcast[] {
  const uniqueMap = new Map();

  podcasts.forEach((podcast) => {
    if (
      podcast.collectionId &&
      !uniqueMap.has(podcast.collectionId)
    ) {
      uniqueMap.set(podcast.collectionId, {
        collectionId: podcast.collectionId,

        collectionName:
          podcast.collectionName,

        artistName:
          podcast.artistName,

        artworkUrl100:
          podcast.artworkUrl100,

        artworkUrl600:
          podcast.artworkUrl600 ||
          podcast.artworkUrl100?.replace(
            "100x100",
            "600x600"
          ),

        feedUrl: podcast.feedUrl,

        genres: podcast.genres || [],
      });
    }
  });

  return Array.from(uniqueMap.values());
}