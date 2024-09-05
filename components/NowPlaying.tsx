"use client"

import { useSession, signIn } from "next-auth/react"
import { useEffect, useState } from "react"
import { SpotifyApi, Track, AudioFeatures as AudioFeaturesType } from "@spotify/web-api-ts-sdk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import TrackDetails from "./TrackDetails"
import AudioFeatures from "./AudioFeatures"
import Image from 'next/image'
import GenresCard from "./GenresCard"

// Add this type declaration at the top of your file
declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
  }
}

export default function NowPlaying() {
  const { data: session, status } = useSession()
  const [track, setTrack] = useState<Track | null>(null)
  const [trackDetails, setTrackDetails] = useState<Track | null>(null)
  const [audioFeatures, setAudioFeatures] = useState<AudioFeaturesType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [spotify, setSpotify] = useState<SpotifyApi | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const spotifyApi = SpotifyApi.withAccessToken(
        process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
        {
          access_token: session.accessToken as string,
          token_type: "Bearer",
          expires_in: 2592000, // Adjust this value based on your token's expiration
          refresh_token: session.refreshToken as string
        }
      )
      setSpotify(spotifyApi)
      
      const fetchNowPlaying = async () => {
        try {
          const response = await spotify?.player.getCurrentlyPlayingTrack() ?? null
          if (response?.item?.type === 'track') {
            setTrack(response.item as Track)
            // Fetch additional track details
            const details = await spotify?.tracks.get(response.item.id) ?? null
            setTrackDetails(details)
            // Fetch audio features
            const features = await spotify?.tracks.audioFeatures(response.item.id) ?? null
            setAudioFeatures(features)
          } else {
            setTrack(null)
            setTrackDetails(null)
            setAudioFeatures(null)
          }
          setError(null)
        } catch (error) {
          console.error("Error fetching now playing:", error)
          setError("Failed to fetch currently playing track. You may need to re-authenticate.")
          setTrack(null)
          setTrackDetails(null)
          setAudioFeatures(null)
        }
      }

      fetchNowPlaying()
      const interval = setInterval(fetchNowPlaying, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [session, status])

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

  if (!track) {
    return <div>No track currently playing</div>
  }

  return (
    <div className="flex space-x-4">
      <div className="space-y-4">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Now Playing</CardTitle>
            <CardDescription>Your current Spotify track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {track && track.album.images[0] && (
                <Image src={track.album.images[0].url} alt={track.name} width={64} height={64} className="rounded" />
              )}
              <div>
                <p className="font-semibold">{track?.name}</p>
                <p className="text-sm text-gray-500">{track?.artists.map((a) => a.name).join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {trackDetails && <TrackDetails track={trackDetails} />}
      </div>
      <div className="space-y-4">
        {audioFeatures && <AudioFeatures features={audioFeatures} />}
        <GenresCard spotify={spotify} currentTrack={track} />
      </div>
    </div>
  )
}