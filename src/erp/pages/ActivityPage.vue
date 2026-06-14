<script setup lang="ts">
import { ref, computed } from "vue"
import {
  DollarSign,
  FileText,
  UserPlus,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
} from "lucide-vue-next"
import Card from "@/components/ui/Card.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import Avatar from "@/components/ui/Avatar.vue"
import Tabs from "@/components/ui/Tabs.vue"

type ActivityType = "deal" | "invoice" | "user" | "message" | "alert" | "task"

interface Activity {
  id: string
  type: ActivityType
  actor: string
  actorName: string
  action: string
  target: string
  detail?: string
  time: string
  group: "today" | "yesterday" | "earlier"
}

const typeConfig: Record<ActivityType, { icon: typeof DollarSign; tone: "accent" | "success" | "destructive" | "default" | "outline" }> = {
  deal: { icon: DollarSign, tone: "accent" },
  invoice: { icon: FileText, tone: "default" },
  user: { icon: UserPlus, tone: "success" },
  message: { icon: MessageSquare, tone: "outline" },
  alert: { icon: AlertTriangle, tone: "destructive" },
  task: { icon: CheckCircle2, tone: "success" },
}

const scope = ref("all")
const scopeTabs = [
  { label: "All activity", value: "all" },
  { label: "My team", value: "team" },
  { label: "Alerts", value: "alerts" },
]

const groups = [
  { id: "today" as const, label: "Today" },
  { id: "yesterday" as const, label: "Yesterday" },
  { id: "earlier" as const, label: "Earlier this week" },
]

const activities = ref<Activity[]>([
  { id: "a1", type: "deal", actor: "JR", actorName: "Jordan Reyes", action: "moved deal to Closing", target: "Atlas Retail Group · $312k", time: "10:42 AM", group: "today" },
  { id: "a2", type: "invoice", actor: "AL", actorName: "Ava Lindstrom", action: "marked invoice as paid", target: "INV-2041 · Vertex Logistics", detail: "$24,500 via ACH", time: "10:18 AM", group: "today" },
  { id: "a3", type: "alert", actor: "SY", actorName: "System", action: "flagged overdue invoice", target: "INV-2042 · Halcyon Foods", detail: "6 days past due", time: "9:55 AM", group: "today" },
  { id: "a4", type: "message", actor: "SD", actorName: "Sam Delgado", action: "replied in inbox", target: "Pine & Co. renewal thread", time: "9:30 AM", group: "today" },
  { id: "a5", type: "user", actor: "MH", actorName: "Marcus Hale", action: "invited teammate", target: "Elena Park · Finance analyst", time: "8:15 AM", group: "today" },
  { id: "a6", type: "task", actor: "MH", actorName: "Marcus Hale", action: "completed task", target: "Review Q3 forecast variance report", time: "6:02 PM", group: "yesterday" },
  { id: "a7", type: "deal", actor: "SD", actorName: "Sam Delgado", action: "created new deal", target: "Meridian Health · Compliance module", detail: "$96k · Negotiation", time: "3:40 PM", group: "yesterday" },
  { id: "a8", type: "invoice", actor: "JR", actorName: "Jordan Reyes", action: "sent invoice reminder", target: "INV-2048 · Cobalt Energy", time: "11:20 AM", group: "yesterday" },
  { id: "a9", type: "deal", actor: "AL", actorName: "Ava Lindstrom", action: "updated forecast", target: "Q3 pipeline +8% vs plan", time: "Tue", group: "earlier" },
  { id: "a10", type: "alert", actor: "SY", actorName: "System", action: "detected churn risk", target: "Halcyon Foods account health", detail: "Usage down 22% MoM", time: "Mon", group: "earlier" },
])

const filtered = computed(() => {
  if (scope.value === "team") return activities.value.filter((a) => a.actor !== "SY")
  if (scope.value === "alerts") return activities.value.filter((a) => a.type === "alert")
  return activities.value
})

function inGroup(group: Activity["group"]) {
  return filtered.value.filter((a) => a.group === group)
}
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-5">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="font-display text-2xl font-semibold">Activity</h2>
        <p class="text-sm text-muted-foreground">Real-time feed across deals, billing &amp; team actions</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm"><Filter />Filter</Button>
        <Button variant="outline" size="sm"><Download />Export</Button>
      </div>
    </div>

    <Tabs v-model="scope" :tabs="scopeTabs" />

    <!-- Timeline -->
    <div class="flex flex-col gap-8">
      <div v-for="group in groups" :key="group.id">
        <div v-if="inGroup(group.id).length" class="flex flex-col gap-4">
          <h3 class="text-sm font-medium text-muted-foreground">{{ group.label }}</h3>

          <Card padding="none" class="overflow-hidden">
            <div class="relative">
              <!-- Vertical line -->
              <div class="absolute bottom-6 left-[2.125rem] top-6 w-px bg-border" aria-hidden="true" />

              <div
                v-for="(item, idx) in inGroup(group.id)"
                :key="item.id"
                class="relative flex gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
                :class="idx < inGroup(group.id).length - 1 && 'border-b border-border'"
              >
                <!-- Icon node -->
                <span
                  class="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full"
                  :class="{
                    'bg-accent/15 text-accent-foreground': typeConfig[item.type].tone === 'accent',
                    'bg-success/15 text-success': typeConfig[item.type].tone === 'success',
                    'bg-destructive/15 text-destructive': typeConfig[item.type].tone === 'destructive',
                    'bg-secondary text-secondary-foreground': typeConfig[item.type].tone === 'default',
                    'border border-border bg-card text-muted-foreground': typeConfig[item.type].tone === 'outline',
                  }"
                >
                  <component :is="typeConfig[item.type].icon" class="size-4" />
                </span>

                <!-- Content -->
                <div class="min-w-0 flex-1 pt-0.5">
                  <div class="flex flex-wrap items-start justify-between gap-2">
                    <p class="text-sm leading-relaxed">
                      <span class="font-medium">{{ item.actorName }}</span>
                      <span class="text-muted-foreground"> {{ item.action }}</span>
                    </p>
                    <span class="shrink-0 text-xs text-muted-foreground">{{ item.time }}</span>
                  </div>
                  <p class="mt-1 text-sm font-medium">{{ item.target }}</p>
                  <p v-if="item.detail" class="mt-0.5 text-xs text-muted-foreground">{{ item.detail }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <Avatar :fallback="item.actor" size="sm" ring="border" />
                    <Badge variant="outline" size="sm" class="capitalize">{{ item.type }}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
