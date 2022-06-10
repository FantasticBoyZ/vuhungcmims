import React, { useState, useEffect } from "react";
import UserService from "../services/userService";
const BoardUser = () => {
  const [content, setContent] = useState([]);
  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        console.log(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setContent(_content);
      }
    );
  }, []);
  return (
    <div className="container">
      <header className="jumbotron">
        {content.map((person) => (
          <h3 key={person.id} >
            {person.id}.{person.name}{" "}
          </h3>
        ))}
      </header>
    </div>
  );
};
export default BoardUser;
