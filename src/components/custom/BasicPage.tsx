import type { PropsWithChildren } from "react"

export interface BasicPageProps extends PropsWithChildren {
  title: string
  description: string
}
export default function BasicPage(props: BasicPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={"flex flex-col gap-1 mb-4"}>
        <h2 className="text-2xl font-bold tracking-tight">{props.title}</h2>
        <p className="text-md font-light">{props.description}</p>
      </div>
      <div className={"page-content"}>{props.children}</div>
    </div>
  )
}
