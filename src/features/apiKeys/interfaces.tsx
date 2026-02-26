import type { ColumnDef } from "@tanstack/react-table"
import type { ApiKeyTableData } from "@/models/apiKeys"
import moment from "moment"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import ConfirmationDialogAction, {
  ConfirmationDialogActionType,
} from "@/components/confirmationDialogAction"
import { useCallback } from "react"

export interface ApiKeyTableInterfaceProps {
  onDelete: (action: ConfirmationDialogActionType, keyId: string) => void
}

export default function apiKeyTableInterfaces(
  props: ApiKeyTableInterfaceProps,
): ColumnDef<ApiKeyTableData>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) => {
        if (!row.original?.created_at) return <div> unknown </div>
        return (
          <div
            className="text-left"
            title={moment(row.original?.created_at).format(
              "YYYY-MM-DD HH:mm:ss",
            )}
          >
            {moment(row.original?.created_at).fromNow()}
          </div>
        )
      },
    },
    {
      accessorKey: "lastUsedAt",
      header: "Last used",
      cell: ({ row }) => {
        if (!row.original?.lastUsedAt) return <div> Never </div>
        return (
          <div
            className="text-left"
            title={moment(row.original?.lastUsedAt).format(
              "YYYY-MM-DD HH:mm:ss",
            )}
          >
            {row.original?.lastUsedAt
              ? moment(row.original?.lastUsedAt).fromNow()
              : "Never"}
          </div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <ConfirmationDialogAction
            title={"Delete API Key"}
            description={`PERMANENT Action : This key will stop working the instant it's deleted, be sure to replace it`}
            takeAction={action => props.onDelete(action, row.original?.id)}
            confirmText={"Delete API Key"}
            confirmVariant={"destructive"}
          >
            <Button variant="destructive" size="icon" title="Delete API Key">
              <Trash2 className="h-4 w-4" />
            </Button>
          </ConfirmationDialogAction>
        )
      },
    },
  ]
}
