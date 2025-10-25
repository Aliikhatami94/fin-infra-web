"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  collaborationThreads as mockThreads,
  workspaceNotifications as mockNotifications,
  workspaceTasks as mockTasks,
  workspaces as mockWorkspaces,
} from "@/lib/mock"
import type {
  AccountabilityTask,
  CollaborationEntityType,
  CollaborationThread,
  WorkspaceMember,
  WorkspaceNotification,
  WorkspaceSummary,
} from "@/types/domain"

type AssignmentMap = Record<string, string | null>

interface WorkspaceContextValue {
  workspaces: WorkspaceSummary[]
  activeWorkspace: WorkspaceSummary
  activeMember: WorkspaceMember
  selectWorkspace: (workspaceId: string) => void
  notifications: WorkspaceNotification[]
  unreadCount: number
  markNotificationRead: (notificationId: string) => void
  markChannelAsRead: (channel: WorkspaceNotification["channel"], workspaceId?: string) => void
  tasks: AccountabilityTask[]
  updateTaskStatus: (taskId: string, status: AccountabilityTask["status"]) => void
  snoozeTask: (taskId: string, snoozedUntil: string | null) => void
  dismissTask: (taskId: string, dismissed: boolean) => void
  assignEntity: (entityType: CollaborationEntityType, entityId: string, memberId: string | null) => void
  getAssignee: (entityType: CollaborationEntityType, entityId: string) => WorkspaceMember | null
  threads: CollaborationThread[]
  getThread: (entityType: CollaborationEntityType, entityId: string) => CollaborationThread | undefined
  addComment: (threadId: string, body: string, mentions: string[]) => void
}

const STORAGE_KEYS = {
  workspace: "workspace:selected",
  assignments: "workspace:assignments",
  tasks: "workspace:tasks",
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

const getAssignmentKey = (entityType: CollaborationEntityType, entityId: string) => `${entityType}:${entityId}`

const getInitialAssignments = (): AssignmentMap => {
  if (typeof window === "undefined") return {}
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.assignments)
    if (!stored) return {}
    return JSON.parse(stored) as AssignmentMap
  } catch {
    return {}
  }
}

const getInitialTasks = (): AccountabilityTask[] => {
  if (typeof window === "undefined") return mockTasks
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.tasks)
    if (!stored) return mockTasks
    const parsed = JSON.parse(stored) as AccountabilityTask[]
    if (!Array.isArray(parsed)) return mockTasks
    return parsed
  } catch {
    return mockTasks
  }
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaceId, setWorkspaceId] = useState<string>(() => {
    if (typeof window === "undefined") return mockWorkspaces[0]?.id ?? "default"
    return window.localStorage.getItem(STORAGE_KEYS.workspace) ?? mockWorkspaces[0]?.id ?? "default"
  })

  const [assignments, setAssignments] = useState<AssignmentMap>(() => getInitialAssignments())
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>(() => mockNotifications)
  const [threads, setThreads] = useState<CollaborationThread[]>(() => mockThreads)
  const [tasks, setTasks] = useState<AccountabilityTask[]>(() => getInitialTasks())

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.workspace, workspaceId)
  }, [workspaceId])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments))
  }, [assignments])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks))
  }, [tasks])

  const workspaces = useMemo(() => mockWorkspaces, [])

  useEffect(() => {
    if (!workspaces.some((workspace) => workspace.id === workspaceId)) {
      setWorkspaceId(workspaces[0]?.id ?? "default")
    }
  }, [workspaces, workspaceId])

  const activeWorkspace = useMemo(() => {
    return workspaces.find((workspace) => workspace.id === workspaceId) ?? workspaces[0] ?? mockWorkspaces[0]
  }, [workspaceId, workspaces])

  const activeMember = useMemo(() => {
    const fallback = activeWorkspace.members[0]
    return activeWorkspace.members.find((member) => member.role === "owner" || member.role === "co-owner") ?? fallback
  }, [activeWorkspace])

  const selectWorkspace = useCallback((id: string) => {
    setWorkspaceId(id)
  }, [])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread && notification.workspaceId === activeWorkspace.id).length,
    [activeWorkspace.id, notifications],
  )

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, unread: false } : notification,
      ),
    )
  }, [])

  const markChannelAsRead = useCallback(
    (channel: WorkspaceNotification["channel"], workspaceOverride?: string) => {
      setNotifications((current) =>
        current.map((notification) => {
          const belongsToWorkspace = workspaceOverride
            ? notification.workspaceId === workspaceOverride
            : true
          if (notification.channel === channel && belongsToWorkspace) {
            return { ...notification, unread: false }
          }
          return notification
        }),
      )
    },
    [],
  )

  const updateTaskStatus = useCallback((taskId: string, status: AccountabilityTask["status"]) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }, [])

  const snoozeTask = useCallback((taskId: string, snoozedUntil: string | null) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, snoozedUntil, status: snoozedUntil ? "pending" : task.status } : task)),
    )
  }, [])

  const dismissTask = useCallback((taskId: string, dismissed: boolean) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, dismissedAt: dismissed ? new Date().toISOString() : null } : task)),
    )
  }, [])

  const assignEntity = useCallback(
    (entityType: CollaborationEntityType, entityId: string, memberId: string | null) => {
      setAssignments((current) => ({ ...current, [getAssignmentKey(entityType, entityId)]: memberId }))
    },
    [],
  )

  const getAssignee = useCallback(
    (entityType: CollaborationEntityType, entityId: string) => {
      const memberId = assignments[getAssignmentKey(entityType, entityId)]
      if (!memberId) return null
      return activeWorkspace.members.find((member) => member.id === memberId) ?? null
    },
    [activeWorkspace.members, assignments],
  )

  const getThread = useCallback(
    (entityType: CollaborationEntityType, entityId: string) =>
      threads.find((thread) => thread.entityType === entityType && thread.entityId === entityId),
    [threads],
  )

  const addComment = useCallback(
    (threadId: string, body: string, mentions: string[]) => {
      setThreads((current) => {
        const timestamp = new Date().toISOString()
        return current.map((thread) => {
          if (thread.id !== threadId) return thread
          const newComment = {
            id: `${threadId}-${Date.now()}`,
            authorId: activeMember.id,
            body,
            createdAt: timestamp,
            mentions,
          }
          return {
            ...thread,
            comments: [...thread.comments, newComment],
            lastUpdated: "Just now",
            watchers: Array.from(new Set([...thread.watchers, activeMember.id, ...mentions])),
          }
        })
      })
    },
    [activeMember.id],
  )

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      activeWorkspace,
      activeMember,
      selectWorkspace,
      notifications,
      unreadCount,
      markNotificationRead,
      markChannelAsRead,
      tasks,
      updateTaskStatus,
      snoozeTask,
      dismissTask,
      assignEntity,
      getAssignee,
      threads,
      getThread,
      addComment,
    }),
    [
      workspaces,
      activeWorkspace,
      activeMember,
      selectWorkspace,
      notifications,
      unreadCount,
      markNotificationRead,
      markChannelAsRead,
      tasks,
      updateTaskStatus,
      snoozeTask,
      dismissTask,
      assignEntity,
      getAssignee,
      threads,
      getThread,
      addComment,
    ],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
