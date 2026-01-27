import { Users, X } from "lucide-react";
import { Dialog } from "radix-ui";
import { useState } from "react";

const PlayersDialog = () => {
  const [isDark, setIsDark] = useState(true);

  const players = [
    { name: "Dương Quốc Hoàng", flag: "vn" },
    { name: "Nguyễn Anh Tuấn", flag: "vn" },
    { name: "Đặng Thành Kiên", flag: "vn" },
    { name: "Lường Đức Thiện", flag: "vn" },
    { name: "Đỗ Thế Kiên", flag: "vn" },
    { name: "Phạm Phương Nam", flag: "vn" },
    { name: "Tạ Văn Linh", flag: "vn" },
    { name: "Efren Reyes", flag: "ph" },
    { name: "Francisco Sanchez Ruiz", flag: "es" },
    { name: "Shane Van Boening", flag: "us" },
    { name: "Joshua Filler", flag: "de" },
    { name: "Fednor Gorst", flag: "us" },
    { name: "Jayson Shaw", flag: "gb" },
    { name: "Albin Ouschan", flag: "at" },
    { name: "Ko Pin Yi", flag: "tw" },
    { name: "Ko Ping Chung", flag: "tw" },
    { name: "Carlo Biado", flag: "ph" },
    { name: "Johann Chua", flag: "ph" },
    { name: "James Aranas", flag: "ph" },
    { name: "Eklent Kaci", flag: "al" },
    { name: "David Alcaide", flag: "es" },
    { name: "Mario He", flag: "at" },
    { name: "Alexander Kazakis", flag: "gr" },
    { name: "Aloysius Yapp", flag: "sg" },
    { name: "Naoyuki Oi", flag: "jp" },
    { name: "Skyler Woodward", flag: "us" },
    { name: "Tyler Styer", flag: "us" },
    { name: "Billy Thorpe", flag: "us" },
    { name: "Wu Kun Lin", flag: "tw" },
    { name: "Chang Jung Lin", flag: "tw" },
    { name: "Chang Yu Lung", flag: "tw" },
    { name: "Wiktor Zielinski", flag: "pl" },
    { name: "Konrad Juszczyszyn", flag: "pl" },
    { name: "Mieszko Fortunski", flag: "pl" },
    { name: "Wojciech Szewczyk", flag: "pl" },
    { name: "Niels Feijen", flag: "nl" },
    { name: "Marc Bijsterbosch", flag: "nl" },
    { name: "Oliver Szolnoki", flag: "hu" },
    { name: "Ralf Souquet", flag: "de" },
    { name: "Thorsten Hohmann", flag: "de" },
    { name: "Mika Immonen", flag: "fi" },
    { name: "Darren Appleton", flag: "gb" },
    { name: "Alex Pagulayan", flag: "ca" },
    { name: "John Morra", flag: "ca" },
    { name: "Roland Garcia", flag: "ph" },
    { name: "Lee Van Corteza", flag: "ph" },
    { name: "Dennis Orcollo", flag: "ph" },
    { name: "Roberto Gomez", flag: "ph" },
    { name: "Bader Alawadhi", flag: "kw" },
    { name: "Mohammad Soufi", flag: "sy" },
    { name: "Sanjin Pehlivanovic", flag: "ba" },
    { name: "Dương Quốc Hoàng", flag: "vn" },
    { name: "Nguyễn Anh Tuấn", flag: "vn" },
    { name: "Đặng Thành Kiên", flag: "vn" },
    { name: "Lường Đức Thiện", flag: "vn" },
    { name: "Đỗ Thế Kiên", flag: "vn" },
    { name: "Phạm Phương Nam", flag: "vn" },
    { name: "Tạ Văn Linh", flag: "vn" },
    { name: "Efren Reyes", flag: "ph" },
    { name: "Francisco Sanchez Ruiz", flag: "es" },
    { name: "Shane Van Boening", flag: "us" },
    { name: "Joshua Filler", flag: "de" },
    { name: "Fednor Gorst", flag: "us" },
    { name: "Jayson Shaw", flag: "gb" },
    { name: "Albin Ouschan", flag: "at" },
    { name: "Ko Pin Yi", flag: "tw" },
    { name: "Ko Ping Chung", flag: "tw" },
    { name: "Carlo Biado", flag: "ph" },
    { name: "Johann Chua", flag: "ph" },
    { name: "James Aranas", flag: "ph" },
    { name: "Eklent Kaci", flag: "al" },
    { name: "David Alcaide", flag: "es" },
    { name: "Mario He", flag: "at" },
    { name: "Alexander Kazakis", flag: "gr" },
    { name: "Aloysius Yapp", flag: "sg" },
    { name: "Naoyuki Oi", flag: "jp" },
    { name: "Skyler Woodward", flag: "us" },
    { name: "Tyler Styer", flag: "us" },
    { name: "Billy Thorpe", flag: "us" },
    { name: "Wu Kun Lin", flag: "tw" },
    { name: "Chang Jung Lin", flag: "tw" },
    { name: "Chang Yu Lung", flag: "tw" },
    { name: "Wiktor Zielinski", flag: "pl" },
    { name: "Konrad Juszczyszyn", flag: "pl" },
    { name: "Mieszko Fortunski", flag: "pl" },
    { name: "Wojciech Szewczyk", flag: "pl" },
    { name: "Niels Feijen", flag: "nl" },
    { name: "Marc Bijsterbosch", flag: "nl" },
    { name: "Oliver Szolnoki", flag: "hu" },
    { name: "Ralf Souquet", flag: "de" },
    { name: "Thorsten Hohmann", flag: "de" },
    { name: "Mika Immonen", flag: "fi" },
    { name: "Darren Appleton", flag: "gb" },
    { name: "Alex Pagulayan", flag: "ca" },
    { name: "John Morra", flag: "ca" },
    { name: "Roland Garcia", flag: "ph" },
    { name: "Lee Van Corteza", flag: "ph" },
    { name: "Dennis Orcollo", flag: "ph" },
    { name: "Roberto Gomez", flag: "ph" },
    { name: "Bader Alawadhi", flag: "kw" },
    { name: "Mohammad Soufi", flag: "sy" },
    { name: "Sanjin Pehlivanovic", flag: "ba" },
    { name: "Dương Quốc Hoàng", flag: "vn" },
    { name: "Nguyễn Anh Tuấn", flag: "vn" },
    { name: "Đặng Thành Kiên", flag: "vn" },
    { name: "Lường Đức Thiện", flag: "vn" },
    { name: "Đỗ Thế Kiên", flag: "vn" },
    { name: "Phạm Phương Nam", flag: "vn" },
    { name: "Tạ Văn Linh", flag: "vn" },
    { name: "Efren Reyes", flag: "ph" },
    { name: "Francisco Sanchez Ruiz", flag: "es" },
    { name: "Shane Van Boening", flag: "us" },
    { name: "Joshua Filler", flag: "de" },
    { name: "Fednor Gorst", flag: "us" },
    { name: "Jayson Shaw", flag: "gb" },
    { name: "Albin Ouschan", flag: "at" },
    { name: "Ko Pin Yi", flag: "tw" },
    { name: "Ko Ping Chung", flag: "tw" },
    { name: "Carlo Biado", flag: "ph" },
    { name: "Johann Chua", flag: "ph" },
    { name: "James Aranas", flag: "ph" },
    { name: "Eklent Kaci", flag: "al" },
    { name: "David Alcaide", flag: "es" },
    { name: "Mario He", flag: "at" },
    { name: "Alexander Kazakis", flag: "gr" },
    { name: "Aloysius Yapp", flag: "sg" },
    { name: "Naoyuki Oi", flag: "jp" },
    { name: "Skyler Woodward", flag: "us" },
    { name: "Tyler Styer", flag: "us" },
    { name: "Billy Thorpe", flag: "us" },
    { name: "Wu Kun Lin", flag: "tw" },
    { name: "Chang Jung Lin", flag: "tw" },
    { name: "Chang Yu Lung", flag: "tw" },
    { name: "Wiktor Zielinski", flag: "pl" },
    { name: "Konrad Juszczyszyn", flag: "pl" },
    { name: "Mieszko Fortunski", flag: "pl" },
    { name: "Wojciech Szewczyk", flag: "pl" },
    { name: "Niels Feijen", flag: "nl" },
    { name: "Marc Bijsterbosch", flag: "nl" },
    { name: "Oliver Szolnoki", flag: "hu" },
    { name: "Ralf Souquet", flag: "de" },
    { name: "Thorsten Hohmann", flag: "de" },
    { name: "Mika Immonen", flag: "fi" },
    { name: "Darren Appleton", flag: "gb" },
    { name: "Alex Pagulayan", flag: "ca" },
    { name: "John Morra", flag: "ca" },
    { name: "Roland Garcia", flag: "ph" },
    { name: "Lee Van Corteza", flag: "ph" },
    { name: "Dennis Orcollo", flag: "ph" },
    { name: "Roberto Gomez", flag: "ph" },
    { name: "Bader Alawadhi", flag: "kw" },
    { name: "Mohammad Soufi", flag: "sy" },
    { name: "Sanjin Pehlivanovic", flag: "ba" },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button className="inline-flex !bg-[#151829] items-center gap-2 border border-accent-blue/20 rounded-lg px-3 py-2 text-white !text-sm">
            <Users className="h-4 w-4" /> Danh sách cơ thủ
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity" />

          <Dialog.Content
            className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[95vw] max-w-[90%] max-h-[90vh] overflow-y-auto thin-scroll
                bg-[#f0f4f8] dark:bg-[#050505]
                p-8 rounded-2xl
                border-2 border-blue-600/50
                shadow-[0_0_50px_rgba(37,99,235,0.3)]
                z-50 transition-all focus:outline-none
                ${isDark ? "dark" : ""}
            `}
          >
            <div className="flex justify-between items-start mb-10 border-b-4 border-blue-600 pb-8">
              <div className="flex items-center gap-6">
                <div className="bg-white p-3 rounded-xl hidden md:block shadow-md">
                  <img
                    src="https://www.wpa-pool.com/wp-content/uploads/2021/04/WPA-Logo-300x164.png"
                    className="h-14"
                    alt="WPA"
                  />
                </div>
                <div>
                  <Dialog.Title className="text-blue-600 dark:text-blue-500 text-3xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                    PREDATOR{" "}
                    <span className="text-slate-800 dark:text-white">
                      WORLD CHAMPIONSHIP
                    </span>
                  </Dialog.Title>
                  <p className="text-slate-600 dark:text-blue-400 font-bold tracking-[0.2em] text-xs uppercase mt-2">
                    17 - 19 SEP 2025 | HO CHI MINH CITY
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={() => setIsDark(!isDark)}
                  className="p-2 rounded-full bg-blue-600/10 border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                >
                  {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>
                <Dialog.Close
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-all"
                  asChild
                >
                  <X className="w-6 h-6 text-white stroke-[4] hover:cursor-pointer" />
                </Dialog.Close>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {players.map((player, i) => (
                <div
                  key={i}
                  className="relative flex items-center gap-3 p-3 bg-white dark:bg-[#0a0a0d] border-2 border-blue-600/30 dark:border-blue-600/50 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:border-blue-500 transition-all group cursor-default"
                >
                  <div className="shrink-0 relative">
                    <img
                      src={`https://flagcdn.com/w80/${player.flag}.png`}
                      className="w-10 h-6 object-cover rounded shadow-sm"
                      alt={player.flag}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-white font-bold text-[10px] uppercase truncate group-hover:text-blue-500 transition-colors">
                      {player.name}
                    </p>
                  </div>
                  <div className="absolute -inset-1 bg-blue-500/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </div>
              ))}
            </div>

            <div className="mt-16 flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
              <div className="h-6 w-20 bg-slate-300 dark:bg-zinc-800 rounded"></div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-zinc-800 rounded"></div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-zinc-800 rounded"></div>
              <div className="h-6 w-20 bg-slate-300 dark:bg-zinc-800 rounded"></div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export { PlayersDialog };
