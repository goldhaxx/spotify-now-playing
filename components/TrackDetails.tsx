import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Track } from "@spotify/web-api-ts-sdk"

export default function TrackDetails({ track }: { track: Track }) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Track Details</CardTitle>
        <CardDescription>Additional information about the current track</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li><strong>Album:</strong> {track.album.name}</li>
          <li><strong>Release Date:</strong> {track.album.release_date}</li>
          <li>
            <strong>Popularity:</strong>{" "}
            <HoverCard>
              <HoverCardTrigger className="underline cursor-help">
                {track.popularity}/100
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p>
                  The popularity of a track is a value between 0 and 100, with 100 being the most popular. 
                  It's calculated by algorithm based on the total number of plays and how recent those plays are. 
                  Songs being played a lot now will have higher popularity than songs played a lot in the past. 
                  Note: This value may lag actual popularity by a few days.
                </p>
              </HoverCardContent>
            </HoverCard>
          </li>
          <li><strong>Duration:</strong> {Math.floor(track.duration_ms / 60000)}:{((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}</li>
          <li><strong>Explicit:</strong> {track.explicit ? 'Yes' : 'No'}</li>
          <li><strong>Track Number:</strong> {track.track_number}</li>
          {track.album.genres && track.album.genres.length > 0 && (
            <li><strong>Genres:</strong> {track.album.genres.join(', ')}</li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}