import { ParticipantClient } from "@/helper/service-client";
import { useTournamentStore } from "@/store/match";
import { LoadingOutlined } from "@ant-design/icons";
import { create } from "@bufbuild/protobuf";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteTournamentParticipantByIDRequestSchema } from "@gd/proto/participant/v1/participant_service_pb";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dropdown,
  Flex,
  Form,
  Input,
  Modal,
  Segmented,
  Spin,
  Tooltip,
  type MenuProps,
} from "antd";
import {
  Crown,
  GripVertical,
  LayoutGrid,
  List,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParticipantsByTournamentID } from "./players/hooks";
import { COLORS } from "./settings/consts/color";

interface Player {
  id: string;
  name: string;
  seed: number;
  nationality: string;
  rank?: string;
}

const RANK_ORDER = ["CN", "A", "B", "C", "D", "E"];
const GOLD = "#eab308";

const AddPlayerModal = ({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{ name: string }>();

  const handleOk = async () => {
    const { name } = await form.validateFields();
    onAdd(name.trim());
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      // okText={t("players.add.confirm")}
      okText="Confirm"
      // cancelText={t("players.add.cancel")}
      cancelText="Cancel"
      title={
        <div className="flex justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `${COLORS.green}18`,
                border: `1px solid ${COLORS.green}30`,
                color: COLORS.green,
              }}
            >
              <UserPlus size={15} />
            </div>
            <span className="text-[14px] font-bold text-white">
              {/* {t("players.add.title")} */}
              Thêm người chơi
            </span>
          </div>
        </div>
      }
      closable={false}
      width={480}
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="name"
          // label={t("players.add.nameLabel")}
          label={
            <>
              Vui lòng nhập id của người chơi, &nbsp;
              <span className="text-blue-500">hướng dẫn lấy ID người chơi</span>
            </>
          }
          rules={[{ required: true, message: t("players.add.nameRequired") }]}
        >
          <Input
            size="large"
            // placeholder={t("players.add.namePlaceholder")}
            placeholder="ID người chơi"
            autoFocus
            onPressEnter={handleOk}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const SILVER = "#38bdf8"; // sky-400, dùng cho hạng A

const PlayerCard = ({
  player,
  viewMode,
  onDelete,
}: {
  player: Player;
  viewMode: "list" | "grid";
  onDelete: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id });

  const isPro = player.ranking === "PRO";
  const isA = player.ranking === "A";
  const accent = isPro ? GOLD : isA ? SILVER : null;

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      danger: true,
      icon: <Trash2 size={14} />,
      label: "Xóa",
      onClick: () => onDelete(player.id),
    },
  ];

  const flagUrl = `https://flagcdn.com/24x18/${player.nationality.toLowerCase()}.png`;

  if (viewMode === "list") {
    return (
      <Dropdown menu={{ items: menuItems }} trigger={["contextMenu"]}>
        <div
          ref={setNodeRef}
          style={{
            ...dragStyle,
            background: accent ? `${accent}0d` : undefined,
            border: accent ? `1px solid ${accent}35` : "1px solid transparent",
            boxShadow: accent ? `0 0 16px ${accent}15` : undefined,
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-150 hover:bg-white/[0.03]"
          {...attributes}
        >
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 flex-shrink-0"
          >
            <GripVertical size={15} />
          </div>

          <div
            className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
            style={{
              background: accent ? `${accent}1f` : `${COLORS.green}14`,
              color: accent ?? COLORS.green,
              border: `1px solid ${accent ? `${accent}40` : `${COLORS.green}28`}`,
            }}
          >
            {player.seed}
          </div>

          <img
            src={flagUrl}
            alt={player.nationality}
            className="w-5 h-[15px] rounded-sm object-cover flex-shrink-0"
          />

          <span
            className="text-[13px] font-semibold truncate flex items-center gap-1.5"
            style={{ color: isPro ? "#fef3c7" : isA ? "#e0f2fe" : "#ffffff" }}
          >
            {player.displayName}
            {isPro && <Crown size={12} style={{ color: GOLD }} fill={GOLD} />}
            {isA && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{
                  background: `${SILVER}22`,
                  color: SILVER,
                  letterSpacing: "0.04em",
                }}
              >
                A
              </span>
            )}
          </span>

          <span className="text-[11px] text-zinc-500 ml-auto flex-shrink-0">
            {player.nationality}
          </span>
        </div>
      </Dropdown>
    );
  }

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["contextMenu"]}>
      <div
        ref={setNodeRef}
        style={{
          ...dragStyle,
          background: accent ? `${accent}0d` : "rgba(255,255,255,0.02)",
          border: `1px solid ${accent ? `${accent}40` : COLORS.borderFaint}`,
          boxShadow: accent ? `0 0 20px ${accent}18` : undefined,
        }}
        {...attributes}
        {...listeners}
        className="relative cursor-grab active:cursor-grabbing flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all duration-200 hover:[border-color:rgba(255,255,255,0.2)]"
      >
        {isPro && (
          <div
            className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: `${GOLD}22` }}
          >
            <Crown size={11} style={{ color: GOLD }} fill={GOLD} />
          </div>
        )}

        {isA && (
          <div
            className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
              background: `${SILVER}22`,
              color: SILVER,
              letterSpacing: "0.04em",
            }}
          >
            A
          </div>
        )}

        <div className="relative">
          <img
            src={flagUrl}
            alt={player.nationality}
            className="w-9 h-6 rounded object-cover"
            style={{ border: `1px solid ${COLORS.border}` }}
          />
        </div>

        <span
          className="text-[13px] font-semibold text-center truncate w-full"
          style={{ color: isPro ? "#fef3c7" : isA ? "#e0f2fe" : "#ffffff" }}
        >
          {player.displayName}
        </span>

        <span className="text-[10px] text-zinc-500">{player.nationality}</span>
      </div>
    </Dropdown>
  );
};

