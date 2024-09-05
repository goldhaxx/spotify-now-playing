import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/options"
import NowPlaying from "@/components/NowPlaying"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Spotify Now Playing</h1>
      {session ? (
        <NowPlaying />
      ) : (
        <Button asChild>
          <a href="/api/auth/signin">Sign in with Spotify</a>
        </Button>
      )}
    </main>
  )
}