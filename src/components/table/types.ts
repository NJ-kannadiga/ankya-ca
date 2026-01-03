export type TableColumn<T> = {
  key: keyof T
  label: string
  align?: "left" | "right"
  render?: (row: T) => React.ReactNode
}
