import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { Icon } from "@iconify/vue";
import type { ICellRendererParams } from "ag-grid-community";

export const ActionCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament>>,
      required: true,
    },
  },

  setup(props) {
    const data = props.params.data;
    if (!data) return null;

    const toast = useToast();

    const isEditing = ref(false);
    const isSaving = ref(false);

    const updateEditingState = () => {
      const editingCells = props.params.api.getEditingCells();
      isEditing.value = editingCells.some(
        (c) => c.rowIndex === props.params.node.rowIndex,
      );
    };

    props.params.api.addEventListener("cellEditingStarted", updateEditingState);
    props.params.api.addEventListener("cellEditingStopped", updateEditingState);

    onUnmounted(() => {
      props.params.api.removeEventListener("cellEditingStarted", updateEditingState);
      props.params.api.removeEventListener("cellEditingStopped", updateEditingState);
    });

    const viewDetails = () => {
      navigateTo(`/tournament/${data.id}`);
    };

    const onEdit = () => {
      const firstCol = props.params.api.getAllDisplayedColumns()[0];
      props.params.api.startEditingCell({
        rowIndex: props.params.node.rowIndex!,
        colKey: firstCol.getColId(),
      });
    };

    const onSave = async () => {
      isSaving.value = true;
      try {
        await new Promise<void>((resolve) => {
          props.params.api.addEventListener("rowValueChanged", resolve, {
            once: true,
          });
          props.params.api.stopEditing(false);
        });

        const updatedData = props.params.node.data!;
        console.log("updatedData", updatedData);
        // await tournamentClient.updateTournament({ ...updatedData });

        toast.success("Lưu thành công!");
        // queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      } catch (error) {
        toast.error("Lưu không thành công!");
        props.params.api.stopEditing(true);
      } finally {
        isSaving.value = false;
      }
    };

    const onCancel = () => {
      props.params.api.stopEditing(true);
    };

    return {
      isEditing,
      isSaving,
      viewDetails,
      onEdit,
      onSave,
      onCancel,
    };
  },

  render() {
    const btn =
      "px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]";

    return (
      <div class="flex gap-2 py-2">
        
          <button
            class={`${btn} text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10`}
            onClick={this.viewDetails}
          >
            <Icon icon="mdi:eye" class="w-4 h-4" />
            Chi tiết
          </button>
        
        {/* TODO: Sửa lại khi có thời gian, hiện tại ưu tiên hoàn thiện các cell editor trước */}
        {/* {this.isEditing ? (
          <>
            <button
              class={`${btn} text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100`}
              onClick={this.onSave}
              disabled={this.isSaving}
            >
              <Icon
                icon={this.isSaving ? "mdi:loading" : "mdi:content-save"}
                class={`w-4 h-4 ${this.isSaving ? "animate-spin" : ""}`}
              />
              {this.isSaving ? "Đang lưu..." : "Lưu"}
            </button>

            <button
              class={`${btn} text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100`}
              onClick={this.onCancel}
              disabled={this.isSaving}
            >
              <Icon icon="mdi:close" class="w-4 h-4" />
              Huỷ
            </button>
          </>
        ) : (
          <>
            <button
              class={`${btn} text-sky-400 hover:text-sky-300 hover:bg-sky-400/10`}
              onClick={this.onEdit}
            >
              <Icon icon="mdi:pencil" class="w-4 h-4" />
              Sửa
            </button>
          </>
        )} */}
      </div>
    );
  },
});