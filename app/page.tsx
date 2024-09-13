import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/options"
import { Separator } from "@/components/ui/separator"
import HomeContent from "@/components/HomeContent"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="header-title">
        <h1 className="text-4xl font-bold text-center">Deep Track Inspect</h1>
      </div>
      <Separator className="my-8 w-full max-w-md" />
      <HomeContent session={session} />
    </main>
  )
}