import React from "react";
import SEO from "./SEO";

const Layout = ({ children }) => {
  return (
    <>
      <SEO />
      <div className="flex flex-col min-h-screen bg-gray-200">
        <header className="p-4 bg-teal-500 text-white font-semibold">
          <h1 className="mx-auto text-2xl text-center">
            Energi Latest Block Explorer
          </h1>
        </header>
        {children}
        <footer className="py-2 text-center text-gray-600 text-xs">
          &copy; Kent Nguyen 2021
        </footer>
      </div>
    </>
  );
};

export default Layout;
