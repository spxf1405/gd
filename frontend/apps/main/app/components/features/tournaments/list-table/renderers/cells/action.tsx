import type { Tournament } from "@gd/proto/tournament/v1/tournament_pb";
import { Icon } from "@iconify/vue";
import { useQueryClient } from "@tanstack/vue-query";
import type { ICellRendererParams } from "ag-grid-community";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "radix-vue";

export const ActionCell = defineComponent({
  props: {
    params: {
      type: Object as PropType<ICellRendererParams<Tournament>>,
      required: true,
    },
  },
  setup(props) {
    const open = ref(false);
    const data = props.params.data;
    if (!data) return null;

    const queryClient = useQueryClient();
    const toast = useToast();

    const viewDetails = () => {
      navigateTo(`/tournament/${data.id}`);
    };

    const edit = () => {
      alert(`Chỉnh sửa giải đấu: ${data.name}`);
    };

    const remove = () => {
      if (confirm(`Bạn có chắc muốn xóa giải đấu "${data.name}"?`)) {
        alert(`Đã xóa giải đấu: ${data.name}`);
      }
    };

    const confirmDelete = async () => {
      try {
        await tournamentClient.deleteTournament({
          id: data.id,
        });
        open.value = false;
        toast.error("Xoá thành công!");
        queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      } catch (error) {
        toast.error("Xoá không thành công!");
      }
    };

    const onEdit = () => {
      props.params.api.startEditingCell({
        rowIndex: props.params.node.rowIndex,
        colKey: props.params.columnApi.getAllDisplayedColumns()[0].getColId(),
      });
    };

    return { onEdit, viewDetails, edit, remove, open, confirmDelete };
  },
  render() {
    return (
      <div class="flex gap-2 py-2">
        <button onClick={this.onEdit}>Edit</button>
        <button
          class="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center gap-1"
          onClick={this.viewDetails}
        >
          <Icon icon="mdi:eye" />
          Chi tiết
        </button>
        <button
          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center gap-1"
          onClick={this.edit}
        >
          <Icon icon="mdi:pencil" />
          Sửa
        </button>
        <DialogRoot
          open={this.open}
          onUpdate:open={(val: boolean) => (this.open = val)}
        >
          <DialogTrigger asChild>
            <button
              class="px-3 py-1.5 bg-red-500/90 hover:bg-red-600
           text-white rounded-md text-sm font-medium
           flex items-center gap-1.5
           transition-all duration-200
           hover:scale-[1.03] active:scale-[0.97]"
            >
              <Icon icon="mdi:delete" class="w-4 h-4" />
              Xóa
            </button>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-50 bg-black/75 dialog-transition" />

            <DialogContent
              class="fixed left-1/2 top-1/2 z-50
           w-full max-w-md
           -translate-x-1/2 -translate-y-1/2
           bg-[#0F172A]
           rounded-2xl shadow-2xl
           dialog-transition
           p-6 flex flex-col gap-2"
            >
              <DialogTitle class="text-lg font-semibold text-white">
                Xác nhận xoá
              </DialogTitle>

              <div class="text-sm text-white leading-relaxed">
                Bạn có chắc chắn muốn xoá giải đấu này?
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <DialogClose asChild>
                  <button
                    class="px-4 py-2 text-sm font-medium
                 rounded-lg bg-white/5 hover:bg-white/10
                 text-slate-300
                 transition-all duration-200"
                  >
                    Huỷ
                  </button>
                </DialogClose>

                <button
                  onClick={this.confirmDelete}
                  class="px-4 py-2 text-sm font-semibold
               rounded-lg
               bg-gradient-to-r from-red-500 to-red-600
               hover:from-red-600 hover:to-red-700
               text-white
               shadow-lg shadow-red-500/20
               transition-all duration-200
               hover:scale-[1.03]
               active:scale-[0.96]
               focus:outline-none
               focus:ring-2 focus:ring-red-400/50"
                >
                  <Icon icon="mdi:delete" class="w-4 h-4 mr-2 inline" />
                  Xóa
                </button>
              </div>

              <DialogClose
                class="absolute right-4 top-4 p-2 rounded-md
             text-slate-400 hover:text-white
             hover:bg-white/10
             transition-colors"
              >
                <Icon icon="lucide:x" class="w-4 h-4" />
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      </div>
    );
  },
});
