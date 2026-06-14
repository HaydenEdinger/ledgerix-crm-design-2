<script setup lang="ts">
import { ref, computed } from "vue"
import {
  Plus,
  MoreHorizontal,
  DollarSign,
  Calendar,
  GripVertical,
  Filter,
  Search,
} from "lucide-vue-next"
import Card from "@/components/ui/Card.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import Avatar from "@/components/ui/Avatar.vue"
import Tabs from "@/components/ui/Tabs.vue"

type Stage = "qualified" | "proposal" | "negotiation" | "closing"

interface Deal {
  id: string
  title: string
  account: string
  owner: string
  amount: number
  closeDate: string
  tags: string[]
  stage: Stage
}

const view = ref("all")
const viewTabs = [
  { label: "All deals", value: "all" },
  { label: "My pipeline", value: "mine" },
  { label: "At risk", value: "risk" },
]

const columns: { id: Stage; label: string; color: string }[] = [
  { id: "qualified", label: "Qualified", color: "bg-muted-foreground/40" },
  { id: "proposal", label: "Proposal", color: "bg-foreground/30" },
  { id: "negotiation", label: "Negotiation", color: "bg-success/50" },
  { id: "closing", label: "Closing", color: "bg-accent/60" },
]

const deals = ref<Deal[]>([
  { id: "d1", title: "Annual platform renewal", account: "Vertex Logistics", owner: "JR", amount: 245000, closeDate: "Jun 28", tags: ["Renewal"], stage: "qualified" },
  { id: "d2", title: "Multi-site rollout", account: "Halcyon Foods", owner: "AL", amount: 182000, closeDate: "Jul 12", tags: ["Expansion"], stage: "qualified" },
  { id: "d3", title: "Procurement suite", account: "Pine & Co.", owner: "SD", amount: 157500, closeDate: "Jun 20", tags: ["New logo"], stage: "proposal" },
  { id: "d4", title: "Analytics add-on", account: "Northbeam Labs", owner: "MH", amount: 48000, closeDate: "Jun 18", tags: ["Upsell"], stage: "proposal" },
  { id: "d5", title: "Enterprise tier upgrade", account: "Atlas Retail Group", owner: "JR", amount: 312000, closeDate: "Jul 05", tags: ["Upgrade"], stage: "negotiation" },
  { id: "d6", title: "Compliance module", account: "Meridian Health", owner: "SD", amount: 96000, closeDate: "Jun 30", tags: ["Healthcare"], stage: "negotiation" },
  { id: "d7", title: "Q3 implementation", account: "Quill Software", owner: "AL", amount: 74000, closeDate: "Jun 15", tags: ["Services"], stage: "closing" },
  { id: "d8", title: "Energy billing portal", account: "Cobalt Energy", owner: "MH", amount: 128000, closeDate: "Jun 22", tags: ["New logo"], stage: "closing" },
])

const filteredDeals = computed(() => {
  if (view.value === "mine") return deals.value.filter((d) => d.owner === "MH")
  if (view.value === "risk") return deals.value.filter((d) => d.amount >= 150000)
  return deals.value
})

function dealsInStage(stage: Stage) {
  return filteredDeals.value.filter((d) => d.stage === stage)
}

function stageTotal(stage: Stage) {
  return dealsInStage(stage).reduce((sum, d) => sum + d.amount, 0)
}

const money = (n: number) =>
  n >= 1000
    ? `$${Math.round(n / 1000)}k`
    : n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 })

const pipelineTotal = computed(() =>
  filteredDeals.value.reduce((sum, d) => sum + d.amount, 0),
)
</script>

<template>
  <div class="mx-auto flex max-w-[90rem] flex-col gap-5">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="font-display text-2xl font-semibold">Sales pipeline</h2>
        <p class="text-sm text-muted-foreground">
          {{ filteredDeals.length }} deals · {{ money(pipelineTotal) }} total value
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <Tabs v-model="view" :tabs="viewTabs" />
        <Button variant="outline" size="sm"><Filter />Filter</Button>
        <Button variant="accent" size="sm"><Plus />Add deal</Button>
      </div>
    </div>

    <!-- Search -->
    <div class="relative max-w-md">
      <Search class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search deals…"
        class="h-10 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      />
    </div>

    <!-- Kanban board -->
    <div class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="col in columns"
        :key="col.id"
        class="flex w-72 shrink-0 flex-col gap-3"
      >
        <!-- Column header -->
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span :class="['size-2 rounded-full', col.color]" />
            <span class="text-sm font-medium">{{ col.label }}</span>
            <Badge variant="outline" size="sm">{{ dealsInStage(col.id).length }}</Badge>
          </div>
          <span class="font-mono text-xs text-muted-foreground">{{ money(stageTotal(col.id)) }}</span>
        </div>

        <!-- Drop zone -->
        <div class="flex min-h-[420px] flex-col gap-3 rounded-2xl border border-dashed border-border bg-muted/40 p-2">
          <Card
            v-for="deal in dealsInStage(col.id)"
            :key="deal.id"
            padding="sm"
            class="group cursor-grab border-border/80 shadow-sm transition-all hover:border-accent/40 hover:shadow-md active:cursor-grabbing active:scale-[0.99]"
          >
            <div class="flex items-start gap-2">
              <GripVertical class="mt-0.5 size-4 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium leading-snug">{{ deal.title }}</p>
                  <button class="shrink-0 rounded-full p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100" aria-label="Deal actions">
                    <MoreHorizontal class="size-3.5" />
                  </button>
                </div>
                <p class="mt-1 text-xs text-muted-foreground">{{ deal.account }}</p>

                <div class="mt-3 flex flex-wrap gap-1.5">
                  <Badge v-for="tag in deal.tags" :key="tag" variant="outline" size="sm">{{ tag }}</Badge>
                </div>

                <div class="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <div class="flex items-center gap-3 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1 font-mono font-medium text-foreground">
                      <DollarSign class="size-3" />
                      {{ money(deal.amount) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Calendar class="size-3" />
                      {{ deal.closeDate }}
                    </span>
                  </div>
                  <Avatar :fallback="deal.owner" size="sm" ring="border" />
                </div>
              </div>
            </div>
          </Card>

          <button class="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-foreground">
            <Plus class="size-4" />
            Add card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
