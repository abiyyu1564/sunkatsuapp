import React from "react";
import Navbar from "../../Fragment/Navbar";
import NewFooter from "../../Fragment/newFooter";
import FilterCategory from "../../Fragment/filterCategory";
import Dropdown from "../../Fragment/dropdownButton";

const Order = () => {
    const menuItems = ["All Order", "In Progress", "Done"];
    const dropdownItems = [
        { label: "Accept Order", value: "acceptorder" },
        { label: "In Progress", value: "inprogress" },
        { label: "Done", value: "done" }
    ];

    const handleSelect = (item) => {
        console.log("clicked")
    };

    return (
        <div className="flex flex-col min-h-screen bg-primary">
            <Navbar />
            <main className="flex flex-col flex-grow justify-start items-center pt-14">
                <FilterCategory menuItems={menuItems} />

                <section className="flex flex-col sm:flex-row w-full sm:w-5/6 h-fit rounded-lg py-10 px-5 bg-white">
                    {/* Item list section */}
                    <div className="flex flex-col sm:w-1/3 w-full justify-center items-start px-5 gap-2 mb-5 sm:mb-0">
                        <article className="flex items-center gap-2">
                            <p className="text-xl sm:text-2xl font-semibold">Chicken Curry Katsu</p>
                            <span className="text-sm sm:text-xl font-normal text-red-600">(1x)</span>
                        </article>
                        <article className="flex items-center gap-2">
                            <p className="text-xl sm:text-2xl font-semibold">Lychee Tea</p>
                            <span className="text-sm sm:text-xl font-normal text-red-600">(1x)</span>
                        </article>
                        <article className="flex items-center gap-2">
                            <p className="text-xl sm:text-2xl font-semibold">Oreo Ice Cream Cake</p>
                            <span className="text-sm sm:text-xl font-normal text-red-600">(1x)</span>
                        </article>
                    </div>

                    {/* Date section */}
                    <div className="flex flex-col sm:w-1/3 w-full justify-center items-center mb-5 sm:mb-0">
                        <p className="text-xl sm:text-2xl font-semibold">15 November 2024</p>
                    </div>

                    {/* Price and Dropdown section */}
                    <div className="flex flex-col sm:w-1/3 w-full justify-center items-center gap-2">
                        <p className="text-2xl sm:text-3xl font-semibold">33.000</p>
                        <Dropdown
                            buttonLabel="Select Action"
                            items={dropdownItems}
                            onSelect={handleSelect}
                        />
                    </div>
                </section>
            </main>
            <NewFooter />
        </div>
    );
};

export default Order;
