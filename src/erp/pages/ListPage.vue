<script setup lang="ts">
import { ref, computed } from "vue"
import {
  Plus,
  Calendar,
  Flag,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Circle,
  CheckCircle2,
} from "lucide-vue-next"
import Card from "@/components/ui/Card.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import Avatar from "@/components/ui/Avatar.vue"
import Checkbox from "@/components/ui/Checkbox.vue"
import Tabs from "@/components/ui/Tabs.vue"

type Priority = "High" | "Medium" | "Low"
type Section = "today" | "upcoming" | "later"

interface Task {
  id: string
  title: string
  project: string
  assignee: string
  due: string
  priority: Priority
  section: Section
  done: boolean
}

const priorityTone: Record<Priority, "destructive" | "default" | "outline"> = {
  High: "destructive",
  Medium: "default",
  Low: "outline",
}

const filter = ref("open")
const filterTabs = [
  { label: "Open", value: "open" },
  { label: "Completed", value: "completed" },
  { label: "All", value: "all" },
]

const sections: { id: Section; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "later", label: "Later" },
]

const tasks = ref<Task[]>([
  { id: "t1", title: "Review Q3 forecast variance report", project: "Finance", assignee: "MH", due: "Today, 2:00 PM", priority: "High", section: "today", done: false },
  { id: "t2", title: "Send renewal proposal to Vertex Logistics", project: "Sales", assignee: "JR", due: "Today, 4:30 PM", priority: "High", section: "today", done: false },
  { id: "t3", title: "Approve Cobalt Energy invoice adjustments", project: "Billing", assignee: "AL", due: "Today, 5:00 PM", priority: "Medium", section: "today", done: true },
  { id: "t4", title: "Schedule onboarding kickoff with Northbeam Labs", project: "Customer success", assignee: "SD", due: "Mon, Jun 16", priority: "Medium", section: "upcoming", done: false },
  { id: "t5", title: "Update pipeline stages for enterprise deals", project: "Sales ops", assignee: "MH", due: "Tue, Jun 17", priority: "Low", section: "upcoming", done: false },
  { id: "t6", title: "Prepare board deck revenue slides", project: "Executive", assignee: "MH", due: "Wed, Jun 18", priority: "High", section: "upcoming", done: false },
  { id: "t7", title: "Audit overdue accounts receivable list", project: "Finance", assignee: "AL", due: "Thu, Jun 19", priority: "Medium", section: "later", done: false },
  { id: "t8", title: "Document ERP integration requirements", project: "Product", assignee: "JR", due: "Fri, Jun 20", priority: "Low", section: "later", done: false },
])

const visibleTasks = computed(() => {
  if (filter.value === "open") return tasks.value.filter((t) => !t.done)
  if (filter.value === "completed") return tasks.value.filter((t) => t.done)
  return tasks.value
})

function tasksInSection(section: Section) {
  return visibleTasks.value.filter((t) => t.section === section)
}

function toggleTask(id: string) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) task.done = !task.done
}

const openCount = computed(() => tasks.value.filter((t) => !t.done).length)
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-5">
    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="font-display text-2xl font-semibold">Tasks</h2>
        <p class="text-sm text-muted-foreground">{{ openCount }} open · 3 due today</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm"><SlidersHorizontal />Sort</Button>
        <Button variant="accent" size="sm"><Plus />New task</Button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs v-model="filter" :tabs="filterTabs" />
      <div class="relative">
        <Search class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search tasks…"
          class="h-10 w-full rounded-full border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/40 sm:w-56"
        />
      </div>
    </div>

    <!-- Task sections -->
    <div class="flex flex-col gap-6">
      <div v-for="section in sections" :key="section.id">
        <div v-if="tasksInSection(section.id).length" class="flex flex-col gap-2">
          <div class="flex items-center gap-2 px-1">
            <h3 class="text-sm font-medium text-muted-foreground">{{ section.label }}</h3>
            <Badge variant="outline" size="sm">{{ tasksInSection(section.id).length }}</Badge>
          </div>

          <Card padding="none" class="overflow-hidden divide-y divide-border">
            <div
              v-for="task in tasksInSection(section.id)"
              :key="task.id"
              class="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted/60"
              :class="task.done && 'opacity-60'"
            >
              <Checkbox
                :model-value="task.done"
                class="mt-0.5"
                @update:model-value="toggleTask(task.id)"
              />

              <div class="min-w-0 flex-1">
                <p
                  class="text-sm font-medium leading-snug"
                  :class="task.done && 'text-muted-foreground line-through'"
                >
                  {{ task.title }}
                </p>
                <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{{ task.project }}</span>
                  <span class="flex items-center gap-1">
                    <Calendar class="size-3" />
                    {{ task.due }}
                  </span>
                  <Badge :variant="priorityTone[task.priority]" size="sm">
                    <Flag class="size-3" />
                    {{ task.priority }}
                  </Badge>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <Avatar :fallback="task.assignee" size="sm" ring="border" />
                <button class="rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100" aria-label="Task actions">
                  <MoreHorizontal class="size-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Quick add -->
    <button class="flex items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-3.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:bg-card hover:text-foreground">
      <Plus class="size-4" />
      Add a task…
    </button>

    <!-- Summary footer -->
    <Card padding="sm" variant="muted" class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm">
        <CheckCircle2 class="size-4 text-success" />
        <span>{{ tasks.filter((t) => t.done).length }} completed this week</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <Circle class="size-3" />
        <span>{{ openCount }} remaining</span>
      </div>
    </Card>
  </div>
</template>
