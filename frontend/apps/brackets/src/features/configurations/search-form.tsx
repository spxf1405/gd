import { Command } from "cmdk";
import {
  Command as CommandIcon,
  History,
  Search,
  Settings,
  Sword,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const BilliardSearchSystem = () => {
  const [open, setOpen] = useState(false);
  const triggerInputRef = useRef<HTMLInputElement>(null);

  // 1. Lắng nghe phím tắt "/"
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        (e.target as HTMLElement).tagName !== "INPUT" &&
        (e.target as HTMLElement).tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleTriggerFocus = () => {
    setOpen(true);
    triggerInputRef.current?.blur();
  };

  return (
    <>
      {/* --- FORM NHỎ BÊN NGOÀI (TRIGGER) --- */}
      <div className="w-full max-w-sm group relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 to-purple-600/40 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative flex items-center bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl">
          <div className="pl-3">
            <Search className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" />
          </div>
          <input
            ref={triggerInputRef}
            type="text"
            onFocus={handleTriggerFocus}
            onClick={() => setOpen(true)}
            placeholder="Nhấn vào đây hoặc / để tìm kiếm"
            className="w-full bg-transparent text-gray-300 px-3 py-2.5 outline-none placeholder:text-gray-600 text-sm cursor-pointer"
            readOnly
          />
          <div className="pr-3 flex items-center">
            <kbd className="flex items-center justify-center h-5 w-5 border border-gray-700 rounded bg-gray-800 text-[10px] font-bold text-gray-500 group-hover:text-cyan-400">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* --- COMMAND MENU DIALOG --- */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global Command Menu"
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4"
      >
        {/* FIX: Lớp nền để click ra ngoài là đóng */}  
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        />

        {/* Content Container */}
        <div className="relative w-full max-w-xl bg-gray-900 border border-gray-700/50 rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Search Header */}
          <div className="flex items-center px-4 border-b border-gray-800 bg-gray-900/50">
            <Search className="w-5 h-5 text-cyan-400 mr-3 animate-pulse" />
            <Command.Input
              autoFocus
              placeholder="Nhập lệnh hoặc tên cơ thủ..."
              className="w-full h-14 bg-transparent text-white outline-none placeholder:text-gray-600 text-base"
            />

            {/* FIX: Thêm sự kiện đóng cho nút X */}
            <button
              onClick={() => setOpen(false)}
              className="flex items-center !bg-dark-blue justify-center p-1 rounded-md hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Command.List className="max-h-[350px] overflow-y-auto p-2 thin-scroll">
            <Command.Empty className="py-12 text-center text-sm text-gray-500 italic">
              Không tìm thấy kết quả phù hợp...
            </Command.Empty>

            {/* Nhóm: Cơ thủ */}
            <Command.Group
              label="👤 Cơ thủ"
              className="px-2 py-2 text-[11px] font-bold text-cyan-500/80"
            >
              <Item
                icon={User}
                label="Efren Reyes"
                shortcut="Huyền thoại"
                color="text-cyan-400"
              />
              <Item
                icon={User}
                label="Trần Quyết Chiến"
                color="text-cyan-400"
              />
              <Item icon={User} label="Dick Jaspers" color="text-cyan-400" />
            </Command.Group>

            <div className="h-[1px] bg-gray-800/50 my-2 mx-2" />

            {/* Nhóm: Trận đấu */}
            <Command.Group
              label="🎱 Trận đấu"
              className="px-2 py-2 text-[11px] font-bold text-emerald-500/80"
            >
              <Item
                icon={Sword}
                label="Chung kết World Cup 2024"
                shortcut="Live"
                color="text-red-500"
              />
              <Item
                icon={History}
                label="Lịch sử đối đầu: Chiến vs Jaspers"
                color="text-emerald-400"
              />
            </Command.Group>

            <div className="h-[1px] bg-gray-800/50 my-2 mx-2" />

            {/* Nhóm: Vòng đấu */}
            <Command.Group
              label="🧭 Vòng đấu"
              className="px-2 py-2 text-[11px] font-bold text-purple-500/80"
            >
              <Item
                icon={Trophy}
                label="Vòng bảng A - Group Stage"
                color="text-purple-400"
              />
              <Item
                icon={Trophy}
                label="Tứ kết - Quarter Finals"
                color="text-purple-400"
              />
            </Command.Group>

            <div className="h-[1px] bg-gray-800/50 my-2 mx-2" />

            <Command.Group
              label="⚙️ Hệ thống"
              className="px-2 py-2 text-[11px] font-bold text-gray-500"
            >
              <Item icon={Settings} label="Cài đặt bàn đấu" shortcut="⌘ S" />
            </Command.Group>
          </Command.List>

          <div className="bg-gray-950/80 px-4 py-2 flex justify-between items-center border-t border-gray-800">
            <div className="flex items-center gap-2 opacity-50">
              <CommandIcon className="w-3 h-3 text-cyan-500" />
              <span className="text-[9px] text-white tracking-widest uppercase font-black">
                Billiard Engine v1.0
              </span>
            </div>
            <div className="flex gap-4 text-[10px] text-gray-600 font-bold">
              <span>↑↓ Duyệt</span>
              <span>↵ Chọn</span>
            </div>
          </div>
        </div>
      </Command.Dialog>
    </>
  );
};

const Item = ({
  icon: Icon,
  label,
  shortcut,
  color = "text-gray-500",
}: any) => (
  <Command.Item className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-gray-400 aria-selected:bg-white/[0.07] aria-selected:text-white transition-all outline-none group">
    <div
      className={`p-2 rounded-lg bg-gray-800/50 group-aria-selected:bg-gray-700 group-aria-selected:scale-110 transition-all duration-200`}
    >
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <span className="text-sm font-medium">{label}</span>
    {shortcut && (
      <span className="ml-auto text-[10px] text-gray-600 font-mono">
        {shortcut}
      </span>
    )}
  </Command.Item>
);

export default BilliardSearchSystem;
