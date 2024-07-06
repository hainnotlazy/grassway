export enum TagIcon {
  NONE = "none",
  WORK = "work",
  PERSONAL = "personal",
  IMPORTANT = "important",
  EVENTS = "events",
  PROJECTS = "projects",
}

export interface Tag {
  id: number
  name: string
  icon: string,
  description: string
  created_at?: Date
  updated_at?: Date
}
