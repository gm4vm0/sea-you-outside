"use client";
import ShopItem from "@/components/shop-items";
import fish from "@/data/fish.json";
import type { Fish } from "@/lib/types";
import { FishModal } from "@/components/shop-modal";
import { useState } from "react";

function onBuy(user) {
  user.points--;
}

export default function ShopPage() {
  const [selectedFish, setSelectedFish] = useState<Fish | null>(null);
  return (
    <main className="max-w-3xl self-center">
      <h1 className="text-4xl p-4 text-center font-semibold">Fish shop</h1>
      <p className="text-right px-4 font-bold text-lg text-sky-900">
        Your points: 0
      </p>
      <ul className="list-none p-4 gap-5 grid grid-cols-3">
        {(fish as Fish[]).map((f) => (
          <li
            key={f.id}
            className="border-1px border-solid border-[#ccc]"
            onClick={() => setSelectedFish(f)}
          >
            <ShopItem fish={f} />
          </li>
        ))}
      </ul>
      <FishModal
        userPoints={100}
        fish={selectedFish}
        onClose={() => setSelectedFish(null)}
        onBuy={() => onBuy({ points: 100 })}
      />
    </main>
  );
}
