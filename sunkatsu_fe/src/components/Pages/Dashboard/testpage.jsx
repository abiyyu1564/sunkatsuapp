import React from "react";
import Navbar from "../../Fragment/Navbar";
import NavbarStaff from "../../Fragment/NavbarStaff";
import Footer from "../../Fragment/footer";
import NewLandingFooter from "../../Fragment/newLandingFooter";


const TestPage = () => {
    return (
    <>
    <Navbar />
        <div className="container mx-auto h-auto bg-blue-400 pt-16 px-5 pb-5 flex flex-col items-center">
            <div className="bg-red-300 p-5 w-full md:w-2/3 lg:w-1/2 text-center rounded-md shadow-md">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam nisi, sint libero enim voluptate voluptas sapiente quae, reiciendis deleniti dolorum porro obcaecati ex voluptatibus cumque accusamus nostrum nobis, omnis aperiam?</p>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam nisi, sint libero enim voluptate voluptas sapiente quae, reiciendis deleniti dolorum porro obcaecati ex voluptatibus cumque accusamus nostrum nobis, omnis aperiam?</p>
        </div>
    <NewLandingFooter />
    </>
    );
};

export default TestPage;