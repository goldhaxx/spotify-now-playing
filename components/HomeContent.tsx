'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import NowPlaying from "@/components/NowPlaying"
import { LyricsCard } from "@/components/LyricsCard"

export default function HomeContent({ session }: { session: any }) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyApi.TrackObjectFull | null>(null);

  return (
    <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between">
      <div className="flex-1">
        {session ? (
          <NowPlaying onTrackChange={setCurrentTrack} />
        ) : (
          <Button asChild>
            <a href="/api/auth/signin">Sign in with Spotify</a>
          </Button>
        )}
      </div>
      <div className="mt-8 md:mt-0 md:ml-8">
        {currentTrack && (
          <LyricsCard 
            trackName={currentTrack.name} 
            artistName={currentTrack.artists[0].name}
          />
        )}
      </div>
    </div>
  )
}