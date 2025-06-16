import { Book } from "lucide-react";

function NavBar(){

    return(
        <>
            <nav className="flex flex-row place-content-between px-5 sm:px-20 md:px-30 lg:px-45 pt-4 pb-2 shadow-sm">
                <div className="flex flex-row space-x-2">
                    <Book color="blue"size={27}/>
                    <h3 className="font-bold text-lg">Library Manager</h3>
                </div>
                <div className="flex flex-row space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6">
                    <h3 className="font-medium text-md text-md text-gray-600">Home</h3>
                    <button className="bg-blue-500 text-md text-white font-normal px-4 rounded-md py-2 -mt-1.5">Add Book</button>
                </div>
            </nav>
        </>
    )
}

export default NavBar;