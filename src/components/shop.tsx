"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShopItem from "@/components/shop-items";
import { FishModal } from "@/components/shop-modal";
import { buyFish } from "@/lib/fish/buy";
import type { Fish } from "@/lib/types";

export default function Shop({
  fish,
  balance,
}: {
  fish: Fish[];
  balance: number;
}) {
  const router = useRouter();
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  const [status, setStatus] = useState("");

  async function handleBuy(f: Fish) {
    const error = await buyFish(f.id);
    if (error) return error;
    setStatus(`${f.name} joined your sea!`);
    router.refresh(); // reload the balance from the server
    return null;
  }

  return (
    <>
      {status && (
        <p role="status" className="px-4 text-right text-sky-700">
          {status}
        </p>
      )}
      <ul className="list-none p-4 gap-5 grid grid-cols-3">
        {fish.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              className="w-full border border-solid border-[#ccc] focus-visible:outline-2 focus-visible:outline-sky-600"
              onClick={() => {
                setStatus("");
                setSelectedFish(f);
              }}
            >
              <ShopItem fish={f} />
            </button>
          </li>
        ))}
      </ul>
      <FishModal
        key={selectedFish?.id} // fresh error/busy state per fish
        userPoints={balance}
        fish={selectedFish}
        onClose={() => setSelectedFish(null)}
        onBuy={handleBuy}
      />
    </>
  );
}
