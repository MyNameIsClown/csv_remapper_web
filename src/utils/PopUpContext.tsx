import { createContext, useContext, useState, ReactNode } from "react";

type PopUpContextType = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  content: ReactNode;
  setContent: (value: ReactNode) => void;
};

// Context
const PopUpContext = createContext<PopUpContextType | undefined>(undefined);

// Hook
export const usePopUp = () => {
  const context = useContext(PopUpContext);
  if (!context) {
    throw new Error("usePopUp must be use inside of PopUpProvider");
  }
  return context;
};

// Provider
export const PopUpProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  return (
    <PopUpContext.Provider value={{ isOpen, setOpen, content, setContent}}>
      {children}
    </PopUpContext.Provider>
  );
};
