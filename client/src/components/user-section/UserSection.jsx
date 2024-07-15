import Search from "../search/Search";
import Pagination from "../pagination/Pagination";
import UserList from "./user-list/UserList";
import { useEffect, useState } from "react";
import UserAdd from "./user-add/UserAdd";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserSection(props) {
  const [users, setUsers] = useState([]); //началната ст-ст трябва да бъде зададена като празен масив
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    (async function getUsers() {
      try {
        const response = await fetch(`${baseUrl}/users`);
        const result = await response.json();
        const usersData = Object.values(result);

        setUsers(usersData);
      } catch (error) {
        alert(error.message);
      }
    })(); //IIFE
  }, []);

  const addUserClickHandler = () => {
    setShowAddUser(true);
  };

  const addUseCloseHandler = () => {
    setShowAddUser(false);
  };

  const addUserSaveHandler = async (e) => {
    //1. Prevent refresh
    e.preventDefault();

    //2. Get user data
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData);

    //3. Make POST request
    const response = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const createdUser = await response.json();

    //4. Update local state
    setUsers((oldUsers) => [...oldUsers, createdUser]); //създавам нов масив, взимам си старите юзъри и добавям новия;

    //5. Close modal
    setShowAddUser(false); //скриваме модала
  };

  return (
    <section className="card users-container">
      <Search />

      <UserList users={users} />

      {showAddUser && (
        <UserAdd onClose={addUseCloseHandler} onSave={addUserSaveHandler} />
      )}

      <button className="btn-add btn" onClick={addUserClickHandler}>
        Add new user
      </button>

      <Pagination />
    </section>
  );
}
