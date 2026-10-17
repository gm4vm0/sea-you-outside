import Nav from "@/components/nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="min-h-full flex flex-col justify-between">
      {children}
      <Nav />
    </body>
  );
}
