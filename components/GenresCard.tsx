import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface GenresCardProps {
  genres: string[];
}

export default function GenresCard({ genres }: GenresCardProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Artist Genres</CardTitle>
        <CardDescription>Genres of the currently playing artists</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
