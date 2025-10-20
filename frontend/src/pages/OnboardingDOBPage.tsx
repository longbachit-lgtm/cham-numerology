import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";

export default function OnboardingDOBPage() {
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(1999);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isValidDate = (d: number, m: number, y: number) => {
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const adjust = (type: "d" | "m" | "y", delta: number) => {
    setError("");
    if (type === "d") setDay((v) => clamp(v + delta, 1, 31));
    if (type === "m") setMonth((v) => clamp(v + delta, 1, 12));
    if (type === "y") setYear((v) => clamp(v + delta, 1900, new Date().getFullYear()));
  };

  const handleNext = () => {
    setError("");
    if (!isValidDate(day, month, year)) {
      setError("Ngày sinh không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    const dob = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    sessionStorage.setItem("onboarding_dob", dob);
    navigate("/onboarding/job");
  };

  const handleBack = () => navigate("/onboarding/name");

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(#f3d9a6 1px, transparent 1px), radial-gradient(#f3d9a6 1px, transparent 1px)",
        backgroundPosition: "0 0, 12px 12px",
        backgroundSize: "24px 24px",
        backgroundColor: "#fff8ec",
      }}
    >
      {/* Dots progress */}
      <div className="mb-3 flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#c79a4b] ring-2 ring-[#f2e2c8]" />
        <span className="w-3 h-3 rounded-full bg-[#c79a4b]" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
        <span className="w-3 h-3 rounded-full bg-[#d6c0a1] opacity-70" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-[18px] border border-[#c8b8a2] bg-[#fff4e6]/95 shadow-[0_10px_30px_rgba(60,40,20,.08)] p-6">
        <h2 className="text-center text-[22px] font-extrabold tracking-wide text-[#c79a4b]">
          Ngày tháng năm sinh
        </h2>

        <p className="mt-3 text-center text-[13px] text-[#9a744a] italic">
          “Khoảnh khắc bạn được sinh ra, vũ trụ khẽ đặt một bản đồ nhỏ trong tim bạn.”
        </p>

        {/* Steppers */}
        <div className="mt-5 flex items-end justify-center gap-3">
          <Stepper
            label="Ngày"
            value={day}
            display={String(day).padStart(2, "0")}
            onUp={() => adjust("d", +1)}
            onDown={() => adjust("d", -1)}
          />
          <Stepper
            label="Tháng"
            value={month}
            display={String(month).padStart(2, "0")}
            onUp={() => adjust("m", +1)}
            onDown={() => adjust("m", -1)}
          />
          <Stepper
            label="Năm"
            value={year}
            display={String(year).padStart(4, "0")}
            onUp={() => adjust("y", +1)}
            onDown={() => adjust("y", -1)}
          />
        </div>

        {error && (
          <div className="mt-3 text-red-700 text-sm bg-red-50 border border-red-200 p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center w-[88px] h-[46px] rounded-full bg-[#e8d6bd] text-[#6b5a4b] hover:brightness-105 active:translate-y-px transition"
            aria-label="Quay lại"
            title="Quay lại"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center w-[88px] h-[46px] rounded-full bg-[#c79a4b] text-white hover:brightness-105 active:translate-y-px transition"
            aria-label="Tiếp tục"
            title="Tiếp tục"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Logo dưới */}
      <div className="mt-4 text-[#5a4639] font-extrabold tracking-wide text-lg">Chạm.</div>
    </div>
  );
}

/** Ô stepper (giống mock: ô số lớn + mũi tên trên/dưới) */
function Stepper({
  label,
  value, // không dùng trực tiếp, chỉ để nhận props
  display,
  onUp,
  onDown,
}: {
  label: string;
  value: number;
  display: string;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={onUp}
        className="mb-2 inline-flex items-center justify-center w-9 h-7 rounded-md text-[#c79a4b] hover:bg-[#fff1e2] border border-[#e3cba3]"
        aria-label={`Tăng ${label.toLowerCase()}`}
        title={`Tăng ${label.toLowerCase()}`}
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      <div className="min-w-[92px] h-[54px] px-4 flex items-center justify-center rounded-[16px] border-2 border-[#d7a760] bg-white/95 text-[22px] font-extrabold text-[#6b5a4b]">
        {display}
      </div>

      <button
        type="button"
        onClick={onDown}
        className="mt-2 inline-flex items-center justify-center w-9 h-7 rounded-md text-[#c79a4b] hover:bg-[#fff1e2] border border-[#e3cba3]"
        aria-label={`Giảm ${label.toLowerCase()}`}
        title={`Giảm ${label.toLowerCase()}`}
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}