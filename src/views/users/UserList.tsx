import { useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../../types/user";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    axios
      .get<User[]>(`http://localhost:8080/users`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <table className="table table-primary table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">名称</th>
            <th scope="col">邮件</th>
            <th scope="col">电话</th>
            <th scope="col">头像</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <img src={user.avatar} alt={user.name} width="50" height="50" />
              </td>
              <td>
                <button className="btn btn-primary">编辑</button>
                <button className="btn btn-danger">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default UserList;
