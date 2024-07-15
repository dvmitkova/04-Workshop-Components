import Search from "../search/Search";
import Pagination from "../pagination/Pagination";
import UserList from "./user-list/UserList";
import { useEffect, useState } from "react";

const baseUrl = 'http://localhost:3030/jsonstore';

export default function UserSection(props) {
  const [users, setUsers] = useState([]); //началната ст-ст трябва да бъде зададена като празен масив

  useEffect(() => {
    (async function getUsers() {
      try {
              const response = await fetch(`${baseUrl}/users`);
      const result = await response.json();
      const usersData = Object.values(result)

      setUsers(usersData);
      } catch (error) {
        alert(error.message);
      }

    })(); //IIFE
  }, []);

  return (
    <section className="card users-container">
      <Search />
      
      <UserList users={users} />

      <button className="btn-add btn">Add new user</button>

      <Pagination />
    </section>
  );
}
