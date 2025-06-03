import React from "react";

const IconLink = ({ href, target, rel, children, className }) => {
  return (
    <a
      href={href}
      target={target || "_blank"}
      rel={rel || "noopener noreferrer"}
      className={`inline-flex items-center ${className || ""}`}
    >
      {children}
    </a>
  )
}

const NewFooter = () => {
  return (
    <footer
      className="w-full h-[300px] text-white px-6 sm:px-12  sm:py-8 relative"
      style={{
        background: "linear-gradient(to top, #6F0001, #D73537)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="max-w-screen-xl mx-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-96">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bold font-montserrat tracking-wider">SUNKATSU</h2>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 flex flex-row gap-x-16">
            {/* General Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 tracking-wide">GENERAL</h3>
              <ul className="space-y-3 ">
                <li>
                  <a href="/home" className="hover:text-red-200 transition-colors duration-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/menu" className="hover:text-red-200 transition-colors duration-200">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="/order" className="hover:text-red-200 transition-colors duration-200">
                    Order
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-red-200 transition-colors duration-200">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="/profile" className="hover:text-red-200 transition-colors duration-200">
                    Profile
                  </a>
                </li>
              </ul>
            </div>

            {/* Policy Section */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 tracking-wide">POLICY</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/terms" className="hover:text-red-200 transition-colors duration-200">
                    Terms & Condition
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-red-200 transition-colors duration-200">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4">
          <p className="text-sm">© Sunkatsu 2025. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}

export default NewFooter
