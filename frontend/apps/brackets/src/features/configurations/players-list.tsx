import { useMemo, useState } from "react";
import {
  Modal,
  Input,
  Segmented,
  Form,
  Dropdown,
  type MenuProps,
  Tooltip,
} from "antd";
import {
  Users,
  Search,
  UserPlus,
  List,
  LayoutGrid,
  GripVertical,
  Trash2,
  X,
  Crown,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { COLORS } from "./settings/consts/color";
import { useTournamentStore } from "@/store/match";
import { ParticipantClient } from "@/helper/service-client";
import { ParticipantSchema } from "@gd/proto/participant/v1/participant_pb";
import { create } from "@bufbuild/protobuf";
import { GetTournamentByIDRequestSchema } from "@gd/proto/tournament/v1/tournament_service_pb";
import { GetParticipantsByTournamentIDRequestSchema } from "@gd/proto/participant/v1/participant_service_pb";
import { useQuery } from "@tanstack/react-query";
import { useParticipantsByTournamentID } from "./players/hooks";

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

  const isPro = player.rank === "CN";

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
      // label: t("players.card.delete"),
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
            background: isPro ? `${GOLD}0d` : undefined,
            border: isPro ? `1px solid ${GOLD}35` : "1px solid transparent",
            boxShadow: isPro ? `0 0 16px ${GOLD}15` : undefined,
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
              background: isPro ? `${GOLD}1f` : `${COLORS.green}14`,
              color: isPro ? GOLD : COLORS.green,
              border: `1px solid ${isPro ? `${GOLD}40` : `${COLORS.green}28`}`,
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
            style={{ color: isPro ? "#fef3c7" : "#ffffff" }}
          >
            {player.name}
            {isPro && <Crown size={12} style={{ color: GOLD }} fill={GOLD} />}
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
          background: isPro ? `${GOLD}0d` : "rgba(255,255,255,0.02)",
          border: `1px solid ${isPro ? `${GOLD}40` : COLORS.borderFaint}`,
          boxShadow: isPro ? `0 0 20px ${GOLD}18` : undefined,
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

        <div className="relative">
          <img
            src={flagUrl}
            alt={player.nationality}
            className="w-9 h-6 rounded object-cover"
            style={{ border: `1px solid ${COLORS.border}` }}
          />
          <div
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: isPro ? GOLD : COLORS.green,
              color: "#0B0C12",
            }}
          >
            {player.seed}
          </div>
        </div>

        <span
          className="text-[13px] font-semibold text-center truncate w-full"
          style={{ color: isPro ? "#fef3c7" : "#ffffff" }}
        >
          {player.name}
        </span>

        <span className="text-[10px] text-zinc-500">{player.nationality}</span>
      </div>
    </Dropdown>
  );
};

export const PlayersModal = ({
  players,
  onPlayersChange,
  onDeletePlayer,
  onAddPlayer,
}: {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onDeletePlayer: (id: string) => void;
  onAddPlayer: (name: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const t1 = useTournamentStore();
  console.log("t1", t1);

  const foo = useParticipantsByTournamentID({
    tournamentId: t1.tournament?.id ?? "",
  });
  console.log("fpp", foo.data);

  const filtered = useMemo(
    () =>
      players.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [players, search],
  );

  const groupedPlayers = useMemo(() => {
    const groups = new Map<string, Player[]>();

    filtered.forEach((player) => {
      const key = player.rank ?? "unranked";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(player);
    });

    const sortedEntries = Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "unranked") return 1;
      if (b === "unranked") return -1;
      return RANK_ORDER.indexOf(a) - RANK_ORDER.indexOf(b);
    });

    return sortedEntries;
  }, [filtered]);

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
    const otherPlayers = players.filter((p) => !reorderedIds.has(p.id));

    const firstIndex = players.findIndex((p) => reorderedIds.has(p.id));
    const newPlayers = [
      ...otherPlayers.slice(0, firstIndex),
      ...reorderedGroup,
      ...otherPlayers.slice(firstIndex),
    ];

    onPlayersChange(newPlayers);
  };

  const isSearching = search.trim().length > 0;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Xem danh sách người chơi</button>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        closable={false}
        width={1080}
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
              className="w-9 h-9 rounded-xl flex items-center justify-center"
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
                className="text-[14px] font-bold text-white m-0"
                style={{ letterSpacing: "-0.01em" }}
              >
                Danh sách tuyển thủ tham gia
              </h4>
              <p className="">Tổng số: 123</p>
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
                value: "list",
                label: (
                  <Tooltip title="Hiển thị dạng danh sách">
                    <List size={18} />
                  </Tooltip>
                ),
              },
              {
                value: "grid",
                label: (
                  <Tooltip title="Hiển thị dạng lưới">
                    <LayoutGrid size={18} />
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users size={28} style={{ color: COLORS.textSecondary }} />
              <p
                className="text-[12px]"
                style={{ color: COLORS.textSecondary }}
              >
                {t("players.modal.empty")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groupedPlayers.map(([rankKey, groupPlayers]) => {
                const isPro = rankKey === "CN";
                const isUnranked = rankKey === "unranked";

                return (
                  <div key={rankKey} className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5 px-1">
                      <div
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: isPro
                            ? `${GOLD}22`
                            : isUnranked
                              ? "rgba(255,255,255,0.06)"
                              : `${COLORS.green}18`,
                          color: isPro
                            ? GOLD
                            : isUnranked
                              ? COLORS.textSecondary
                              : COLORS.green,
                          border: `1px solid ${
                            isPro
                              ? `${GOLD}45`
                              : isUnranked
                                ? "rgba(255,255,255,0.1)"
                                : `${COLORS.green}30`
                          }`,
                        }}
                      >
                        {isPro ? (
                          <Crown size={12} fill={GOLD} />
                        ) : isUnranked ? (
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
                          : isUnranked
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
                              ? "grid grid-cols-4 gap-3"
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

          {isSearching && (
            <p
              className="text-[10px] mt-3"
              style={{ color: COLORS.textSecondary }}
            >
              {t("players.modal.searchDragHint")}
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
