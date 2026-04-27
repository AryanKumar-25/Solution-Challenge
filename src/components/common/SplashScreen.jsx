import { useState, useEffect } from "react";

export default function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    const completeTimer = setTimeout(() => onComplete(), 3500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="splash-screen"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#E8F4FD",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? "scale(0.97)" : "scale(1)",
      }}
    >
      {/* Floating doodles */}
      <svg
        style={{ position: "absolute", top: "15%", left: "20%", animation: "float 6s ease-in-out infinite" }}
        width="28" height="28" viewBox="0 0 28 28" fill="none"
      >
        <path d="M14 2L17 10L26 12L17 14L14 22L11 14L2 12L11 10L14 2Z" fill="#FFD046" stroke="#1A1A2E" strokeWidth="1.5"/>
      </svg>
      <svg
        style={{ position: "absolute", top: "25%", right: "18%", animation: "float 9s ease-in-out infinite" }}
        width="24" height="24" viewBox="0 0 24 24" fill="none"
      >
        <path d="M12 4C12 4 4 9 4 14C4 18 7.5 21 12 21C16.5 21 20 18 20 14C20 9 12 4 12 4Z" fill="#FF4D8D" stroke="#1A1A2E" strokeWidth="1.5"/>
      </svg>
      <svg
        style={{ position: "absolute", bottom: "30%", left: "15%", animation: "float 12s ease-in-out infinite" }}
        width="20" height="20" viewBox="0 0 20 20" fill="none"
      >
        <circle cx="10" cy="10" r="3" fill="#6B4EFF"/>
        <path d="M10 1V5M10 15V19M1 10H5M15 10H19M3.5 3.5L6 6M14 14L16.5 16.5M16.5 3.5L14 6M6 14L3.5 16.5" stroke="#6B4EFF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Heart icon in purple container */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          background: "#6B4EFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(107,78,255,0.3)",
          animation: "springIn 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path
            d="M22 38S6 28 6 17C6 11 10.5 6 16 6C19 6 21.5 7.5 22 9C22.5 7.5 25 6 28 6C33.5 6 38 11 38 17C38 28 22 38 22 38Z"
            fill="#FF6B35"
            stroke="#1A1A2E"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Brand name */}
      <h1
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: 38,
          color: "#1A1A2E",
          marginTop: 20,
          opacity: 0,
          animation: "fadeUp 0.5s ease-out 0.5s forwards",
        }}
      >
        VolunteerBridge
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          fontSize: 16,
          color: "#6B7280",
          marginTop: 8,
          opacity: 0,
          animation: "fadeUp 0.5s ease-out 0.8s forwards",
        }}
      >
        Connecting hearts, changing lives 💛
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "rgba(107,78,255,0.1)",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#6B4EFF",
            borderRadius: "0 2px 2px 0",
            animation: "progressBar 3s linear forwards",
          }}
        />
      </div>
    </div>
  );
}
