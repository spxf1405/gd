<script setup lang="tsx">
import { Icon } from "@iconify/vue";
import { useElementSize, useWindowSize } from "@vueuse/core";
import {
  AllCommunityModule,
  ModuleRegistry,
  type DomLayoutType,
} from "ag-grid-community";

import { ref } from "vue";

ModuleRegistry.registerModules([AllCommunityModule]);

const route = useRoute();

const id = route.params.id;

console.log("id", id);

definePageMeta({
  title: "Elite Gamer - Tournament",
  ssr: false,
  layout: false,
});

const el = useTemplateRef("el");
const { width, height } = useElementSize(el);

const open = ref(true);

const iframeWrapper = ref(null);

const sendDimensions = () => {
  const iframe = iframeWrapper.value;

  if (iframe && iframe.contentWindow) {
    const w = width.value;
    const h = height.value;

    const message = {
      type: "CONTAINER_SIZE",
      width: w,
      height: h,
    };

    iframe.contentWindow.postMessage(message, "*");
  }
};

watch([width, height], () => {
  sendDimensions();
});
</script>

<template>
  <NuxtLayout name="no-side-admin">
    <div ref="el" class="h-full">
      <CollapsibleRoot v-model:open="open">
        <div class="flex justify-between items-center">
          <!-- <span class="text-white text-[15px] leading-[25px]">
          @peduarte starred 3 repos
        </span> -->
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
              @load="sendDimensions"
            ></iframe>
          </ClientOnly>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
  </NuxtLayout>
</template>
