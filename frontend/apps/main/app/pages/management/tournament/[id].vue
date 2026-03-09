<script setup lang="tsx">
import { Icon } from "@iconify/vue";
import { useElementSize } from "@vueuse/core";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";

ModuleRegistry.registerModules([AllCommunityModule]);

definePageMeta({
  title: "Elite Gamer - Tournament",
  ssr: false,
  layout: false,
});

const route = useRoute();
const id = route.params.id;

const el = useTemplateRef("el");
const { width, height } = useElementSize(el);

const open = ref(true);

const iframeWrapper = ref<HTMLIFrameElement | null>(null);

let bus: EventBus;

onMounted(() => {
  bus = new EventBus();

  bus.on("READY", () => {
    console.log("React đã sẵn sàng");

    const iframe = iframeWrapper.value;
    if (!iframe) return;

    bus.emitToIframe(iframe, "TOURNAMENT_ID", id);
    bus.emitToIframe(iframe, "CONTAINER_SIZE", {
      width: width.value,
      height: height.value,
    });
  });
});

watch([width, height], () => {
  const iframe = iframeWrapper.value;
  if (!iframe?.contentWindow) return;

  bus.emitToIframe(iframe, "CONTAINER_SIZE", {
    width: width.value,
    height: height.value,
  });
});
</script>

<template>
  <NuxtLayout name="no-side-admin">
    <div ref="el" class="h-full">
      <CollapsibleRoot v-model:open="open">
        <div class="flex justify-between items-center">
          <CollapsibleTrigger class="bg-red-500">
            <Icon v-if="open" icon="radix-icons:cross-2" class="h-3.5 w-3.5" />
            <Icon v-else icon="radix-icons:row-spacing" class="h-3.5 w-3.5" />
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent
          class="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-white w-full"
        >
          <ClientOnly>
            <iframe
              ref="iframeWrapper"
              src="http://localhost:5173/"
              style="border: none; display: block; width: 100%"
              :style="{ width: width + 'px', height: height + 'px' }"
            />
          </ClientOnly>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  </NuxtLayout>
</template>
