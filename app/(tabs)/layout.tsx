import ArrowButton from "@/components/arrow-button";
import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5">
      {children}
      <ArrowButton />
      <TabBar />
    </div>
  );
}
