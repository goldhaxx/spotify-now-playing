import { useEffect, useState } from 'react'
import { SpotifyApi, Track } from '@spotify/web-api-ts-sdk'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type GenresCardProps = {
  spotify: SpotifyApi | null
  currentTrack: Track | null
}

export default function GenresCard({ spotify, currentTrack }: GenresCardProps) {
  const [artistGenres, setArtistGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchArtistGenres = async () => {
      if (spotify && currentTrack) {
        try {
          const artistIds = currentTrack.artists.map(artist => artist.id)
          const artistsData = await spotify.artists.get(artistIds)
          
          const genres = artistsData.flatMap(artist => artist.genres)
          const uniqueGenres = Array.from(new Set(genres))
          setArtistGenres(uniqueGenres)
        } catch (error) {
          console.error('Error fetching artist genres:', error)
        }
      }
    }

    fetchArtistGenres()
  }, [spotify, currentTrack])

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Artist Genres</CardTitle>
        <CardDescription>Genres of the currently playing artists</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {artistGenres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
