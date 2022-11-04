import { useEffect, useState } from "react";


export default function Authorization() {

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
  const REDIRECT_URI_AFTER_LOGIN = process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN;
  const SPACE_DELIMITER = "%20";
  const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

  const [logged, setLogged] = useState(false)

  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location = `${process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN}`
    setLogged(false)
  }

  useEffect(() => {
    if (localStorage.access_token) {
      setLogged(true)
    }
  }, [])

  return (
    <div>
      <div id="login">
        {!logged
          ? <h1>First, log in to spotify</h1>
          : <h1>You are logged in !</h1>
        }
        <button onClick={() => { handleLogin() }}>Log in</button>
      </div>
      <div>
        <button onClick={() => { handleLogout() }}>Logout</button>
      </div>
    </div>
  )
}