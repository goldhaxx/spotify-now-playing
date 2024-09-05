import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type AudioFeaturesProps = {
  features: SpotifyApi.AudioFeaturesObject
}

export default function AudioFeatures({ features }: AudioFeaturesProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Audio Features</CardTitle>
        <CardDescription>Detailed audio analysis of the track</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li><strong>Danceability:</strong> {(features.danceability * 100).toFixed(0)}%</li>
          <li><strong>Energy:</strong> {(features.energy * 100).toFixed(0)}%</li>
          <li><strong>Acousticness:</strong> {(features.acousticness * 100).toFixed(0)}%</li>
          <li><strong>Instrumentalness:</strong> {(features.instrumentalness * 100).toFixed(0)}%</li>
          <li><strong>Liveness:</strong> {(features.liveness * 100).toFixed(0)}%</li>
          <li><strong>Valence:</strong> {(features.valence * 100).toFixed(0)}%</li>
          <li><strong>Tempo:</strong> {features.tempo.toFixed(0)} BPM</li>
          <li><strong>Key:</strong> {features.key}</li>
          <li><strong>Mode:</strong> {features.mode === 1 ? 'Major' : 'Minor'}</li>
          <li><strong>Time Signature:</strong> {features.time_signature}/4</li>
        </ul>
      </CardContent>
    </Card>
  )
}