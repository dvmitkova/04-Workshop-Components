import Search from "../search/Search";
import Pagination from "../pagination/Pagination";
import UserList from "./user-list/UserList";
import { useEffect, useState } from "react";
import UserAdd from "./user-add/UserAdd";
import UserDetails from "./user-details/UserDetails";
import UsesrDelete from "./user-delete/UserDelete";
import UserDelete from "./user-delete/UserDelete";

const baseUrl = "http://localhost:3030/jsonstore";

export default function UserSection() {
  const [users, setUsers] = useState([]); //началната ст-ст трябва да бъде зададена като празен масив
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetailsById, setShowUserDetailsById] = useState(null);
  const [showUserDeleteById, setShowUserDeleteById] = useState(null);

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
    const userData = {
      ...Object.fromEntries(formData),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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

  const userDetailsClickHandler = (userId) => {
    setShowUserDetailsById(userId);
  };

  const userDeleteClickHandler = (userId) => {
    setShowUserDeleteById(userId);
  }

  const userDeleteHandler = async (userId) => {
        //1. Send the delete request to the server
    await fetch(`${baseUrl}/users/${userId}`, {
      method: 'DELETE',
    });

    //2. Delete from local state
    setUsers(oldUsers => oldUsers.filter(user => user._id !== userId))
    //филтрирам всички юзъри, които са с различно id и ги запазвам в новия state без user-а, който сме изтрили
    
    //3. Close modal
    setShowUserDeleteById(null);
  }

  return (
    <section className="card users-container">
      <Search />

      <UserList
        users={users}
        onUserDetailsClick={userDetailsClickHandler}
        onUserDeleteClick={userDeleteClickHandler}
      />

      {showAddUser && (
        <UserAdd onClose={addUseCloseHandler} onSave={addUserSaveHandler} />
      )}

      {showUserDetailsById && (
        <UserDetails
          user={users.find(user => user._id === showUserDetailsById)}
          onClose={() => setShowUserDetailsById(null)}
        />
      )}

      {showUserDeleteById && (
        <UserDelete
          onClose={() => setShowUserDeleteById(null)}
          onUserDelete={() => userDeleteHandler(showUserDeleteById)}
        />
      )}

      <button className="btn-add btn" onClick={addUserClickHandler}>
        Add new user
      </button>

      <Pagination />
    </section>
  );
}
