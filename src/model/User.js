import { Firebase } from './../Utils/Firebase.js';
import { collection, doc, where, query, getDoc, QuerySnapshot, addDoc } from "firebase/firestore";
import { ClassEvent } from './../Utils/ClassEvent.js';
import { Model } from './Model.js'


export class User extends Model{

    constructor(id){
        super(); // Chama o construtor da classe model
    }

    get name(){ return Model._data.name;}
    set name(value){ Model._data.name = value}

    get email(){ return Model._data.email;}
    set email(value){ Model._data.email = value}

    get photo(){ return Model._data.photo;}
    set photo(value){ Model._data.photo = value}

    static async getById(id) {
        try {
            const docSnapshot = await getDoc(doc(User.getRef(), id));      



            if (docSnapshot.empty) {
                console.log("docSnapShot null")
                return null; // Retorna null se o documento não for encontrado
            } else {
                let modelInstance = new Model();
                modelInstance.fromJSON(docSnapshot.data());
             //   this.fromJSON(docSnapshot.data());
            }
        
            const user = docSnapshot.data();
            console.log(user);
            return user;
        } catch (error) {
            console.log("erro getbyid");
            console.error(error);
            throw error;
        }
    }
      

    static getRef(){
        const usersCollectionRef = collection(Firebase.db(), '/users');
        return usersCollectionRef;
    }

    save() {

        const user = User.getById(this.email);
        console.log(user, "userRef");
        return user;
    }
    

   /* static async findByEmail(email){

        const result = doc(Firebase.db(), User.getRef(), email)

        return result;
    }*/

}
