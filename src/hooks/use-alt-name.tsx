import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AltNameContextType {
  isAltName: boolean;
  toggleAltName: () => void;
}

const AltNameContext = createContext<AltNameContextType | undefined>(undefined);

export function AltNameProvider({ children }: { children: ReactNode }) {
  const [isAltName, setIsAltName] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("isAltName");
      return stored === "true";
    }
    return false;
  });

  const toggleAltName = useCallback(() => {
    setIsAltName((prev) => {
      const newValue = !prev;
      localStorage.setItem("isAltName", String(newValue));
      return newValue;
    });
  }, []);

  return (
    <AltNameContext.Provider value={{ isAltName, toggleAltName }}>
      {children}
    </AltNameContext.Provider>
  );
}

export function useAltName() {
  const context = useContext(AltNameContext);
  if (!context) {
    throw new Error("useAltName must be used within an AltNameProvider");
  }
  return context;
}
