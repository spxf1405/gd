<!-- components/StatRow.vue -->
<template>
  <div
    class="flex items-center justify-between group py-2 border-b border-white/[0.03] last:border-0"
  >
    <div class="flex items-center gap-3">
      <div
        class="p-2 rounded-lg bg-[#151829] border border-blue-500/10 group-hover:border-blue-500/30 transition-all"
      >
        <ClientOnly>
          <Icon :icon="icon" :class="['w-4 h-4', iconClass]" />
        </ClientOnly>
      </div>
      <span
        class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
        >{{ label }}</span
      >
    </div>
    <span class="text-[11px] font-black text-white uppercase tracking-tight">{{
      value
    }}</span>
  </div>
</template>

<script setup>
defineProps(["icon", "label", "value", "iconClass"]);
</script>
