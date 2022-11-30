import { useEffect, useState } from "react";

import '../styles/Authorization.scss'

export default function Authorization(props) {

  const { token, spotifyApi } = props

  const [CLIENT_ID, setCLIENT_ID] = useState("")
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

  // -----------------------------
  const REDIRECT_URI_AFTER_LOGIN = process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN;
  //  const REDIRECT_URI_AFTER_LOGIN = "https://iridescent-mousse-e23e3b.netlify.app/"; //use this for build deployment
  // -----------------------------

  const SPACE_DELIMITER = "%20";
  const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "playlist-modify-private",
    "user-modify-playback-state"
  ];
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);


  const [logged, setLogged] = useState(false)
  const [sessionState, setSessionState] = useState("default")
  const [sessionDisplay, setSessionDisplay] = useState("default")
  const [userInfo, setUserInfo] = useState({})


  const fetchUserInfo = () => {
    spotifyApi.getMe()
      .then((res) => {
        let output = {
          username: res.display_name,
          userID: res.id,
          userUri: res.uri,
          imageUrl: res.images[0].url,
        }
        setUserInfo(output)
        console.log(output)
      })
  }




  // window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`

  let fetchLogin = async () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`
  }

  const handleLogin = (e) => {
    e.preventDefault()

    if (sessionDisplay === 'create') {
      localStorage.setItem('session_state', 'create')
    } else if (sessionDisplay === 'join') {
      localStorage.setItem('session_state', 'join')
    }

    fetchLogin()
  }


  const handleLogout = (e) => {
    localStorage.clear()

    // -----------------------------
    window.location = `${process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN}`
    //  window.location = REDIRECT_URI_AFTER_LOGIN //use this for build deployment
    //------------------------------

    setLogged(false)
  }


  const handleCreate = () => {
    setSessionState("active")
    setSessionDisplay("create")
    // localStorage.setItem("session_state", "create")

  }
  const handleJoin = () => {
    setSessionState("active")
    setSessionDisplay("join")
    // localStorage.setItem("session_state", "join")
  }


  const handleReturn = () => {
    setSessionDisplay('default')
    setSessionState('default')
  }

  // this confirms that the access token is still being applied 
  useEffect(() => {
    if (localStorage.access_token) {
      spotifyApi.setAccessToken(localStorage.access_token)
    }
  }, [token])


  useEffect(() => {
    if (localStorage.access_token) {
      fetchUserInfo()
    }
  }, [])



  const loginForm =
    <section className="session-join-container">
      <form onSubmit={(e) => { handleLogin(e) }}>
        <input value={CLIENT_ID} onChange={e => setCLIENT_ID(e.target.value)} />
        <button type="submit">Log in</button>
      </form>

      <button className="return-main"
        onClick={() => handleReturn()}>return</button>
    </section>



  return (
    <div className="auth-container">
      <div id="login">
        {
          sessionState === "default" && !localStorage.session_state &&
          <div className="session-option-container">
            <div className="option-intro">Are You Creating or Joining a Session?</div>
            <div className="button-container">
              <section
                value="create"
                onClick={() => {
                  handleCreate()
                }}
                className="session-create">
                Create
              </section>
              <section
                value="join"
                onClick={() => {
                  handleJoin()
                }}
                className="session-create">
                Join
              </section>
            </div>
          </div>
        }

        {sessionState === "active" && loginForm}

        {localStorage.session_state === "create" &&
          <div className="intro-box">
            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Quit Session</button>
            </div>
            <span>Welcome back ! {userInfo.username}.</span>
            <span>Start inviting your friend to join !</span>
          </div>
        }

        {localStorage.session_state === "join" &&
          <div className="intro-box">
            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Logout</button>
            </div>
            <span>Welcome back ! {userInfo.username}.</span>
            <span>Look for an invitaion for a session !</span>
          </div>
        }
      </div>

    </div>
  )
}
