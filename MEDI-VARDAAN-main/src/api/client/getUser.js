import { useEffect, useState } from "react";

export const getUser=()=>{
      const [user, setUser] = useState(null);


      useEffect(() => {
        try {
          const storedUserData = localStorage.getItem("user");
          if (storedUserData) {
            const storedUser = JSON.parse(storedUserData);
            setUser(storedUser);
          }
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
          // Clear corrupted data
          localStorage.removeItem("user");
        }
      }, []);

      return user;
}