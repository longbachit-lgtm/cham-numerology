import React, { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GenderSelectPage() {
  const [gender, setGender] = useState<"male" | "female" | "other" | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!gender) return;
    sessionStorage.setItem("onboarding_gender", gender);
    navigate("/onboarding/dob"); // đổi route theo luồng của bạn
  };

  const handleBack = () => {
    navigate("/onboarding/name");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage:
          "radial-gradient(#f3d9a6 1px, transparent 1px), radial-gradient(#f3d9a6 1px, transparent 1px)",
        backgroundPosition: "0 0, 12px 12px",
        backgroundSize: "24px 24px",
        backgroundColor: "#fff8ec",
      }}
    >
      {/* Thanh tiến trình */}
      <div className="flex justify-center mb-4 gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === 2 ? "bg-[#c79a4b]" : "bg-[#d6c0a1] opacity-60"
            }`}
          />
        ))}
      </div>

      {/* Card chọn giới tính */}
      <div className="w-full max-w-md rounded-[18px] border border-[#c8b8a2] bg-[#fff4e6]/95 shadow-[0_10px_30px_rgba(60,40,20,.08)] p-6 text-center">
        <h2 className="text-[22px] font-extrabold text-[#c79a4b] mb-3">
          Giới tính
        </h2>

        <p className="text-[#6b5a4b] italic mb-6 text-[15px]">
          “Dù bạn là ai, năng lượng trong bạn vẫn là sự hòa hợp – giữa mạnh mẽ và dịu dàng.”
        </p>

        {/* Lựa chọn giới tính */}
        <div className="flex justify-center gap-6 mb-6">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`flex flex-col items-center gap-2 ${
              gender === "male" ? "opacity-100" : "opacity-60 hover:opacity-100"
            } transition`}
          >
            <span className="text-[48px] text-[#1d76ff]">♂</span>
            <span className="text-[#1d76ff] font-semibold">Nam</span>
          </button>

          <button
            type="button"
            onClick={() => setGender("female")}
            className={`flex flex-col items-center gap-2 ${
              gender === "female" ? "opacity-100" : "opacity-60 hover:opacity-100"
            } transition`}
          >
            <span className="text-[48px] text-[#ff6fae]">♀</span>
            <span className="text-[#ff6fae] font-semibold">Nữ</span>
          </button>

          <button
            type="button"
            onClick={() => setGender("other")}
            className={`flex flex-col items-center gap-2 ${
              gender === "other" ? "opacity-100" : "opacity-60 hover:opacity-100"
            } transition`}
          >
            <span className="text-[48px] text-[#aa76ff]">⚥</span>
            <span className="text-[#aa76ff] font-semibold">Khác</span>
          </button>
        </div>

        {/* Nút điều hướng */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handleBack}
            className="w-[64px] h-[48px] rounded-full bg-[#e1caa7] flex items-center justify-center hover:brightness-105 transition"
            aria-label="Quay lại"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            disabled={!gender}
            className={`w-[64px] h-[48px] rounded-full flex items-center justify-center transition ${
              gender
                ? "bg-[#c79a4b] hover:brightness-105"
                : "bg-[#c79a4b]/50 cursor-not-allowed"
            }`}
            aria-label="Tiếp tục"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Logo footer */}
      <div className="mt-6 text-center text-[#5a4639] font-bold text-lg">
        Chạm.
      </div>
    </div>
  );
}