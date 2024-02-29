import React, { useState, useEffect } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidemenu from '../components/Sidemenu';
import util from '../util';

export async function loader() {
  // check if jwt cookie exist, if not, redirect to login. if exist, use it to get currentuser to display profile user data
  /* const res = await fetch('/api/users/current', {
    headers: {
      "Content-Type": "application/json", //need this or it wont show object props in nodejs console
      "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im1lZGlhIjp7ImxlYWd1ZSI6W3sibWVkaWFfaWQiOiJMSlBoRGtXUlhNX0d5RGhCSXIzMkhUd3ZwTEN4YmdJby1sb3FwZUxvZ2FBLS1XbWtObHdsYW9rT3AwcFVDX0oyaV9ibnlVSzdUbkNfZFEiLCJkYXRlX2FkZGVkIjoxNjk2NTQ0NjU5MjA3LCJjbGlja3MiOjl9LHsibWVkaWFfaWQiOiJPWDNrUFVTWk9leUlxX3c3emZQUTdvZGxsRm5IZXU0T3h3U1NqOEZEWEFFMkRndURwYUE1Z0hLT1k1MXFSdHZsdktnaDJJaVIwT1p1M2ciLCJkYXRlX2FkZGVkIjoxNjk2NTQ0NjU5MjA3LCJjbGlja3MiOjB9XSwiaW5zdGFncmFtIjpbXSwieW91dHViZSI6W10sImxpbmtlZGluIjpbXSwidHdpdGNoIjpbXX0sIl9pZCI6IjY1MmQzZTJkZDNiNWMwNjhhOTUyZmFmZiIsInVzZXJuYW1lIjoidXNlcjQiLCJkaXNwbGF5X25hbWUiOiJ1c2VyNGRpc3BsYXkiLCJlbWFpbCI6InVzZXI0QGx1bC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRTc2pqQ0cxdHZ1bU9RZkhqVXNsbW5lTzJXUkV4TUwwVVVlbnZxQmd0YUlrSHZ6RzFEWlZGeSIsImNyZWF0ZWRBdCI6IjIwMjMtMTAtMDNUMTY6MTc6MTcuOTcwWiIsInVwZGF0ZWRBdCI6IjIwMjMtMTAtMDVUMjM6NTY6MTUuOTY2WiIsIl9fdiI6MzYsImxhc3RjaGVja2RhdGUiOjE2NjY3NDcxODV9LCJpYXQiOjE2OTkxNDMyNjQsImV4cCI6MTcwNTE0MzI2NH0.uuLGkC8IFa0JdS0DDKkYj5SDanuX6W-lo8pFIUPREFE'
    },
    method: 'GET',
    // body: JSON.stringify({ email: 'user4@lul.com', password: 'whoopsie' })
  });
  const res1 = await res.json(); */
  return ''
}

export default function Home() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  // /api/sharedPosts/sortShared?sortBy=createdAt&sortOrder=asc'
  // /api/sharedPosts/getSharedPosts?media_type=league&sortBy=likes&sortOrder=desc&startIndex=0
  // /api/sharedPosts/updateLikes?interaction=0&sharedpostid=651f729de93311122e7bcf5f&type=likes
  // /api/users/getMediaDetails?media_type=league&sortBy=clicks&sortOrder=desc
  useEffect(() => {
    /*
    const getData = async () => {
      const res = await fetch('/api/', {
        headers: {
          "Content-Type": "application/json", //need this or it wont show object props in nodejs console
          "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Im1lZGlhIjp7ImxlYWd1ZSI6W3sibWVkaWFfaWQiOiJMSlBoRGtXUlhNX0d5RGhCSXIzMkhUd3ZwTEN4YmdJby1sb3FwZUxvZ2FBLS1XbWtObHdsYW9rT3AwcFVDX0oyaV9ibnlVSzdUbkNfZFEiLCJkYXRlX2FkZGVkIjoxNjk2NTQ0NjU5MjA3LCJjbGlja3MiOjl9LHsibWVkaWFfaWQiOiJPWDNrUFVTWk9leUlxX3c3emZQUTdvZGxsRm5IZXU0T3h3U1NqOEZEWEFFMkRndURwYUE1Z0hLT1k1MXFSdHZsdktnaDJJaVIwT1p1M2ciLCJkYXRlX2FkZGVkIjoxNjk2NTQ0NjU5MjA3LCJjbGlja3MiOjB9XSwiaW5zdGFncmFtIjpbXSwieW91dHViZSI6W10sImxpbmtlZGluIjpbXSwidHdpdGNoIjpbXX0sIl9pZCI6IjY1MmQzZTJkZDNiNWMwNjhhOTUyZmFmZiIsInVzZXJuYW1lIjoidXNlcjQiLCJkaXNwbGF5X25hbWUiOiJ1c2VyNGRpc3BsYXkiLCJlbWFpbCI6InVzZXI0QGx1bC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRTc2pqQ0cxdHZ1bU9RZkhqVXNsbW5lTzJXUkV4TUwwVVVlbnZxQmd0YUlrSHZ6RzFEWlZGeSIsImNyZWF0ZWRBdCI6IjIwMjMtMTAtMDNUMTY6MTc6MTcuOTcwWiIsInVwZGF0ZWRBdCI6IjIwMjMtMTAtMDVUMjM6NTY6MTUuOTY2WiIsIl9fdiI6MzYsImxhc3RjaGVja2RhdGUiOjE2NjY3NDcxODV9LCJpYXQiOjE2OTkwMjg4NjQsImV4cCI6MTcwMjM2MTU2NH0.H1WBAi3RNo2dsmLXF0rRHXTRDU88kK2657cQVNswK9g'
        },
        method: "POST",
        body: JSON.stringify({ notes: '', anon_share: false, clickType: 'add', media_type: 'league', media_id: 'pN4E8c-5QsxbLBjlI64re0SL8LATPMmvxlM9Cb97Qb2C9HCxhHU4I4oTJDHRQ1QVA6gAYQJzPAFbzw', media_post_id: 'NA1_4813081654',display_name: 'user1display', username: 'user1', email: 'user4@lul.com', phone:'699-699-6998', password:'whoopsie'})
      });
      const moofie = await res.json();
       // first contact with server
      console.log(moofie);
    }
    getData(); */
      if (!token) {
        navigate('/login');
      }
  })

  return (
    <>
      {token && (
        <div className="home-container">
          <Sidemenu />
          <Outlet />
        </div>
      )  
      }
    </>
  )
};