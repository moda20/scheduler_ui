import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ProxyTableData } from "@/models/proxies"
import moment from "moment"
import ProxyListActionDropdown from "@/components/custom/system/ProxyListActionDropdown"
import type { ProxyActions } from "@/models/proxies"
import type { ProxyConfigUpdateType } from "@/components/custom/system/ProxyConfigDialog"
import { ProxyStatus } from "@/models/proxies"
import type { ComboBoxItem } from "@/components/ui/combo-box"

export interface ProxyTableInterfaceProps {
  proxyAction: (
    action: ProxyActions,
    row?: Row<ProxyTableData>,
    proxyData?: ProxyConfigUpdateType,
  ) => void
  getAllJobs: () => Promise<ComboBoxItem[]>
}

export default function proxyTableInterfaces(
  props: ProxyTableInterfaceProps,
): ColumnDef<ProxyTableData>[] {
  return [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "proxy_ip",
      header: "Proxy ip",
    },
    {
      accessorKey: "proxy_port",
      header: "Proxy port",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "created_at",
      header: "Created at",
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {moment(row.original?.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div className="text-left">
            {row.original?.status === ProxyStatus.ACTIVE
              ? "Active"
              : "Inactive"}
          </div>
        )
      },
    },
    {
      accessorKey: "JobsLinkedTo",
      header: "N. of Jobs Using",
      cell: ({ row }) => {
        return (
          <div className="text-left">{row.original?.jobs?.length ?? 0}</div>
        )
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <ProxyListActionDropdown row={row} columnsProps={props} />
      },
    },
  ]
}
