import React, { useState, type CSSProperties } from "react"
import { Cpu, Thermometer, Power, Activity, Wifi, Sliders, Sidebar, Moon, Sun } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppSidebar } from "./components/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"

interface AppThemeProps {
  isDark: boolean
  setDark: (value: boolean) => void
}

export function AppTheme({isDark, setDark} : AppThemeProps) {
  return(
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setDark(!isDark)}
      title={isDark ? "Light Theme" : "Dark Theme"}
      >
      {isDark ? <Sun/> : <Moon/>}
    </Button>
  )
}

export function App() {
  // Пока используем локальное состояние (Этап 2 нашего плана)
  const [relay1, setRelay1] = useState(true)
  const [relay2, setRelay2] = useState(false)
  const [fanSpeed, setFanSpeed] = useState([65])

  const [activeTab, setActiveTab] = useState("info")
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isDark, setDark] = useState(true)

  return (
    // Класс "dark" принудительно включает темную тему shadcn 
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-background text-foreground`}>
      <SidebarProvider
        style={
          { "--sidebar-width": `${sidebarWidth}px` } as CSSProperties
        }
      >
        <AppSidebar 
          activeTab={activeTab} 
          onSelectTab={setActiveTab}
          onResize={setSidebarWidth}
        />
        <aside className="flex flex-col p-2">
          <AppTheme isDark={isDark} setDark={setDark}/>
          <SidebarTrigger title="Collapse sidebar"/>
        </aside>
        

        {/* Боковое меню в стиле Doxygen Awesome
        <aside className="w-64 border-r border-border bg-card/50 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-border">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="font-semibold tracking-tight text-lg">DeviceOS v1.4</span>
            </div>

            <nav className="space-y-1">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Activity className="h-4 w-4" />
                Обзор системы
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                <Sliders className="h-4 w-4" />
                Конфигурация
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground">
                <Wifi className="h-4 w-4" />
                Сеть и MQTT
              </Button>
            </nav>
          </div>

          <div className="text-xs text-muted-foreground border-t border-border pt-4 px-2 font-mono">
            IP: 192.168.1.104<br />
            Uptime: 14d 06h 22m
          </div>
        </aside> */}

        {/* Основная рабочая область */}
        <main className="flex-1 p-8 max-w-5xl">
          {/* Шапка */}
          <header className="flex items-center justify-between mb-8 pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Контроллер узла #01</h1>
              <p className="text-sm text-muted-foreground">Мониторинг телеметрии и управление нагрузкой</p>
            </div>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10 px-3 py-1">
              ● Online
            </Badge>
          </header>

          {/* Сетка карточек */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Карточка 1: Телеметрия */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">Температура ядра</CardTitle>
                  <CardDescription>Датчик DS18B20 (Шина 1-Wire)</CardDescription>
                </div>
                <Thermometer className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-mono tracking-tight">42.8 °C</div>
                <p className="text-xs text-muted-foreground mt-1">Нормальный рабочий диапазон (до 75 °C)</p>
              </CardContent>
            </Card>

            {/* Карточка 2: Управление охлаждением (Слайдер) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">ШИМ Вентилятора</CardTitle>
                  <CardDescription>Канал PWM-1 (25 кГц)</CardDescription>
                </div>
                <span className="font-mono text-sm font-semibold text-primary">{fanSpeed[0]}%</span>
              </CardHeader>
              <CardContent className="pt-4">
                <Slider
                  value={fanSpeed}
                  onValueChange={setFanSpeed}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2 font-mono">
                  <span>0% (Стоп)</span>
                  <span>50%</span>
                  <span>100% (Макс)</span>
                </div>
              </CardContent>
            </Card>

            {/* Карточка 3: Управление реле (Тумблеры) */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Power className="h-4 w-4 text-primary" />
                  Силовые каналы (Реле)
                </CardTitle>
                <CardDescription>Прямое управление дискретными выходами GPIO</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">Канал 1 — Основное питание</div>
                    <div className="text-xs text-muted-foreground font-mono">GPIO_14 • Нагрузка: 1.2 А</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={relay1 ? "default" : "secondary"}>
                      {relay1 ? "ВКЛ" : "ВЫКЛ"}
                    </Badge>
                    <Switch checked={relay1} onCheckedChange={setRelay1} />
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">Канал 2 — Подсветка шкафа</div>
                    <div className="text-xs text-muted-foreground font-mono">GPIO_15 • Нагрузка: 0.0 А</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={relay2 ? "default" : "secondary"}>
                      {relay2 ? "ВКЛ" : "ВЫКЛ"}
                    </Badge>
                    <Switch checked={relay2} onCheckedChange={setRelay2} />
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default App
