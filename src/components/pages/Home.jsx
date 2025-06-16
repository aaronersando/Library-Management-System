import {useState, useEffect} from "react";
import NavBar from "../common/NavBar";
import FooterComp from "../common/FooterComp";

function Home(){
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1">
                {/* <Add />
                <BookList /> */}
            </main>
            <FooterComp />
        </div>
    )
}

export default Home;