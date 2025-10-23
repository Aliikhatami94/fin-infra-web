"use client"

import { useMemo, useState } from "react"
import { MessageSquare, Send, AtSign, Users } from "lucide-react"

import { useWorkspace } from "@/components/workspace-provider"
import type { CollaborationEntityType } from "@/types/domain"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface CollaborationDrawerProps {
  entityId: string
  entityType: CollaborationEntityType
  entityName: string
  triggerLabel?: string
}

export function CollaborationDrawer({
  entityId,
  entityType,
  entityName,
  triggerLabel = "Discuss",
}: CollaborationDrawerProps) {
  const { activeWorkspace, getThread, addComment } = useWorkspace()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [mentionIds, setMentionIds] = useState<string[]>([])

  const thread = getThread(entityType, entityId)

  const availableMembers = useMemo(() => activeWorkspace.members, [activeWorkspace.members])

  const handleSend = () => {
    if (!thread || message.trim().length === 0) return
    addComment(thread.id, message.trim(), mentionIds)
    setMessage("")
    setMentionIds([])
  }

  const toggleMention = (memberId: string) => {
    setMentionIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full">
          <MessageSquare className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-left">
            <MessageSquare className="h-4 w-4 text-primary" />
            {entityName}
          </DialogTitle>
          <DialogDescription>
            Share notes, mention teammates, and keep an audit trail tied to this record.
          </DialogDescription>
        </DialogHeader>

        {thread ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>Watching:</span>
              {thread.watchers.map((watcherId) => {
                const member = availableMembers.find((item) => item.id === watcherId)
                if (!member) return null
                return (
                  <Badge key={watcherId} variant="secondary" className="rounded-full px-2">
                    {member.name}
                  </Badge>
                )
              })}
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto pr-2" aria-live="polite">
              {thread.comments.map((comment) => {
                const author = availableMembers.find((member) => member.id === comment.authorId)
                return (
                  <div key={comment.id} className="flex gap-3 text-sm">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{author?.avatarFallback ?? "--"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{author?.name ?? "Unknown"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {comment.body}
                      </p>
                      {comment.mentions.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                          <AtSign className="h-3 w-3" />
                          {comment.mentions.map((mentionId) => {
                            const mention = availableMembers.find((member) => member.id === mentionId)
                            return (
                              <span key={mentionId} className="rounded bg-muted px-1 py-0.5">
                                {mention?.name ?? mentionId}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <AtSign className="h-3 w-3" />
                <span>Mention teammates</span>
                {availableMembers.map((member) => {
                  const active = mentionIds.includes(member.id)
                  return (
                    <Badge
                      key={member.id}
                      variant={active ? "default" : "outline"}
                      onClick={() => toggleMention(member.id)}
                      className="cursor-pointer rounded-full px-2"
                    >
                      {member.name.split(" ")[0]}
                    </Badge>
                  )
                })}
              </div>
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Share an update or ask a question..."
                rows={4}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Only workspace members can view this thread.</span>
                <Button onClick={handleSend} disabled={message.trim().length === 0}>
                  <Send className="mr-2 h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Collaboration is not yet enabled for this record.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
