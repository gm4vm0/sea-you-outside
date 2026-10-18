import DareList from "@/components/dare-list";

export default function DaresPage() {
  return (
    <main className="max-w-3xl self-center">
      <h1 className="text-4xl px-4 pt-4 text-center font-semibold">
        Dares of the week
      </h1>
      <DareList />
    </main>
  );
}
