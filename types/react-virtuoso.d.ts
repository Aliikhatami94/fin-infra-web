declare module "react-virtuoso" {
  import type {
    CSSProperties,
    ComponentType,
    Key,
    ReactElement,
    ReactNode,
  } from "react"

  export interface VirtuosoProps<TData = any> {
    data?: readonly TData[]
    itemContent?: (index: number, item: TData) => ReactNode
    overscan?: number
    computeItemKey?: (index: number, item: TData) => Key
    className?: string
    style?: CSSProperties
  }

  export const Virtuoso: <TData = any>(
    props: VirtuosoProps<TData>,
  ) => ReactElement | null

  export interface TableComponents<TData = any> {
    Scroller?: ComponentType
    Table?: ComponentType
    TableHead?: ComponentType
    TableBody?: ComponentType
    TableRow?: ComponentType<{ item: TData }>
    TableFoot?: ComponentType
  }

  export interface TableVirtuosoProps<TData = any> {
    data?: readonly TData[]
    components?: TableComponents<TData>
    fixedHeaderContent?: (index: number) => ReactNode
    itemContent?: (index: number, item: TData) => ReactNode
    computeItemKey?: (index: number, item: TData) => Key
    className?: string
    style?: CSSProperties
  }

  export const TableVirtuoso: <TData = any>(
    props: TableVirtuosoProps<TData>,
  ) => ReactElement | null
}
