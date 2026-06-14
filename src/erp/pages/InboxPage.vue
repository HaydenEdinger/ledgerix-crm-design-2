<script setup lang="ts">
import { ref, computed } from "vue"
import {
  Mail,
  MessageSquare,
  Phone,
  Search,
  Star,
  Archive,
  MoreHorizontal,
  Paperclip,
  Send,
  Smile,
  CheckCheck,
} from "lucide-vue-next"
import Card from "@/components/ui/Card.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import Avatar from "@/components/ui/Avatar.vue"
import Tabs from "@/components/ui/Tabs.vue"

type Channel = "email" | "chat" | "sms"

interface Thread {
  id: string
  name: string
  company: string
  avatar: string
  channel: Channel
  preview: string
  time: string
  unread: boolean
  starred: boolean
}

interface Message {
  id: string
  from: "them" | "us"
  text: string
  time: string
}

const channelIcons = { email: Mail, chat: MessageSquare, sms: Phone }
const channelLabels = { email: "Email", chat: "Chat", sms: "SMS" }

const channel = ref<Channel | "all">("all")
const channelTabs = [
  { label: "All", value: "all" },
  { label: "Email", value: "email" },
  { label: "Chat", value: "chat" },
  { label: "SMS", value: "sms" },
]

const threads = ref<Thread[]>([
  { id: "1", name: "Jordan Reyes", company: "Vertex Logistics", avatar: "JR", channel: "email", preview: "Can we move the renewal call to Thursday?", time: "2m", unread: true, starred: true },
  { id: "2", name: "Ava Lindstrom", company: "Halcyon Foods", avatar: "AL", channel: "chat", preview: "Payment portal is showing an error on invoice #2042", time: "18m", unread: true, starred: false },
  { id: "3", name: "Sam Delgado", company: "Pine & Co.", avatar: "SD", channel: "sms", preview: "Got it — I'll review the proposal tonight.", time: "1h", unread: false, starred: false },
  { id: "4", name: "Support queue", company: "Northbeam Labs", avatar: "NB", channel: "chat", preview: "New ticket: SSO configuration for sandbox", time: "2h", unread: true, starred: false },
  { id: "5", name: "Billing alerts", company: "System", avatar: "SY", channel: "email", preview: "3 invoices are now overdue — action required", time: "3h", unread: false, starred: true },
  { id: "6", name: "Marcus Hale", company: "Internal", avatar: "MH", channel: "chat", preview: "Board deck draft is ready for your review", time: "5h", unread: false, starred: false },
])

const activeId = ref("1")

const filteredThreads = computed(() =>
  channel.value === "all"
    ? threads.value
    : threads.value.filter((t) => t.channel === channel.value),
)

const active = computed(() => threads.value.find((t) => t.id === activeId.value))

const messages = ref<Message[]>([
  { id: "m1", from: "them", text: "Hi Marcus — quick question on the renewal timeline.", time: "10:14 AM" },
  { id: "m2", from: "us", text: "Hi Jordan! We're on track for end of month. I'll send the updated terms shortly.", time: "10:22 AM" },
  { id: "m3", from: "them", text: "Perfect. Can we move the renewal call to Thursday? Our CFO is traveling Friday.", time: "10:31 AM" },
  { id: "m4", from: "them", text: "Also attaching the signed security questionnaire from last quarter for reference.", time: "10:31 AM" },
])

const unreadCount = computed(() => threads.value.filter((t) => t.unread).length)

function selectThread(id: string) {
  activeId.value = id
  const thread = threads.value.find((t) => t.id === id)
  if (thread) thread.unread = false
}
</script>

<template>
  <div class="mx-auto flex max-w-7xl flex-col gap-5">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="font-display text-2xl font-semibold">Inbox</h2>
        <p class="text-sm text-muted-foreground">
          Omnichannel feed · {{ unreadCount }} unread across email, chat &amp; SMS
        </p>
      </div>
      <Tabs v-model="channel" :tabs="channelTabs" />
    </div>

    <!-- Inbox layout -->
    <Card padding="none" class="flex min-h-[560px] overflow-hidden">
      <!-- Thread list -->
      <div class="flex w-full flex-col border-b border-border sm:w-80 sm:border-b-0 sm:border-r">
        <div class="border-b border-border p-3">
          <div class="relative">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search conversations…"
              class="h-9 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <button
            v-for="thread in filteredThreads"
            :key="thread.id"
            class="flex w-full items-start gap-3 border-b border-border px-4 py-3.5 text-left transition-colors last:border-0"
            :class="activeId === thread.id
              ? 'bg-accent/10'
              : thread.unread
                ? 'bg-muted/40 hover:bg-muted/60'
                : 'hover:bg-muted/40'"
            @click="selectThread(thread.id)"
          >
            <Avatar :fallback="thread.avatar" size="sm" :ring="thread.unread ? 'accent' : 'border'" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <span class="truncate text-sm" :class="thread.unread && 'font-semibold'">{{ thread.name }}</span>
                <span class="shrink-0 text-xs text-muted-foreground">{{ thread.time }}</span>
              </div>
              <p class="truncate text-xs text-muted-foreground">{{ thread.company }}</p>
              <p class="mt-1 truncate text-xs" :class="thread.unread ? 'text-foreground' : 'text-muted-foreground'">
                {{ thread.preview }}
              </p>
              <div class="mt-2 flex items-center gap-2">
                <Badge variant="outline" size="sm">
                  <component :is="channelIcons[thread.channel]" class="size-3" />
                  {{ channelLabels[thread.channel] }}
                </Badge>
                <Star v-if="thread.starred" class="size-3.5 fill-accent text-accent" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Conversation -->
      <div v-if="active" class="flex min-w-0 flex-1 flex-col">
        <!-- Thread header -->
        <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div class="flex min-w-0 items-center gap-3">
            <Avatar :fallback="active.avatar" ring="border" />
            <div class="min-w-0">
              <p class="truncate font-medium">{{ active.name }}</p>
              <p class="truncate text-sm text-muted-foreground">{{ active.company }}</p>
            </div>
            <Badge variant="outline" size="sm">
              <component :is="channelIcons[active.channel]" class="size-3" />
              {{ channelLabels[active.channel] }}
            </Badge>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Star"><Star class="size-4" /></Button>
            <Button variant="ghost" size="icon" aria-label="Archive"><Archive class="size-4" /></Button>
            <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal class="size-4" /></Button>
          </div>
        </div>

        <!-- Messages -->
        <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.from === 'us' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
              :class="msg.from === 'us'
                ? 'rounded-br-md bg-foreground text-background'
                : 'rounded-bl-md bg-muted text-foreground'"
            >
              <p>{{ msg.text }}</p>
              <p
                class="mt-1.5 flex items-center gap-1 text-[11px]"
                :class="msg.from === 'us' ? 'justify-end text-background/60' : 'text-muted-foreground'"
              >
                {{ msg.time }}
                <CheckCheck v-if="msg.from === 'us'" class="size-3.5" />
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
            <Paperclip class="size-4" />
            security-questionnaire-q2.pdf · 248 KB
          </div>
        </div>

        <!-- Composer -->
        <div class="border-t border-border p-4">
          <div class="flex items-end gap-2 rounded-2xl border border-input bg-card p-2">
            <button class="rounded-full p-2 text-muted-foreground hover:bg-secondary" aria-label="Emoji">
              <Smile class="size-5" />
            </button>
            <textarea
              rows="2"
              placeholder="Reply to Jordan…"
              class="min-h-[44px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button variant="accent" size="sm" class="shrink-0">
              <Send />
              Send
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
