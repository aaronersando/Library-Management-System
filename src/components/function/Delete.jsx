import {doc, deleteDoc} from "firebase/firestore"
import { db } from "../../config/firebase"

function Delete(){

    const deleteBook = async (id)=> {
        try{
            await deleteDoc(doc(db, "books", id));
            console.log("Book deleted with Id: ", id)
        }catch(err){
            console.error(err)
        }
        
    }  



    return(
        <>
            <button onClick={() => deleteBook(book.id)}>Delete Movie</button>
        </>
    )
}

export default Delete;