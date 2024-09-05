import { AudioFeatures as AudioFeaturesType } from "@spotify/web-api-ts-sdk"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

type AudioFeaturesProps = {
  features: AudioFeaturesType
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
          <FeatureItem
            label="Danceability"
            value={`${(features.danceability * 100).toFixed(0)}%`}
            description="Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
          />
          <FeatureItem
            label="Energy"
            value={`${(features.energy * 100).toFixed(0)}%`}
            description="Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy."
          />
          <FeatureItem
            label="Acousticness"
            value={`${(features.acousticness * 100).toFixed(0)}%`}
            description="A confidence measure of whether the track is acoustic. 100% represents high confidence the track is acoustic."
          />
          <FeatureItem
            label="Instrumentalness"
            value={`${(features.instrumentalness * 100).toFixed(0)}%`}
            description="Predicts whether a track contains no vocals. The closer the instrumentalness value is to 100%, the greater likelihood the track contains no vocal content."
          />
          <FeatureItem
            label="Liveness"
            value={`${(features.liveness * 100).toFixed(0)}%`}
            description="Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live."
          />
          <FeatureItem
            label="Valence"
            value={`${(features.valence * 100).toFixed(0)}%`}
            description="A measure describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
          />
          <FeatureItem
            label="Tempo"
            value={`${features.tempo.toFixed(0)} BPM`}
            description="The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."
          />
          <FeatureItem
            label="Key"
            value={features.key.toString()}
            description="The key the track is in. Integers map to pitches using standard Pitch Class notation. E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on."
          />
          <FeatureItem
            label="Mode"
            value={features.mode === 1 ? 'Major' : 'Minor'}
            description="Mode indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived."
          />
          <FeatureItem
            label="Time Signature"
            value={`${features.time_signature}/4`}
            description="An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure)."
          />
        </ul>
      </CardContent>
    </Card>
  )
}

function FeatureItem({ label, value, description }: { label: string, value: string, description: string }) {
  return (
    <li>
      <strong>{label}:</strong>{" "}
      <HoverCard>
        <HoverCardTrigger className="underline cursor-help">
          {value}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <p>{description}</p>
        </HoverCardContent>
      </HoverCard>
    </li>
  )
}