"use client"

import { useSession, signIn } from "next-auth/react"
import { useEffect, useState, useCallback, useRef } from "react"
import { SpotifyApi, Track, AudioFeatures as AudioFeaturesType } from "@spotify/web-api-ts-sdk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TrackDetails from "./TrackDetails"
import AudioFeatures from "./AudioFeatures"
import Image from 'next/image'
import GenresCard from "./GenresCard"
import { RefreshCw } from "lucide-react"

// Add this type declaration at the top of your file
declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
  }
}

// Add this function before the NowPlaying component
const fetchWithRetry = async <T,>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(fn, retries - 1);
    }
    throw error;
  }
};

export default function NowPlaying() {
  const { data: session, status } = useSession()
  const [track, setTrack] = useState<Track | null>(null)
  const [trackDetails, setTrackDetails] = useState<Track | null>(null)
  const [audioFeatures, setAudioFeatures] = useState<AudioFeaturesType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [spotify, setSpotify] = useState<SpotifyApi | null>(null)
  const lastFetchTime = useRef(0)
  const [artistGenres, setArtistGenres] = useState<string[]>([])

  const fetchNowPlaying = useCallback(async () => {
    const now = Date.now()
    if (spotify && now - lastFetchTime.current >= 5000) {
      lastFetchTime.current = now
      try {
        const response = await fetchWithRetry(() => spotify.player.getCurrentlyPlayingTrack())
        if (response?.item?.type === 'track') {
          const newTrack = response.item as Track
          setTrack(newTrack)
          
          // Fetch track details, audio features, and artist genres in a single batch request
          const [details, features, artists] = await fetchWithRetry(() => 
            Promise.all([
              spotify.tracks.get(newTrack.id),
              spotify.tracks.audioFeatures(newTrack.id),
              spotify.artists.get(newTrack.artists.map(artist => artist.id))
            ])
          )
          setTrackDetails(details)
          setAudioFeatures(features)
          const genres = Array.from(new Set(artists.flatMap(artist => artist.genres)))
          setArtistGenres(genres)
        } else {
          setTrack(null)
          setTrackDetails(null)
          setAudioFeatures(null)
          setArtistGenres([])
        }
        setError(null)
      } catch (error) {
        console.error("Error fetching now playing:", error)
        setError("Failed to fetch currently playing track. You may need to re-authenticate.")
        setTrack(null)
        setTrackDetails(null)
        setAudioFeatures(null)
        setArtistGenres([])
      }
    }
  }, [spotify])

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const spotifyApi = SpotifyApi.withAccessToken(
        process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
        {
          access_token: session.accessToken as string,
          token_type: "Bearer",
          expires_in: 2592000,
          refresh_token: session.refreshToken as string
        }
      )
      setSpotify(spotifyApi)
    }
  }, [session, status])

  useEffect(() => {
    if (spotify) {
      fetchNowPlaying()
      const interval = setInterval(fetchNowPlaying, 5000)
      return () => clearInterval(interval)
    }
  }, [spotify, fetchNowPlaying])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchNowPlaying()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchNowPlaying])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to view your currently playing track</div>
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Button onClick={() => signIn("spotify")}>Re-authenticate with Spotify</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <Button onClick={fetchNowPlaying} className="mb-4">
        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
      </Button>
      <div className="space-y-4">
        <Card className="w-full md:w-[350px]">
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
            <CardDescription>Your current Spotify track</CardDescription>
          </CardHeader>
          <CardContent>
            {track ? (
              <div className="flex items-center space-x-4">
                {track.album.images[0] && (
                  <Image src={track.album.images[0].url} alt={track.name} width={64} height={64} className="rounded" />
                )}
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-gray-500">{track.artists.map((a) => a.name).join(", ")}</p>
                </div>
              </div>
            ) : (
              <p>No track currently playing</p>
            )}
          </CardContent>
        </Card>
        {trackDetails && <TrackDetails track={trackDetails} />}
      </div>
      <div className="space-y-4">
        {audioFeatures && <AudioFeatures features={audioFeatures} />}
        <GenresCard genres={artistGenres} />
      </div>
    </div>
  )
}