export const PlayersModal = ({
  onPlayersChange,
  onAddPlayer,
}: {
  onPlayersChange: (players: Player[]) => void;
  onAddPlayer: (name: string) => void;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const isSearching = search.trim().length > 0;

  const onClose = () => {
    setOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const tournamentStoreInfo = useTournamentStore();

  const { data, isFetching } = useParticipantsByTournamentID({
    tournamentId: tournamentStoreInfo.tournament?.id ?? "",
  });

  const participants = data?.tournamentParticipants ?? [];

  console.log(
    "=============== 12312321312",
    participants.filter((e) => e.ranking === "UNRANKED"),
  );

  const filteredParticipants = useMemo(
    () =>
      participants.filter((p) =>
        p.displayName.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [participants, search],
  );

  const groupedPlayers = useMemo(() => {
    const groups = new Map<string, Player[]>();

    filteredParticipants.forEach((player) => {
      const key = player.ranking ?? "UNRANKED";
      if (player.ranking === "UNRANKED") {
        // console.log("=============== key", player.ranking)
      }

      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(player);
    });

    const sortedEntries = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "UNRANKED") return 1;
      if (b === "UNRANKED") return -1;
      return RANK_ORDER.indexOf(a) - RANK_ORDER.indexOf(b);
    });

    return sortedEntries;
  }, [filteredParticipants]);

  console.log("groupedPlayers", groupedPlayers);

  const handleDragEndWithinGroup = (
    event: DragEndEvent,
    groupPlayers: Player[],
  ) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = groupPlayers.findIndex((p) => p.id === active.id);
    const newIndex = groupPlayers.findIndex((p) => p.id === over.id);
    const reorderedGroup = arrayMove(groupPlayers, oldIndex, newIndex);

    const reorderedIds = new Set(reorderedGroup.map((p) => p.id));
    const otherPlayers = participants.filter((p) => !reorderedIds.has(p.id));

    const firstIndex = participants.findIndex((p) => reorderedIds.has(p.id));
    const newPlayers = [
      ...otherPlayers.slice(0, firstIndex),
      ...reorderedGroup,
      ...otherPlayers.slice(firstIndex),
    ];

    onPlayersChange(newPlayers);
  };

  const deleteParticipantByID = async (id: string) => {
    const rq = create(DeleteTournamentParticipantByIDRequestSchema, {
      id,
    });
    await ParticipantClient.deleteTournamentParticipantByID(rq);
  };

  const deleteParticipantMutation = useMutation({
    mutationFn: (id: string) => deleteParticipantByID(id),

    onSuccess: () => {
      console.log("deleted");

      void queryClient.invalidateQueries({
        queryKey: ["tournament"],
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const onDeletePlayer = (id: string) => {
    deleteParticipantMutation.mutate(id);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-0 transition-all duration-200 hover:[border-color:rgba(255,255,255,0.2)]"
        style={{
          background: "linear-gradient(135deg, #1a1d27, #22263a)",
          border: `1px solid ${COLORS.border}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <Users size={14} style={{ color: COLORS.gold }} />
        Xem danh sách người chơi
      </button>

      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closable={false}
        width={"70%"}
        styles={{
          container: {
            padding: 0,
          },
        }}
      >
        <div
          className="flex-shrink-0 flex items-center justify-between px-9 py-6"
          style={{
            borderBottom: `1px solid ${COLORS.borderSubtle}`,
            background: "rgba(255,255,255,0.015)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${COLORS.green}18`,
                border: `1px solid ${COLORS.green}30`,
                color: COLORS.green,
              }}
            >
              <Users size={17} />
            </div>
            <div>
              <h4
                className="text-lg font-bold text-white m-0"
                style={{ letterSpacing: "-0.01em" }}
              >
                Danh sách tuyển thủ tham gia (
                <span className="font-bold text-base">
                  {participants.length}
                </span>
                )
              </h4>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-0 transition-all duration-150 hover:bg-[rgba(239,68,68,0.15)] hover:text-[#ef4444]"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: COLORS.closeBtnColor,
            }}
          >
            <X size={13} />
          </button>
        </div>

        <div
          className="flex items-center gap-3 px-9 py-4"
          style={{ borderBottom: `1px solid ${COLORS.borderSubtle}` }}
        >
          <Input
            size="large"
            placeholder={"Nhập tên người chơi"}
            prefix={
              <Search size={14} style={{ color: COLORS.textSecondary }} />
            }
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />

          <Segmented
            size="large"
            value={viewMode}
            onChange={(v) => setViewMode(v as "list" | "grid")}
            styles={{
              label: {
                display: "flex",
                justifyItems: "center",
                paddingTop: 8,
              },
            }}
            options={[
              {
                value: "grid",
                label: (
                  <Tooltip title="Hiển thị dạng lưới">
                    <LayoutGrid size={18} />
                  </Tooltip>
                ),
              },
              {
                value: "list",
                label: (
                  <Tooltip title="Hiển thị dạng danh sách">
                    <List size={18} />
                  </Tooltip>
                ),
              },
            ]}
          />

          {/* <button
            onClick={() => setAddOpen(true)}
            disabled
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white cursor-pointer border-0 transition-all duration-200 hover:[border-color:rgba(255,255,255,0.2)] whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #1a1d27, #22263a)",
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <UserPlus size={14} style={{ color: COLORS.green }} />
            Thêm người chơi
          </button> */}
        </div>

        <div
          className="sys-scroll py-4 max-h-[80vh] overflow-y-auto px-8"
          style={{ background: COLORS.surface }}
        >
          {isFetching ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
              <span>Đang tải dữ liệu</span>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users size={28} style={{ color: COLORS.textSecondary }} />
              <p
                className="text-[12px]"
                style={{ color: COLORS.textSecondary }}
              >
                Không có người chơi phù hợp!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groupedPlayers.map(([rankKey, groupPlayers]) => {
                const isPro = rankKey === "PRO";
                const isUNRANKED = rankKey === "UNRANKED";

                return (
                  <div key={rankKey} className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 px-1">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: isPro
                            ? `${GOLD}22`
                            : isUNRANKED
                              ? "rgba(255,255,255,0.06)"
                              : `${COLORS.green}18`,
                          color: isPro
                            ? GOLD
                            : isUNRANKED
                              ? COLORS.textSecondary
                              : COLORS.green,
                          border: `1px solid ${
                            isPro
                              ? `${GOLD}45`
                              : isUNRANKED
                                ? "rgba(255,255,255,0.1)"
                                : `${COLORS.green}30`
                          }`,
                        }}
                      >
                        {isPro ? (
                          <Crown size={12} fill={GOLD} />
                        ) : isUNRANKED ? (
                          "?"
                        ) : (
                          rankKey
                        )}
                      </div>
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: isPro ? GOLD : COLORS.textSecondary }}
                      >
                        {isPro
                          ? "Chuyên nghiệp"
                          : isUNRANKED
                            ? "Chưa xếp hạng"
                            : `Hạng ${rankKey}`}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{ color: COLORS.textSecondary }}
                      >
                        ({groupPlayers.length})
                      </span>
                      <div
                        className="flex-1 h-px"
                        style={{
                          background: isPro ? `${GOLD}30` : COLORS.borderFaint,
                        }}
                      />
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(e) =>
                        handleDragEndWithinGroup(e, groupPlayers)
                      }
                    >
                      <SortableContext
                        items={groupPlayers.map((p) => p.id)}
                        strategy={
                          viewMode === "grid"
                            ? rectSortingStrategy
                            : verticalListSortingStrategy
                        }
                      >
                        <div
                          className={
                            viewMode === "grid"
                              ? "grid grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-3"
                              : "flex flex-col gap-1"
                          }
                        >
                          {groupPlayers.map((player) => (
                            <PlayerCard
                              key={player.id}
                              player={player}
                              viewMode={viewMode}
                              onDelete={onDeletePlayer}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                );
              })}
            </div>
          )}

          {!isFetching && isSearching && (
            <p
              className="text-[10px] mt-3"
              style={{ color: COLORS.textSecondary }}
            >
              Search theo tên ngươi chơi hoặc quốc gia
            </p>
          )}
        </div>
      </Modal>

      <AddPlayerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={onAddPlayer}
      />
    </>
  );
};
