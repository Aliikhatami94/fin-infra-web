"use client"

import { Check, Share2, Users } from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"
import type { CollaborationEntityType } from "@/types/domain"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AssignmentMenuProps {
  entityId: string
  entityType: CollaborationEntityType
  size?: "sm" | "default"
  variant?: "ghost" | "outline" | "secondary"
  showLabel?: boolean
}

export function AssignmentMenu({
  entityId,
  entityType,
  size = "sm",
  variant = "outline",
  showLabel = true,
}: AssignmentMenuProps) {
  const { activeWorkspace, assignEntity, getAssignee } = useWorkspace()
  const assignee = getAssignee(entityType, entityId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="gap-2 rounded-full"
          aria-label={assignee ? `Assigned to ${assignee.name}` : "Assign to member"}
        >
          {assignee ? <Users className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {showLabel && (assignee ? assignee.name.split(" ")[0] : "Assign")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Assign to workspace member</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {activeWorkspace.members.map((member) => {
          const isActive = assignee?.id === member.id
          return (
            <DropdownMenuItem
              key={member.id}
              className="flex items-center gap-3"
              onClick={() => assignEntity(entityType, entityId, member.id)}
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback>{member.avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-tight">{member.name}</span>
                <span className="text-xs text-muted-foreground">{member.role}</span>
              </div>
              {isActive && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          )
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => assignEntity(entityType, entityId, null)}>Unassign</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
