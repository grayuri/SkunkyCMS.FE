import { useContext } from "react";
import { DatabaseContext } from "../context/DatabaseContext";

function useDatabaseContext() {
  const context = useContext(DatabaseContext)
  if (!context) throw new Error("You must use this TSX element inside the DatabaseContextProvider!")
  return context
}

export default useDatabaseContext;