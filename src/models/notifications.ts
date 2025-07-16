export interface NotificationService {
  id?: number | string
  name: string
  description?: string
  entryPoint: string
  image?: string
  created_at: any
  updated_at: any
  jobs?: any[]
}
