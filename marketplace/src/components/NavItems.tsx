"use client";
import { PRODUCT_CATEGORIES } from "@/config/Index";
import React, { useState } from "react";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const isAnyOpen = activeIndex !== null;

  return (
    <div className="flex gab-4 h-full">
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };
        const isOpen = index === activeIndex;
        return (
          <NavItems
            category={category}
            handleOpen={handleOpen}
            key={category.value}
            isAnyOpen={isAnyOpen}
            isOpen={isOpen}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
