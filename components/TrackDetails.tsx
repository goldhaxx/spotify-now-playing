import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
          <li><strong>Popularity:</strong> {track.popularity}/100</li>
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