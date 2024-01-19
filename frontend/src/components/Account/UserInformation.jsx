import { useEffect, useState } from "react";
import axios from "axios";

export default function UserInformation() {
  const [stylist, setStylist] = useState(null);
  const [salon, setSalon] = useState(null);

  useEffect(() => {
    axios({
      method: "GET",
      url: `${import.meta.env.VITE_BACKEND_URL}/api/stylist/informations`,
      withCredentials: true,
    })
      .then((response) => {
        setStylist(response.data.Stylist[0]);
        setSalon(response.data.Salon[0]);
      })
      .catch((err) => {
        console.info(err);
      });
  }, []);

  return (
    <div className="information_container">
      <h1>Informations</h1>
      {salon && (
        <div>
          <h2>Salon Information</h2>
          <p>Name : {salon.salonName}</p>
          <p>City : {salon.city}</p>
          <p>Country : {salon.country}</p>
        </div>
      )}
      {stylist && (
        <div>
          <h2>Stylist Information</h2>
          <p>Last Name : {stylist.lastName}</p>
          <p>First Name : {stylist.firstName}</p>
          <p>Role : {stylist.stylistRole}</p>
          <p>Newsletter : {stylist.optinValue ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
