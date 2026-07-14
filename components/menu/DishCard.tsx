"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { easings } from "@/lib/constants";
import type { MenuItemData } from "@/types";

export function DishCard({ item }: { item: MenuItemData }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: easings.bloom }}
      className="overflow-hidden rounded-xl border border-charcoal-900/10 bg-ivory-50 shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Dish Image */}
      <div className="relative h-52 w-full">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg text-charcoal-900">
            {item.name}
          </h3>

          <span className="whitespace-nowrap font-body text-sm font-medium text-gold-ink">
            {item.price}
          </span>
        </div>

        <p className="mt-3 font-body text-sm leading-relaxed text-charcoal-500">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}