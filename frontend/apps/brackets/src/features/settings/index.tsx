import React, { useState } from "react";
import {
  X,
  Trophy,
  Info,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  Upload,
  Palette,
  Settings,
} from "lucide-react";
import { Dialog, Tabs } from "radix-ui";

interface TournamentSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament?: any;
  onSave?: (data: any) => void;
}

export const Setting: React.FC<TournamentSettingsDialogProps> = ({
  open,
  onOpenChange,
  tournament,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    // Basic Info
    name: tournament?.name || "",
    type: tournament?.type || "8-Ball",
    format: tournament?.format || "Đơn",
    organizer: tournament?.organizer || "",
    description: "",

    // Schedule & Location
    startDate: tournament?.startDate || "",
    endDate: tournament?.endDate || "",
    location: tournament?.location || "",
    tables: tournament?.tables || 8,

    // Finance
    totalPrize: tournament?.totalPrize || 0,
    entryFee: tournament?.entryFee || 0,
    prizeDistribution: "50-30-20",

    // Players
    maxPlayers: tournament?.maxPlayers || 32,
    minAge: 16,
    gender: "Tất cả",
    skillLevel: "Tất cả",

    // Media
    background: null as File | null,
    backgroundPreview: "",
    avatar: null as File | null,
    avatarPreview: "",
    themeColor: "#00D9FF",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (
    field: "background" | "avatar",
    file: File | null,
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave?.(formData);
    onOpenChange(false);
  };

  return (
    <div className="dark">
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Trigger asChild>
          <button className="inline-flex !bg-[#151829] items-center gap-2 border border-blue-500/20 rounded-lg px-3 py-2 text-white text-sm hover:border-blue-500/50 transition-all group cursor-pointer">
            <Settings className="w-4 h-4 text-blue-400 group-hover:rotate-90 transition-transform duration-300" />
            Cài đặt giải đấu
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-cyan-500/20 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 p-4 border-b border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                    <Trophy className="text-white" size={20} />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Cài đặt giải đấu
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-gray-400 mt-0.5">
                      Tùy chỉnh thông tin và cài đặt cho giải đấu của bạn
                    </Dialog.Description>
                  </div>
                </div>
                <Dialog.Close className="w-9 h-9 rounded-lg bg-gray-800/50 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 flex items-center justify-center transition-all duration-200 group" asChild>
                  <X
                    className="text-gray-400 group-hover:text-red-400"
                    size={18}
                  />
                </Dialog.Close>
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs.Root
              defaultValue="basic"
              className="flex h-[calc(95vh-140px)] dark"
            >
              {/* Sidebar Tabs */}
              <Tabs.List className="w-56 bg-gray-900/50 border-r border-cyan-500/10 p-3 space-y-1.5 overflow-y-auto">
                <TabTrigger value="basic" icon={<Info size={16} />}>
                  Thông tin cơ bản
                </TabTrigger>
                <TabTrigger value="schedule" icon={<Calendar size={16} />}>
                  Lịch trình & Địa điểm
                </TabTrigger>
                <TabTrigger value="finance" icon={<DollarSign size={16} />}>
                  Tài chính
                </TabTrigger>
                <TabTrigger value="players" icon={<Users size={16} />}>
                  Người chơi
                </TabTrigger>
                <TabTrigger value="media" icon={<ImageIcon size={16} />}>
                  Hình ảnh & Theme
                </TabTrigger>
              </Tabs.List>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* Basic Info Tab */}
                <Tabs.Content value="basic" className="space-y-4">
                  <SectionHeader
                    icon={<Info size={18} />}
                    title="Thông tin cơ bản"
                  />

                  <FormField label="Tên giải đấu" required>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="VD: Giải Vô Địch 8-Ball Hà Nội 2026"
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Loại hình" required>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          handleInputChange("type", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      >
                        <option value="8-Ball">8-Ball</option>
                        <option value="9-Ball">9-Ball</option>
                        <option value="10-Ball">10-Ball</option>
                        <option value="Carom 3-băng">Carom 3-băng</option>
                        <option value="Snooker">Snooker</option>
                      </select>
                    </FormField>

                    <FormField label="Thể thức" required>
                      <select
                        value={formData.format}
                        onChange={(e) =>
                          handleInputChange("format", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      >
                        <option value="Đơn">Đơn</option>
                        <option value="Đôi">Đôi</option>
                        <option value="Đồng đội">Đồng đội</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Ban tổ chức" required>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) =>
                        handleInputChange("organizer", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="VD: CLB Billard Golden"
                    />
                  </FormField>

                  <FormField label="Mô tả giải đấu">
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      placeholder="Mô tả chi tiết về giải đấu..."
                    />
                  </FormField>

                  <SectionHeader
                    icon={<ImageIcon size={18} />}
                    title="Hình ảnh & Theme"
                  />

                  {/* Background Upload */}
                  <FormField label="Ảnh nền giải đấu">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "background",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="background-upload"
                      />
                      <label
                        htmlFor="background-upload"
                        className="block w-full h-40 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer overflow-hidden group hover:border-cyan-500/60 transition-all"
                      >
                        {formData.backgroundPreview ? (
                          <img
                            src={formData.backgroundPreview}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                            <Upload size={24} className="mb-1.5" />
                            <p className="text-xs">Click để tải ảnh nền</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Khuyến nghị: 1920x1080px
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormField>

                  {/* Avatar Upload */}
                  <FormField label="Logo/Avatar giải đấu">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "avatar",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="block w-28 h-28 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer overflow-hidden group hover:border-cyan-500/60 transition-all mx-auto"
                      >
                        {formData.avatarPreview ? (
                          <img
                            src={formData.avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                            <Upload size={20} className="mb-1" />
                            <p className="text-[10px]">Click để tải logo</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormField>

                  {/* Theme Color */}
                  <FormField label="Màu chủ đạo">
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.themeColor}
                        onChange={(e) =>
                          handleInputChange("themeColor", e.target.value)
                        }
                        className="w-12 h-10 rounded-lg cursor-pointer bg-gray-800 border border-cyan-500/20"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.themeColor}
                          onChange={(e) =>
                            handleInputChange("themeColor", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </FormField>

                  {/* Theme Preview */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-cyan-400 mb-3 flex items-center">
                      <Palette size={14} className="mr-1.5" />
                      Xem trước theme
                    </h4>
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(to bottom right, ${formData.themeColor}, #8B5CF6)`,
                        }}
                      >
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div>
                        <div
                          className="text-base font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${formData.themeColor}, #10B981)`,
                          }}
                        >
                          {formData.name || "Tên giải đấu"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Tournament Platform
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>

                {/* Schedule & Location Tab */}
                <Tabs.Content value="schedule" className="space-y-4">
                  <SectionHeader
                    icon={<Calendar size={18} />}
                    title="Lịch trình & Địa điểm"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Ngày bắt đầu" required>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </FormField>

                    <FormField label="Ngày kết thúc" required>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </FormField>
                  </div>

                  <FormField label="Địa điểm tổ chức" required>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500"
                        size={16}
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className="w-full pl-10 pr-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="VD: CLB Billard Golden, Hà Nội"
                      />
                    </div>
                  </FormField>

                  <FormField label="Số bàn billard" required>
                    <input
                      type="number"
                      value={formData.tables}
                      onChange={(e) =>
                        handleInputChange("tables", parseInt(e.target.value))
                      }
                      min="1"
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                  </FormField>
                </Tabs.Content>

                {/* Finance Tab */}
                <Tabs.Content value="finance" className="space-y-4">
                  <SectionHeader
                    icon={<DollarSign size={18} />}
                    title="Tài chính"
                  />

                  <FormField label="Tổng giải thưởng (VNĐ)" required>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"
                        size={16}
                      />
                      <input
                        type="number"
                        value={formData.totalPrize}
                        onChange={(e) =>
                          handleInputChange(
                            "totalPrize",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full pl-10 pr-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        placeholder="50000000"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.totalPrize > 0 &&
                        `≈ ${formData.totalPrize.toLocaleString("vi-VN")} đồng`}
                    </p>
                  </FormField>

                  <FormField label="Lệ phí tham gia (VNĐ)" required>
                    <input
                      type="number"
                      value={formData.entryFee}
                      onChange={(e) =>
                        handleInputChange("entryFee", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="500000"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.entryFee > 0 &&
                        `≈ ${formData.entryFee.toLocaleString("vi-VN")} đồng`}
                    </p>
                  </FormField>

                  <FormField label="Phân phối giải thưởng">
                    <select
                      value={formData.prizeDistribution}
                      onChange={(e) =>
                        handleInputChange("prizeDistribution", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="50-30-20">50% - 30% - 20% (Top 3)</option>
                      <option value="40-25-20-15">
                        40% - 25% - 20% - 15% (Top 4)
                      </option>
                      <option value="35-25-15-15-10">
                        35% - 25% - 15% - 15% - 10% (Top 5)
                      </option>
                    </select>
                  </FormField>

                  {/* Prize Preview */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-3">
                    <h4 className="text-xs font-semibold text-cyan-400 mb-2">
                      Dự kiến giải thưởng
                    </h4>
                    {formData.totalPrize > 0 && (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between text-yellow-400">
                          <span>🥇 Nhất:</span>
                          <span className="font-semibold">
                            {(formData.totalPrize * 0.5).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>🥈 Nhì:</span>
                          <span className="font-semibold">
                            {(formData.totalPrize * 0.3).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between text-orange-400">
                          <span>🥉 Ba:</span>
                          <span className="font-semibold">
                            {(formData.totalPrize * 0.2).toLocaleString(
                              "vi-VN",
                            )}{" "}
                            đ
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                {/* Players Tab */}
                <Tabs.Content value="players" className="space-y-4">
                  <SectionHeader
                    icon={<Users size={18} />}
                    title="Cài đặt người chơi"
                  />

                  <FormField label="Số lượng người chơi tối đa" required>
                    <select
                      value={formData.maxPlayers}
                      onChange={(e) =>
                        handleInputChange(
                          "maxPlayers",
                          parseInt(e.target.value),
                        )
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value={16}>16 người</option>
                      <option value={32}>32 người</option>
                      <option value={64}>64 người</option>
                      <option value={128}>128 người</option>
                    </select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Độ tuổi tối thiểu">
                      <input
                        type="number"
                        value={formData.minAge}
                        onChange={(e) =>
                          handleInputChange("minAge", parseInt(e.target.value))
                        }
                        min="0"
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </FormField>

                    <FormField label="Giới tính">
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      >
                        <option value="Tất cả">Tất cả</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Trình độ">
                    <select
                      value={formData.skillLevel}
                      onChange={(e) =>
                        handleInputChange("skillLevel", e.target.value)
                      }
                      className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    >
                      <option value="Tất cả">Tất cả</option>
                      <option value="Mới bắt đầu">Mới bắt đầu</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Nâng cao">Nâng cao</option>
                      <option value="Chuyên nghiệp">Chuyên nghiệp</option>
                    </select>
                  </FormField>
                </Tabs.Content>

                {/* Media Tab */}
                <Tabs.Content value="media" className="space-y-4">
                  <SectionHeader
                    icon={<ImageIcon size={18} />}
                    title="Hình ảnh & Theme"
                  />

                  {/* Background Upload */}
                  <FormField label="Ảnh nền giải đấu">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "background",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="background-upload"
                      />
                      <label
                        htmlFor="background-upload"
                        className="block w-full h-40 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer overflow-hidden group hover:border-cyan-500/60 transition-all"
                      >
                        {formData.backgroundPreview ? (
                          <img
                            src={formData.backgroundPreview}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                            <Upload size={24} className="mb-1.5" />
                            <p className="text-xs">Click để tải ảnh nền</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">
                              Khuyến nghị: 1920x1080px
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormField>

                  {/* Avatar Upload */}
                  <FormField label="Logo/Avatar giải đấu">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(
                            "avatar",
                            e.target.files?.[0] || null,
                          )
                        }
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="block w-28 h-28 border-2 border-dashed border-cyan-500/30 rounded-xl cursor-pointer overflow-hidden group hover:border-cyan-500/60 transition-all mx-auto"
                      >
                        {formData.avatarPreview ? (
                          <img
                            src={formData.avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                            <Upload size={20} className="mb-1" />
                            <p className="text-[10px]">Click để tải logo</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </FormField>

                  {/* Theme Color */}
                  <FormField label="Màu chủ đạo">
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={formData.themeColor}
                        onChange={(e) =>
                          handleInputChange("themeColor", e.target.value)
                        }
                        className="w-12 h-10 rounded-lg cursor-pointer bg-gray-800 border border-cyan-500/20"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.themeColor}
                          onChange={(e) =>
                            handleInputChange("themeColor", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-cyan-500/20 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
                        />
                      </div>
                    </div>
                  </FormField>

                  {/* Theme Preview */}
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-cyan-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-cyan-400 mb-3 flex items-center">
                      <Palette size={14} className="mr-1.5" />
                      Xem trước theme
                    </h4>
                    <div className="flex items-center space-x-2.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                        style={{
                          background: `linear-gradient(to bottom right, ${formData.themeColor}, #8B5CF6)`,
                        }}
                      >
                        <Trophy className="text-white" size={20} />
                      </div>
                      <div>
                        <div
                          className="text-base font-bold bg-clip-text text-transparent"
                          style={{
                            backgroundImage: `linear-gradient(to right, ${formData.themeColor}, #10B981)`,
                          }}
                        >
                          {formData.name || "Tên giải đấu"}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          Tournament Platform
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </div>
            </Tabs.Root>

            {/* Footer */}
            <div className="border-t border-cyan-500/20 bg-gray-900/50 p-3 flex justify-end space-x-2.5">
              <Dialog.Close asChild>
                <button className="px-5 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-all duration-200 border border-gray-700">
                  Hủy
                </button>
              </Dialog.Close>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg shadow-cyan-500/25"
              >
                Lưu cài đặt
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

// Helper Components
const TabTrigger: React.FC<{
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ value, icon, children }) => (
  <Tabs.Trigger
    value={value}
    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-white hover:bg-cyan-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-cyan-500/30 transition-all duration-200"
  >
    <span className="text-cyan-500">{icon}</span>
    <span className="font-medium text-xs">{children}</span>
  </Tabs.Trigger>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <div className="flex items-center space-x-2.5 pb-2.5 border-b border-cyan-500/20">
    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
      <span className="text-cyan-400">{icon}</span>
    </div>
    <h3 className="text-base font-semibold text-white">{title}</h3>
  </div>
);

const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-gray-300">
      {label}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);
