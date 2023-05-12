import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import debouce from "lodash.debounce";
import './App.css'
// const obj = {obj1:4,obj2:4}
// --> const shallowCopy = {...obj}
// const shallowCopy = Object.assign({},obj)
// --> const deepCopy = structuredClone(obj)
// const arrayF = [3,4,4,4]
// --> const copyArray = [...arrayF]
// const copyArray = Object.assign([],arrayF)

// params sorted and filter
// param page *
// param ascendent descendent
// 300ml abans de filtrar (debounce)

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function App() {
  const query = useQuery();
  const navigate = useNavigate();
  const [users, setUsers] = useState(undefined);
  const init_users = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState(false);
  const [country, setCountry] = useState(false);
  const filter = query.get("filter");
  const sort = query.get("sort");
  const order = query.get("order") ? query.get("order") : "upward";
  // const [filter, setFilter] = useState(undefined);
  // const [sort, setSort] = useState(value_sort);

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

  const SortByName = () => users.toSorted((first, second) => (first["name"]["first"] > second["name"]["first"]) ? (order=="upward" ? 1 : -1) : (order=="upward" ? -1 : 1) );
  const SortBySurname = () => users.toSorted((first, second) => (first["name"]["last"] > second["name"]["last"]) ? (order=="upward" ? 1 : -1) : (order=="upward" ? -1 : 1) );
  const SortByCountry = () => users.toSorted((first, second) => (first["location"]["country"] > second["location"]["country"]) ? (order=="upward" ? 1 : -1) : (order=="upward" ? -1 : 1) );

  const SortedUsers = useMemo (
    () => {
      setCountry(sort == "country" ? true : false );
      if (sort && users) {
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
    },[sort, order, users]
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
    if (sort && text) {
      navigate('/?sort='+sort+'&order='+order+'&filter='+text);
    } else if (sort) {
      navigate('/?sort='+sort+'&order='+order);
    } else {
      navigate('/?filter='+text);
    }
    // navigate(sort ? '/?sort='+sort+'&filter='+text : '/?filter='+text);
    // setFilter(text);
  };

  // const handleSort = (text) => {
  //   setSort(text);
  // };

  function deleteUser(id) {
    const result = users.filter(user => user.login.uuid !== id);
    setUsers(result);
  }

  function resetUsers() {
    setUsers([...init_users.current]);
  }

  // function noOrderCountry() {
  //   setCountry(!country);
  //   setSort(undefined);
  // }

  return (
    <div className='App'>
      <h1>Prueba técnica</h1>
      <header>
        <button onClick={() => setStyle((style) => !style)}>
          Colorear filas
        </button>
        <Link to={country ? "/" : (filter ? "/?sort=country&&filter="+filter : "/?sort=country")}>{ country ? 'No ordenar por país' : 'Ordenar por país' }</Link>
        {/* <button onClick={() => country ? noOrderCountry() : handleSort("country")}>
          { country ? 'No ordenar por país' : 'Ordenar por país' }
        </button> */}
        <button onClick={resetUsers}>
          Resetear estado
        </button>
        <input onChange={debouce(handleFilter, 300)} placeholder="Filtra por país"/>
      </header>
      <main>
        { isLoading || !users ? (
          <p>Loading...</p>
        ) : (
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th className='cursor'>
                {sort!="name" || order=="falling" ? <Link to={filter ? "/?sort=name&order=upward&filter="+filter : "/?sort=name&order=upward"}>Nombre</Link> : ""}
                {sort=="name" && order=="upward" ? <Link to={filter ? "/?sort=name&order=falling&filter="+filter : "/?sort=name&order=falling"}>Nombre</Link> : ""}
                { sort=="name" && order=="upward" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg> : ''}
                { sort=="name" && order=="falling" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg> : '' }
              </th>
              <th className='cursor'>
                {sort!="surname" || order=="falling" ? <Link to={filter ? "/?sort=surname&order=upward&filter="+filter : "/?sort=surname&order=upward"}>Apellido</Link> : ""}
                {sort=="surname" && order=="upward" ? <Link to={filter ? "/?sort=surname&order=falling&filter="+filter : "/?sort=surname&order=falling"}>Apellido</Link> : ""}
                { sort=="surname" && order=="upward" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg> : ''}
                { sort=="surname" && order=="falling" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg> : '' }
              </th>
              <th className='cursor'>
                {sort!="country" || order=="falling" ? <Link to={filter ? "/?sort=country&order=upward&filter="+filter : "/?sort=country&order=upward"}>Pais</Link> : ""}
                {sort=="country" && order=="upward" ? <Link to={filter ? "/?sort=country&order=falling&filter="+filter : "/?sort=country&order=falling"}>Pais</Link> : ""}
                { sort=="country" && order=="upward" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg> : ''}
                { sort=="country" && order=="falling" ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg> : '' }
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {
          ( filteredUsers ?? [] ).map((user,i) => (
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
