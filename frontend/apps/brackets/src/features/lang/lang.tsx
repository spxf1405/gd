import { Switch } from "antd";
import { useTranslation } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const isEnglish = i18n.language === "en";

  const handleChange = (checked: boolean) => {
    const nextLang = checked ? "en" : "vi";
    i18n.changeLanguage(nextLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-xs font-semibold transition-colors ${
          !isEnglish ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        VI
      </span>
      <Switch size="middle" checked={isEnglish} onChange={handleChange} />
      <span
        className={`text-xs font-semibold transition-colors ${
          isEnglish ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        EN
      </span>
    </div>
  );
}