import React, { useEffect } from "react";
import axios from "axios";

export const TestIntegration = () => {
  useEffect(() => {
    const fetchData = () => {
      axios
        .get("http://localhost:8080/api/customers")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchData();
  }, []);

  return (
    <button onClick={() => console.log("Button clicked")} className="mr-3">
      test
    </button>
  );
};
