"use client"

import { useSession } from "next-auth/react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  LogoutMenuItem,
} from "@/components/ui/menubar"
import { ThemeToggle } from "@/app/components/ThemeToggle"

export default function MenubarWithSession() {
  const { data: session } = useSession()

  return (
    <Menubar className="px-2 lg:px-4 flex justify-between">
      <div className="flex">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
            <MenubarItem>Redo</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Always Show Bookmarks Bar</MenubarItem>
            <MenubarItem>Always Show Full URLs</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Toggle Fullscreen</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      <div className="flex items-center space-x-2">
        {session && (
          <MenubarMenu>
            <MenubarTrigger>Account</MenubarTrigger>
            <MenubarContent>
              <LogoutMenuItem />
            </MenubarContent>
          </MenubarMenu>
        )}
        <ThemeToggle />
      </div>
    </Menubar>
  )
}