import { useEffect, useState } from "react";


export default function Authorization(props) {

  const { token, spotifyApi } = props

  const [CLIENT_ID, setCLIENT_ID] = useState("")

  // const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
  
  // const REDIRECT_URI_AFTER_LOGIN = process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN;
  const REDIRECT_URI_AFTER_LOGIN = "https://iridescent-mousse-e23e3b.netlify.app/"; //use this for build deployment
  const SPACE_DELIMITER = "%20";
  const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-modify-private",
    "user-modify-playback-state"
  ];
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

  const [logged, setLogged] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`
    console.log(e)
  }

  const handleLogout = (e) => {
    localStorage.clear()
    // window.location = `${process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN}`
    window.location = REDIRECT_URI_AFTER_LOGIN //use this for build deployment
    setLogged(false)
  }

  useEffect(() => {
    if (localStorage.access_token) {
      setLogged(true)
      spotifyApi.setAccessToken(`${token}`)
    }
  }, [])

  return (
    <div>
      <div id="login">
        {!logged
          ? <h1>First, log in to spotify</h1>
          : <h1>Welcome ! You are logged in !</h1>
        }
        <form onSubmit={(e) => {handleLogin(e)}}>
          <input value={CLIENT_ID} onChange={e => setCLIENT_ID(e.target.value)}/>
          {/* <button onClick={() => { handleLogin() }}>Log in</button> */}
          <button type="submit">Log in</button>

        </form>
      </div>
      <div>
        <button onClick={() => { handleLogout() }}>Logout</button>
      </div>
    </div>
  )
}