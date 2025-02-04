import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DatabaseBackup,
  FolderKanban,
  LucideDatabase,
  LucideDatabaseZap,
} from "lucide-react"
import { useEffect, useState } from "react"
import systemService from "@/services/SystemService"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export default function DatabaseDashboard() {
  const [dbInfo, setDbInfo] = useState<any>({})

  const getDbInfo = async () => {
    const dbInfo = await systemService.getDatabaseInformation()
    setDbInfo(dbInfo)
  }

  const backUpDb = () => {
    return systemService.downloadSchedulerDBBackupFile().then(() => {
      toast({
        title: "Backup finished successfully",
        duration: 1500,
      })
    })
  }

  useEffect(() => {
    getDbInfo()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className={"flex flex-col gap-1 mb-4"}>
        <h2 className="text-2xl font-bold tracking-tight">
          Database & Backups
        </h2>
        <p className="text-md font-light">
          Manage the scheduler database, backups, restorations, etc.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
        <Card className="border-border ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 text-foreground bg-background border-border rounded-t-xl">
            <CardTitle className="text-md font-medium">
              Database <b>{dbInfo?.databaseName}</b>
              <p className="text-sm font-mono italic">
                Managing the scheduler database
              </p>
            </CardTitle>
            <LucideDatabase />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul>
              <li className="my-2">
                <b>Host</b> : {dbInfo?.host}
              </li>
              <li className="my-2">
                <b>Database name</b> : {dbInfo?.databaseName}
              </li>
              <li className="my-2">
                <b>Size</b> : {dbInfo?.dbSize} MB
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-row justify-end gap-2">
            <Button onClick={() => backUpDb()}>
              <DatabaseBackup /> Backup
            </Button>

            <Button variant="outline">
              <LucideDatabaseZap /> Restore
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
