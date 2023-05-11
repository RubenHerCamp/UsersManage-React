import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState(false);
  const [country, setCountry] = useState(false);
  const [filter, setFilter] = useState(undefined);
  const [sort, setSort] = useState(undefined);

  useEffect(() => {
    if (!users) {
      setIsLoading(true);
      fetch('https://randomuser.me/api?results=100')
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setUsers(data.results);
        init_users.current = [...data.results];
        setIsLoading(false);
      });
    }
  }, []);

  const SortByName = () => users.toSorted((first, second) => (first["name"]["first"] > second["name"]["first"]) ? 1 : -1 );
  const SortBySurname = () => users.toSorted((first, second) => (first["name"]["last"] > second["name"]["last"]) ? 1 : -1 );
  const SortByCountry = () => users.toSorted((first, second) => (first["location"]["country"] > second["location"]["country"]) ? 1 : -1 );

  const SortedUsers = useMemo (
    () => {
      if (sort) {
        setCountry(sort == "country" ? true : false );
        if (sort == "name") {
          return SortByName();
        } else if (sort == "surname") {
          return SortBySurname();
        } else {
          return SortByCountry();
        }
      } else {
        return users;
      }
    },[sort, users]
  );

  const filteredUsers = useMemo (
    () => {
      if (filter) {
        return SortedUsers.filter((user) => {
          return user.location.country.toLowerCase().includes(filter.toLowerCase());
        })
      } else {
        return SortedUsers;
      }
    },[filter, SortedUsers]
  );

  const handleFilter = (event) => {
    const text = event.target.value.toLowerCase();
    setFilter(text);
  };

  const handleSort = (text) => {
    setSort(text);
  };

  function deleteUser(id) {
    const result = users.filter(user => user.login.uuid !== id);
    setUsers(result);
  }

  function resetUsers() {
    setUsers([...init_users.current]);
  }

  function noOrderCountry() {
    setCountry(!country);
    setSort(undefined);
  }

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={() => setStyle((style) => !style)}>
          Colorear filas
        </button>
        <button onClick={() => country ? noOrderCountry() : handleSort("country")}>
          { country ? 'No ordenar por país' : 'Ordenar por país' }
        </button>
        <button onClick={resetUsers}>
          Resetear estado
        </button>
        <input onChange={handleFilter} placeholder="Filtra por país"/>
      </header>
      <main>
        { isLoading || !users ? (
          <p>Loading...</p>
        ) : (
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th className='cursor' onClick={() => handleSort("name")}>Nombre</th>
              <th className='cursor' onClick={() => handleSort("surname")}>Apellido</th>
              <th className='cursor' onClick={() => handleSort("country")}>Pais</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {
          ( filteredUsers ).map((user,i) => (
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
