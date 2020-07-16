import React, { useState, useContext } from "react";
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import { useCallback } from "react";
import { useEffect } from "react";
import {Loader} from '../components/Loader'
import { LinkList } from "../components/LinkList";


export const LinksPage = () => {
  const [links, setLinks] = useState([])
  const {request, loading} = useHttp()
  const {token} = useContext(AuthContext)

  const fetchLinks = useCallback(async () => {
    try {
      const fetched = await request('/api/link', 'GET', null, {
        Authorization: `Beared ${token}`
      })
      setLinks(fetched)
    } catch (e) {

    }
  },[request, token])

  useEffect(()=>{
    fetchLinks()
  },[fetchLinks])

  if(loading) {
    return <Loader />
  }
  return (
     <>
         {!loading && <LinkList links = {links}/>}
     </>
  );
};
