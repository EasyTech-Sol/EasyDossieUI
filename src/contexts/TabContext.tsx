import { createContext, useContext, useState, ReactNode } from "react";

type TabType = "turmas" | "dossies";
type SubTabType = "dossiers" | "students";

interface TabsContextProps {
  selectedTab: TabType;
  selectedSubTab: SubTabType;
  setSelectedSubTab: (value: SubTabType) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [selectedTab] = useState<TabType>("turmas"); // Fixo
  const [selectedSubTab, setSelectedSubTab] = useState<SubTabType>("students");

  return (
    <TabsContext.Provider value={{ selectedTab, selectedSubTab, setSelectedSubTab }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within a TabsProvider");
  }
  return context;
}
