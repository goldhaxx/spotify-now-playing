import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/options"
import { Separator } from "@/components/ui/separator"
import HomeContent from "@/components/HomeContent"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-4">Deep Track Inspect</h1>
      <Separator className="mb-8 w-1/3" />
      <HomeContent session={session} />
    </main>
  )
}