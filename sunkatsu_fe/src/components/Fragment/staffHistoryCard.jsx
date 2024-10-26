import React from "react";
import Profile from "../../assets/Profile.png";

export default function StaffHistoryCard() {
    return (
        <div className="flex items-center gap-5 mx-10 p-8 border-2 shadow-xl my-5 w-10/12 rounded-lg">
            
            <img src={Profile} alt="profile" className="w-[150px] h-[176px] rounded-full" />
        
            <div className="relative w-full px-5">
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <h1 className="text-[24px] font-bold text-[#FF0000]">Raygama</h1>
                        <p className="text-[16px]">Chicken Katsu Curry</p>
                        <p className="text-[16px]">Milkshake</p>
                    </div>

                    <div className="">
                        <h1 className="text-[24px] text-stone-100"> aaa</h1>
                        <p className="text-[16px]">Quantity: 1 x 23.000</p>
                        <p className="text-[16px]">Quantity: 1 x 15.000</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="items-center">
                        <p className="text-[16px] text-zinc-950 font-semibold text-center">Not Paid</p>
                        <button className="bg-red-600 text-white text-[16px] w-[174px] h-[50px] rounded-full mt-2">
                            Terima
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        
            

            <div className="w-0,5 h-36 my-2 flex flex-col justify-center items-center border-2"></div>
        
            <div className="w-1/3 p-5">
                <h2 className="text-xl font-bold text-[#FF0000]">Total Belanja:</h2>
                <h2 className="text-3xl font-bold text-black">Rp. 38.000</h2>
            </div>
        </div>
      );
}