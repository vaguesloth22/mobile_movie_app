import { Client, Databases, ID, Query } from "react-native-appwrite";
// track the searches made by user: 
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!; 
if (!DATABASE_ID) console.log("database id not found")
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
if (!COLLECTION_ID) console.log("collection id not found"); 
// const client = new Client()
//   .setEndpoint('https://cloud.appwrite.io/v1')
//   .setProject(process.env.EXPO_PUBLIC_PROJECT_ID!)

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client); 



export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query)
    ])
    console.log(result); 

    // check if a record of that search has already been stored
    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID, 
        COLLECTION_ID, 
        existingMovie.$id, 
        {
          count: existingMovie.count + 1
        }
      )
    }
    else {
      await database.createDocument(
        DATABASE_ID, 
        COLLECTION_ID, 
        ID.unique(),
        {
          searchTerm: query, 
          movie_id: movie.id, 
          title: movie.title,
          count: 1, 
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }
      )
    }
  } catch (error) {
    console.log(error); 
    throw error; 
  }
  // if a doc is found, increment the searchCount field
  // if no doc is found ,
    // create a new doc in appwrite database -> 1
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    //
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5), 
      Query.orderDesc('count'),
    ])
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error); 
    throw undefined; 
  }
}