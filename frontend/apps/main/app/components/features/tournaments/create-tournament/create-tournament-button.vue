<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const { t } = useI18n();

const emit = defineEmits<{
  (e: "submit", tournamentName: string): void;
}>();

const open = ref(false);
const tournamentName = ref("");
const showError = ref(false);

const handleSubmit = async () => {
  if (!tournamentName.value.trim()) {
    showError.value = true;
    return;
  }

  emit("submit", tournamentName.value);
  closeDialog();
};

const closeDialog = () => {
  open.value = false;
  tournamentName.value = "";
  showError.value = false;
};

const handleInput = () => {
  if (showError.value && tournamentName.value.trim()) {
    showError.value = false;
  }
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger
      class="bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] hover:from-[#00FFB3]/80 hover:to-[#00D4FF]/80 px-6 py-3 rounded-lg font-bold text-black transition-all duration-200 shadow-lg hover:shadow-[#00FFB3]/20 inline-flex items-center w-fit h-12"
    >
      <Icon icon="lucide:plus" class="w-5 h-5 mr-2" />
      {{ t('createTournament.trigger') }}
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

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                {{ t('createTournament.form.name') }} <span class="text-red-400">*</span>
              </label>
              <input
                v-model="tournamentName"
                @input="handleInput"
                type="text"
                :placeholder="t('createTournament.form.namePlaceholder')"
                class="w-full bg-[#0A1628] border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all duration-200"
                :class="
                  showError
                    ? 'border-red-500/50 focus:border-red-500'
                    : 'border-[#00D4FF]/20 focus:border-[#00D4FF]/40'
                "
              />
              <transition
                enter-active-class="transition-all duration-200"
                enter-from-class="opacity-0 transform -translate-y-1"
                enter-to-class="opacity-100 transform translate-y-0"
                leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100 transform translate-y-0"
                leave-to-class="opacity-0 transform -translate-y-1"
              >
                <p v-if="showError" class="text-red-400 text-xs mt-2 flex items-center">
                  <Icon icon="lucide:alert-circle" class="w-3.5 h-3.5 mr-1.5" />
                  {{ t('createTournament.form.nameError') }}
                </p>
              </transition>
            </div>

            <div class="flex gap-3 pt-2">
              <DialogClose
                class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-white"
              >
                {{ t('tournament.actions.cancel') }}
              </DialogClose>

              <button
                type="submit"
                class="flex-1 bg-gradient-to-r from-[#00FFB3] to-[#00D4FF] hover:from-[#00FFB3]/80 hover:to-[#00D4FF]/80 px-4 py-3 rounded-lg text-sm font-bold text-black transition-all duration-200 shadow-lg hover:shadow-[#00FFB3]/20 flex items-center justify-center"
              >
                <Icon icon="lucide:plus" class="w-4 h-4 mr-2" />
                {{ t('createTournament.trigger') }}
              </button>
            </div>
          </form>
        </div>

        <DialogClose class="absolute right-4 top-4 rounded-lg p-2 hover:bg-white/10 transition-colors">
          <Icon icon="lucide:x" class="w-4 h-4 text-gray-400" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>