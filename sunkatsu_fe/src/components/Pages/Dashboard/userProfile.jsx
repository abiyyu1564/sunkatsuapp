import React from "react";
import NewFooter from "../../Fragment/newFooter";
import Navbar from "../../Fragment/Navbar";

const Profile = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center min-h-screen mt16 bg-primary">
      <Navbar />
      <main className="flex w-full h-screen justify-center items-center">
        <div className="flex w-2/3 h-2/3 justify-start items-center rounded-lg shadow-lg mx-10 bg-red-400">
          <section className="flex w-1/3 h-full justify-start items-start p-10 bg-pink-200">
            <h1 className="text-4xl font-semibold">User Name</h1>
          </section>
          <section className="flex flex-col w-1/3 h-full justify-between items-center p-10 bg-pink-300">
            <h1 className="text-lg font-semibold">Your last order</h1>
            <h1 className="text-lg font-semibold">Bingung</h1>
          </section>
          <section className="flex flex-col w-1/3 h-full justify-center items-center bg-pink-400">
            <div className="flex w-full h-1/2 justify-center items-center bg-fushcia-500">
              <h1 className="text-lg font-semibold">Ini dibuat apa ya?</h1>
            </div>
            <div className="flex w-full h-1/2 justify-end items-end p-10 bg-blue-500">
              <button type="button" className="text-white bg-gradient-to-r font-medium rounded-lg px-5 py-2.5 from-secondary via-tertiary to-red-500 active:scale-95">
                Back
              </button>
            </div>

          </section>
        </div>
      </main>
      <NewFooter />
    </div>
  );
};

export default Profile;
