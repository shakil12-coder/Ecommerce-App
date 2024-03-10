import { useState  , createContext , useContext } from "react";
const searchContext = createContext();



const SearchProvider = ({ children }) => {
    const [search, setSearch] = useState({
        keyword: "",
        results: []
    });

  
    return (
        <searchContext.Provider value = {[search , setSearch]}>
            {children}
        </searchContext.Provider>
    )
}

const useSearch = () => {
    return useContext(searchContext);
  };

export {useSearch , SearchProvider};