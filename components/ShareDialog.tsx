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
      <DialogContent className="sm:max-w-md bg-white dark:bg-dark-100 text-black dark:text-white rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-black/90 dark:text-white/90">Share Chat</DialogTitle>
          <DialogDescription className="text-black/60 dark:text-white/60">
            Share this chat with your friends and colleagues
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center space-x-2">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-dark-200 border-light-200 dark:border-dark-200 text-black dark:text-white"
            />
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-black/70 dark:text-white/70" />
              )}
            </Button>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200"
              onClick={shareToTwitter}
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              <span className="text-black/90 dark:text-white/90">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200"
              onClick={shareToFacebook}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span className="text-black/90 dark:text-white/90">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-light-200 dark:border-dark-200 hover:bg-light-200 dark:hover:bg-dark-200"
              onClick={copyToClipboard}
            >
              <Link2 className="h-4 w-4 text-black/50 dark:text-white/50" />
              <span className="text-black/90 dark:text-white/90">Copy Link</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}