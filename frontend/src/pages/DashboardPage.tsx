import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore, useFeedStore, useTodoStore } from "../store";
import { getTodayFeed, getTomorrowFeed, getPeriodFeed, getTodos } from "../services/api";
import TodayTab from "../components/TodayTab";
import TomorrowTab from "../components/TomorrowTab";
import PeriodTab from "../components/PeriodTab";
import TodosTab from "../components/TodosTab";

type TabType = "today" | "tomorrow" | "week" | "month" | "year" | "todos";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [loading, setLoading] = useState(false);

  // Khuyến nghị: dùng selector để tránh re-render không cần thiết
  const { profile, logout } = useAuthStore((s) => ({ profile: s.profile, logout: s.logout }));

  const { todayFeed, setTodayFeed, setTomorrowFeed, setPeriodFeed } = useFeedStore((s) => ({
    todayFeed: s.todayFeed,
    setTodayFeed: s.setTodayFeed,
    setTomorrowFeed: s.setTomorrowFeed,
    setPeriodFeed: s.setPeriodFeed,
  }));

  const { setTodos } = useTodoStore((s) => ({ setTodos: s.setTodos }));

  // Danh sách tab (đã sửa tiếng Việt hiển thị đúng)
  const tabs = useMemo(
    () => [
      { id: "today" as TabType, label: "Hôm nay" },
      { id: "tomorrow" as TabType, label: "Ngày mai" },
      { id: "week" as TabType, label: "Tuần" },
      { id: "month" as TabType, label: "Tháng" },
      { id: "year" as TabType, label: "Năm" },
      { id: "todos" as TabType, label: "To-do" },
    ],
    []
  );

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case "today": {
            // chỉ gọi nếu chưa có
            if (!todayFeed) {
              const res = await getTodayFeed("vi");
              if (!cancelled) setTodayFeed(res.data);
            }
            break;
          }
          case "tomorrow": {
            const res = await getTomorrowFeed("vi");
            if (!cancelled) setTomorrowFeed(res.data);
            break;
          }
          case "week":
          case "month":
          case "year": {
            const res = await getPeriodFeed(activeTab, "vi");
            if (!cancelled) setPeriodFeed(res.data);
            break;
          }
          case "todos": {
            const res = await getTodos();
            if (!cancelled) setTodos(res.data.todos);
            break;
          }
        }
      } catch (err) {
        console.error("Load data error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [activeTab, todayFeed, setPeriodFeed, setTodayFeed, setTomorrowFeed, setTodos]);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#c79a4b]">CHẠM</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile?.fullName || "Người dùng"}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-[64px] z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-[#c79a4b] border-b-2 border-[#c79a4b]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c79a4b]" />
          </div>
        ) : (
          <>
            {activeTab === "today" && <TodayTab />}
            {activeTab === "tomorrow" && <TomorrowTab />}
            {(activeTab === "week" || activeTab === "month" || activeTab === "year") && (
              <PeriodTab scope={activeTab} />
            )}
            {activeTab === "todos" && <TodosTab />}
          </>
        )}
      </main>
    </div>
  );
}