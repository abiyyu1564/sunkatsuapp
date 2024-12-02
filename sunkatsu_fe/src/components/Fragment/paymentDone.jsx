import React from "react";
import Navbar from "./Navbar";

const PaymentDone = () => {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="w-5/6 h-12 mb-5 px-5 rounded-t-xl flex items-center mx-auto bg-[#B70000] z-20 relative">
          <p className="font-sans text-lg text-white">Your Cart</p>
        </div>

        {/* Main Content */}
        <div
          className="w-5/6 mx-auto bg-white p-10 rounded-lg shadow-md flex justify-center items-center text-center"
          style={{ height: "530px" }} // Tinggi tetap 530px
        >
          <p className="text-4xl font-medium">
            Terima Kasih Telah Melakukan Pembayaran!
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center w-5/6 mx-auto bg-[#B70000] mt-5 p-5 rounded-b-xl">
          <div>
            <p className="font-sans text-white text-lg">Total Items: 3 Items</p>
            <h2 className="font-sans text-white text-2xl">Total Price: 33.000</h2>
          </div>
          <button className="text-white bg-secondary rounded-md h-10 w-32">
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentDone;
