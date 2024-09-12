import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link';

interface LyricsCardProps {
  trackName: string;
  artistName: string;
}

export function LyricsCard({ trackName, artistName }: LyricsCardProps) {
  const [geniusData, setGeniusData] = useState<{ id: string, path: string } | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeniusData = async () => {
      if (!trackName || !artistName) {
        console.log("Missing track or artist name, skipping Genius API call");
        return;
      }

      setIsLoading(true);
      setError(null);

      const searchQuery = `${trackName} ${artistName}`;
      console.log("Searching Genius for:", searchQuery);

      try {
        const searchResponse = await fetch(`/api/genius?q=${encodeURIComponent(searchQuery)}`);
        const searchData = await searchResponse.json();

        if (searchResponse.ok && searchData.id) {
          const detailsResponse = await fetch(`/api/genius?id=${searchData.id}`);
          const detailsData = await detailsResponse.json();

          if (detailsResponse.ok && detailsData.id && detailsData.path) {
            setGeniusData({ id: detailsData.id, path: detailsData.path });
            fetchLyrics(detailsData.id);
          } else {
            setError('Failed to fetch Genius song details');
          }
        } else {
          setError(searchData.error || 'Failed to fetch Genius ID');
        }
      } catch (err) {
        console.error("Error fetching from Genius API:", err);
        setError('An error occurred while fetching the Genius data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLyrics = async (id: string) => {
      try {
        const response = await fetch(`https://genius.com/songs/${id}/embed.js`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsContent = await response.text();
        console.log("Fetched content:", jsContent.substring(0, 200) + "..."); // Log the first 200 characters

        const lyricsMatch = jsContent.match(/JSON\.parse\('(.*?)'\)/);
        if (lyricsMatch && lyricsMatch[1]) {
          let decodedLyrics;
          try {
            decodedLyrics = JSON.parse(lyricsMatch[1].replace(/\\(.)/g, "$1"));
          } catch (jsonError) {
            console.error("JSON parsing error:", jsonError);
            // Attempt to clean the JSON string before parsing
            const cleanedJSON = lyricsMatch[1].replace(/\\(.)/g, "$1").replace(/[\u0000-\u001F]+/g, "");
            decodedLyrics = JSON.parse(cleanedJSON);
          }
          
          console.log("Decoded lyrics:", decodedLyrics.substring(0, 200) + "..."); // Log the first 200 characters

          const strippedLyrics = decodedLyrics
            .replace(/<[^>]*>/g, '')
            .replace(/^\s+|\s+$/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
          console.log("Stripped lyrics:", strippedLyrics.substring(0, 200) + "..."); // Log the first 200 characters

          setLyrics(strippedLyrics);
        } else {
          console.error("Failed to match lyrics in content");
          setError('Failed to extract lyrics from embed');
        }
      } catch (err) {
        console.error("Error fetching lyrics:", err);
        setError(`An error occurred while fetching the lyrics: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    fetchGeniusData();
  }, [trackName, artistName]);

  return (
    <Card className="w-full md:w-[350px]">
      <CardHeader>
        <CardTitle>Lyrics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading lyrics information...</p>}
        {error && (
          <div>
            <p>Error: {error}</p>
            <p className="text-xs mt-2">Please try refreshing the page. If the problem persists, the lyrics may be temporarily unavailable.</p>
          </div>
        )}
        {lyrics ? (
          <div>
            <p className="text-xs whitespace-pre-wrap">{lyrics.slice(0, 900)}...</p>
            {geniusData && <Link href={`https://genius.com${geniusData.path}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-2 block">View full lyrics on Genius</Link>}
          </div>
        ) : (
          <p>No lyrics found for this track.</p>
        )}
      </CardContent>
    </Card>
  );
}