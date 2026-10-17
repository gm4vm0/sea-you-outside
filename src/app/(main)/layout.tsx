import Nav from "@/components/nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col justify-between">
      {children}
      <Nav />
    </div>
  );
}
