import { useState, useEffect } from "react";

interface ClientInfo {
  browser: string;
  os: string;
  time: string;
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  
  return "Unknown Browser";
}

function getOS(): string {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  
  return platform || "Unknown OS";
}

function getTime(): string {
  return new Date().toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: true 
  });
}

export function useClientInfo(): ClientInfo {
  const [info, setInfo] = useState<ClientInfo>({
    browser: "",
    os: "",
    time: "",
  });

  useEffect(() => {
    const updateInfo = () => {
      setInfo({
        browser: getBrowser(),
        os: getOS(),
        time: getTime(),
      });
    };

    updateInfo();
    
    const interval = setInterval(() => {
      setInfo((prev) => ({
        ...prev,
        time: getTime(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return info;
}
