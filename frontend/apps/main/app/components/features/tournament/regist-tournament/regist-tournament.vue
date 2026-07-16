<script setup lang="tsx">
const { t } = useI18n()
const open = ref(false)

const handleTournamentRegister = () => {
  console.log("1");
};
</script>
<template>
  <!-- <span
    class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20 flex items-center"
    @click="handleTournamentRegister"
  >
    <Icon icon="lucide:globe" class="w-4 h-4 mr-2" />
  </span> -->

  <DialogRoot v-model:open="open">
    <DialogTrigger
      class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20 flex items-center"
    >
      <Icon icon="lucide:globe" class="w-4 h-4 mr-2" />
      Đăng kí
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 dialog-transition bg-black/75" />

      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] bg-gradient-to-br from-[#0A1628] to-[#0D1624] border border-[#00D4FF]/30 rounded-2xl shadow-2xl dialog-transition overflow-hidden"
      >
        <div class="px-6 py-5 border-b border-[#00D4FF]/20">
          <DialogTitle class="text-2xl font-bold text-white mb-2">
            {{ t('createTournament.title') }}
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-400">
            {{ t('createTournament.description') }}
          </DialogDescription>
        </div>

        <div class="px-6 py-6">
          <div class="bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg p-4 mb-6">
            <div class="flex items-start space-x-3">
              <Icon icon="lucide:info" class="w-4 h-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
              <div class="text-xs text-gray-300 leading-relaxed">
                <span class="font-semibold text-white">{{ t('createTournament.hint.label') }}</span>
                {{ t('createTournament.hint.message') }}
                <span class="text-[#00D4FF] font-medium">{{ t('createTournament.hint.settings') }}</span>.
              </div>
            </div>
          </div>

          <div>
            Content
          </div>
        </div>

        <DialogClose class="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10 transition-colors">
          <Icon icon="lucide:x" class="w-4 h-4 text-gray-400" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
