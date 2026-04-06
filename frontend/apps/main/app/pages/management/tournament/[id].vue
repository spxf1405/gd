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
      <ClientOnly>
        <iframe
          ref="iframeWrapper"
          src="http://localhost:5173/"
          style="border: none; display: block; width: 100%"
          :style="{ width: width + 'px', height: height + 'px', }"
        />
      </ClientOnly>
    </div>
  </NuxtLayout>
</template>
