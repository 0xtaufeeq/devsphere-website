"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JoinConfetti } from "@/components/join-confetti"
import { Send, User, Bot, Loader2 } from "lucide-react"

type Message = {
  role: "assistant" | "user"
  text: string
}

export default function JoinChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi there! I am here to help you apply for DevSphere. What should I call you?" }
  ])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"chatting" | "done">("chatting")
  const [formStartedAt] = useState(() => Date.now())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || step === "done") return

    const userText = inputText.trim()
    const newMessages: Message[] = [...messages, { role: "user", text: userText }]

    setMessages(newMessages)
    setInputText("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/join-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error("Failed to get response")
      const data = await res.json()
      let botResponseText = data.response

      try {
        const parsed = JSON.parse(botResponseText)
        if (parsed.fullName && parsed.email) {
          // Data is structured JSON. Submit it to actual webhook
          await fetch("/api/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...parsed, formStartedAt })
          })
          botResponseText = "All done! I've successfully submitted your application to the DevSphere team. We'll be in touch soon. Thank you!"
          setStep("done")
        } else if (parsed.chatEnded) {
          botResponseText = "Chat ended due to too many off-topic questions. Please reload the page if you want to try again and focus on the application."
          setStep("done")
        }
      } catch (e) {
        // Normal text response
      }

      setMessages([...newMessages, { role: "assistant", text: botResponseText }])
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", text: "Oops, something went wrong connecting to the server. Could you please try again?" }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#0A0A0B] text-foreground">
      <JoinConfetti fire={step === "done"} />

      {/* Background Gradients (doss.com aesthetic) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]"
          animate={{ x: [0, 30, -10, 0], y: [0, 20, -20, 0] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 bottom-16 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]"
          animate={{ x: [0, -30, 15, 0], y: [0, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
      </div>

      <main className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-3xl flex-col md:py-8">
        <div className="flex flex-col h-full w-full overflow-hidden bg-transparent md:rounded-[32px] md:border md:border-white/[0.08] md:bg-[#121214]/60 md:shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset,0_24px_80px_-20px_rgba(0,0,0,0.8)] md:backdrop-blur-xl">

          {/* Header */}
          <div className="z-20 flex items-center justify-between border-b border-white/[0.05] bg-black/40 px-5 py-4 backdrop-blur-xl md:px-6">
            <div>
              <h1 className="text-[15px] md:text-base font-semibold tracking-tight text-white/90">DevSphere Leadership Application</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-medium text-white/60">Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 scroll-smooth">
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full border ${msg.role === "user" ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/5 text-white/60"}`}>
                      {msg.role === "user" ? <User size={13} /> : <Bot size={13} />}
                    </div>

                    <div className={`max-w-[88%] md:max-w-[80%] rounded-[20px] px-4 py-3 md:px-5 md:py-3.5 text-[15px] leading-relaxed shadow-sm ${msg.role === "user"
                        ? "rounded-br-[4px] bg-white text-black font-medium"
                        : "rounded-bl-[4px] border border-white/[0.05] bg-white/[0.04] text-white/90"
                      }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="flex items-end gap-3"
                  >
                    <div className="flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60">
                      <Bot size={13} />
                    </div>
                    <div className="flex h-11 w-14 md:h-12 md:w-16 items-center justify-center rounded-[20px] rounded-bl-[4px] border border-white/[0.05] bg-white/[0.04]">
                      <div className="flex gap-1">
                        <motion.div className="size-1.5 rounded-full bg-white/40" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="size-1.5 rounded-full bg-white/40" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                        <motion.div className="size-1.5 rounded-full bg-white/40" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-2" />
            </div>
          </div>

          {/* Input Area */}
          <div className="z-20 border-t border-white/[0.05] bg-black/40 px-4 py-4 md:p-6 backdrop-blur-xl pb-[max(16px,env(safe-area-inset-bottom))] md:pb-6">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center"
            >
              <input
                disabled={isLoading || step === "done"}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={step === "done" ? "Application completed" : "Type your message..."}
                className="w-full rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-3.5 md:px-6 md:py-4 pr-14 md:pr-16 text-[15px] text-white/90 placeholder:text-white/40 focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all"
              />
              <motion.button
                disabled={!inputText.trim() || isLoading || step === "done"}
                whileHover={inputText.trim() && !isLoading && step !== "done" ? { scale: 1.05 } : {}}
                whileTap={inputText.trim() && !isLoading && step !== "done" ? { scale: 0.95 } : {}}
                type="submit"
                className="absolute right-1.5 md:right-2 flex size-9 md:size-10 items-center justify-center rounded-full bg-white text-black shadow-md transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {step === "done" ? (
                  <span className="text-xs font-semibold">Done</span>
                ) : (
                  <Send size={16} className="ml-0.5" />
                )}
              </motion.button>
            </form>
            <p className="mt-3 text-center text-[11px] text-white/30">
              Your responses are analyzed to collect application details.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}
