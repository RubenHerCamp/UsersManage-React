import React, { useEffect, useState, useRef } from 'react';
import './App.css'
// const obj = {obj1:4,obj2:4}
// --> const shallowCopy = {...obj}
// const shallowCopy = Object.assign({},obj)
// --> const deepCopy = structuredClone(obj)
// const arrayF = [3,4,4,4]
// --> const copyArray = [...arrayF]
// const copyArray = Object.assign([],arrayF)

function App() {
  const [users, setUsers] = useState(undefined);
  const init_users = useRef(null);
  // const copy_users = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState(false);
  // const [change, setChange] = useState(false);
  const [country, setCountry] = useState(false);
  const [filter_users, setFilterUsers] = useState(undefined);

  useEffect(() => {
    if (!users) {
      setIsLoading(true);
      fetch('https://randomuser.me/api?results=100')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setUsers(data.results);
        init_users.current = [...data.results];
        // copy_users.current = [...data.results];
        setIsLoading(false);
      });
    }
  }, []);

  function sortUsers(filter1, filter2) {
    setCountry(filter1 == "location" ? true : false);
    setUsers(users.toSorted((first, second) => (first[filter1][filter2] > second[filter1][filter2]) ? 1 : -1));
    // setChange(!change);
  }

  function deleteUser(id) {
    const result = users.filter(user => user.login.uuid !== id);
    setUsers(result);
    setFilterUsers([...result]);
    // setChange(!change);
  }

  function resetUsers() {
    setUsers([...init_users.current]);
    setFilterUsers([...init_users.current]);
    // setChange(!change);
  }

  function noOrderCountry() {
    // setUsers([...filter_users]);
    setFilterUsers(undefined);
    setCountry(!country);
    // setChange(!change);
  }

  function filterUserCountry(event) {
    const search = event.target.value.toLowerCase();
    const result = search ? setFilterUsers(users.filter(user => user.location.country.toLowerCase().includes(search))) : setFilterUsers(undefined);
    // console.log(result);
    // setChange(!change);
  }

  // const SortUsersName = element => users.sort((first, second) => (first.name.first > second.name.first) ? 1 : -1);

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={() => setStyle((style) => !style)}>
          Colorear filas
        </button>
        <button onClick={() => country ? noOrderCountry() : sortUsers("location","country")}>
          { country ? 'No ordenar por país' : 'Ordenar por país' }
        </button>
        <button onClick={resetUsers}>
          Resetear estado
        </button>
        <input onChange={filterUserCountry} placeholder="Filtra por país"/>
      </header>
      <main>
        { isLoading || !users ? (
          <p>Loading...</p>
        ) : (
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th className='cursor' onClick={() => sortUsers("name","first")}>Nombre</th>
              <th className='cursor' onClick={() => sortUsers("name","last")}>Apellido</th>
              <th className='cursor' onClick={() => sortUsers("location","country")}>Pais</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {
          (filter_users ? filter_users ?? [] : users ?? []).map((user,i) => (
            <tr key={user.login.uuid} className={ style ? (i%2 == 0 ? 'color-1' : 'color-2') : ''}>
              <td><img src={user.picture.large} alt='user-img' /></td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td><button onClick={() => deleteUser(user.login.uuid)}>Borrar</button></td>
            </tr>
          ))}
          </tbody>
        </table>
        )}
      </main>
    </div>
  )
}

export default App
