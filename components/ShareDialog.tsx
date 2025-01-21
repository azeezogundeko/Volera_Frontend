"use client"

import { useState } from "react"
import { Check, Copy, Facebook, Link2, Twitter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatId: string
}

export function ShareDialog({ open, onOpenChange, chatId }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/chat/${chatId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareToTwitter = () => {
    const text = "Check out this interesting chat on Volera!"
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank")
  }

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(url, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md bg-white text-black rounded-lg rounded`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share Chat</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share this chat with your friends and colleagues
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-background border-border"
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-border"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-border hover:bg-accent"
              onClick={shareToTwitter}
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              <span className="text-foreground">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-border hover:bg-accent"
              onClick={shareToFacebook}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-foreground">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-border hover:bg-accent"
              onClick={copyToClipboard}
            >
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Copy Link</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}