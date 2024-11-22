import React from "react";

const Choice = () => {
  return (
    <div className="flex justify-center rounded-lg ">
        <div className="flex justify-center bg-slate-100 px-4 py-2 rounded-lg shadow-sm p-1 space-x-28">
        {/* All Menus */}
        <div className="bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm">
            <a href="#" className="font-semibold">All Menus</a>
        </div>

        {/* Food */}
        <div className="bg-white text-red-700 px-4 py-2 rounded-lg shadow-sm">
            <a href="#" className="font-semibold">Food</a>
        </div>

        {/* Drink */}
        <div className="bg-white text-red-700 px-4 py-2 rounded-lg shadow-sm">
            <a href="#" className="font-semibold">Drink</a>
        </div>

        {/* Dessert */}
        <div className="bg-white text-red-700 px-4 py-2 rounded-lg shadow-sm">
            <a href="#" className="font-semibold">Dessert</a>
        </div>
        </div>
    </div>
  );
};

export default Choice;
