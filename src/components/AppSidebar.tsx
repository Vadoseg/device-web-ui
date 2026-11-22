import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarRail
} from "@/components/ui/sidebar"
import { Info, Sliders } from "lucide-react"
import type React from "react"
import { useRef } from "react"

interface AppSidebarProps {
  activeTab: string
  onSelectTab: (tab: string) => void
  onResize?: (width: number) => void
}

export function AppSidebar({activeTab, onSelectTab, onResize}: AppSidebarProps){
  const isDragged = useRef(false)
  const { state } = useSidebar()

  const handleMouse = (e: React.MouseEvent) => {
    if (!onResize) return
    e.preventDefault()
    isDragged.current = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      isDragged.current = true
      const newWidth = Math.min(Math.max(moveEvent.clientX, 200), 450)
      onResize?.(newWidth)
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }
  
  return(
    <Sidebar collapsible="offcanvas" className="transition-none">
      <SidebarHeader>
        <span className="font-semibold tracking-tight text-lg text-center">Control Panel</span>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <nav>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab == "info"}
                onClick={() => onSelectTab("info")}
              >
                <Info className="h-4 w-4" />
                <span>Информация</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeTab == "settings"}
                onClick={() => onSelectTab("settings")}
                >
                  <Sliders className="h-4 w-4" />
                  <span>Настройки</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </nav>  
      </SidebarContent>

      {
        onResize && state == "expanded" && (
          <SidebarRail 
            className=""
            onMouseDown={handleMouse}
            onClickCapture={(e) => {
              if (isDragged.current)
                e.stopPropagation()
            }} 
          />
        )
      }
    </Sidebar>
  )
}