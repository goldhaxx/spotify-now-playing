"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { SpotifyApi } from "@spotify/web-api-ts-sdk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TrackDetails from "./TrackDetails"
import AudioFeatures from "./AudioFeatures"

export default function NowPlaying() {
  const { data: session, status } = useSession()
  const [track, setTrack] = useState<any>(null)
  const [trackDetails, setTrackDetails] = useState<any>(null)
  const [audioFeatures, setAudioFeatures] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      const spotify = SpotifyApi.withAccessToken(
        process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
        { access_token: session.accessToken as string, token_type: "Bearer", expires_in: 3600 }
      )
      
      const fetchNowPlaying = async () => {
        try {
          const response = await spotify.player.getCurrentlyPlayingTrack()
          if (response && response.item) {
            setTrack(response.item)
            // Fetch additional track details
            const details = await spotify.tracks.get(response.item.id)
            setTrackDetails(details)
            // Fetch audio features
            const features = await spotify.tracks.audioFeatures(response.item.id)
            setAudioFeatures(features)
          } else {
            setTrack(null)
            setTrackDetails(null)
            setAudioFeatures(null)
          }
          setError(null)
        } catch (error) {
          console.error("Error fetching now playing:", error)
          setError("Failed to fetch currently playing track")
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
    return <div>{error}</div>
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
              <img src={track.album.images[0].url} alt={track.name} className="w-16 h-16 rounded" />
              <div>
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-gray-500">{track.artists.map((a: any) => a.name).join(", ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {trackDetails && <TrackDetails track={trackDetails} />}
      </div>
      <div>
        {audioFeatures && <AudioFeatures features={audioFeatures} />}
      </div>
    </div>
  )
}