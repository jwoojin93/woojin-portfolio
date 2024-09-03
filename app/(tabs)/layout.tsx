import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-28">
      {children}
      <TabBar />
    </div>
  );
}
