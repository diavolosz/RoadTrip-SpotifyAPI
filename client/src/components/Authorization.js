import { useEffect, useState } from "react";

import GenerateInvitation from './GenerateInvitation'
import JoinSession from './JoinSession'
import FetchCurrentSong from './FetchCurrentSong'

import '../styles/Authorization.scss'

let CryptoJS = require("crypto-js")


export default function Authorization(props) {

  const { spotifyApi, token, invitationToken, setInvitationToken } = props

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

    let invite = localStorage.invitation_token
    let current = localStorage.access_token

    if (invite) {
      spotifyApi.setAccessToken(invite)
      // setTokenInfo(invite)
    } else {
      let bytes = CryptoJS.AES.decrypt(current, "******")
      let decrypted_token = bytes.toString(CryptoJS.enc.Utf8)
      // console.log(current)
      // console.log(decrypted_token)
      spotifyApi.setAccessToken(decrypted_token)
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
          <div className="">
            <span>Welcome back ! {userInfo.username}.</span>
            <span>Start inviting your friend to join !</span>

            <GenerateInvitation />

            <FetchCurrentSong
              token={invitationToken ? invitationToken : token}
              spotifyApi={spotifyApi}
            />

            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Logout</button>
            </div>
          </div>
        }

        {localStorage.session_state === "join" &&
          <div className="">
            <span>Welcome back ! {userInfo.username}.</span>
            <span>Look for an invitaion for a session !</span>

            <JoinSession
              token={invitationToken ? invitationToken : token}
              spotifyApi={spotifyApi}
              invitationToken={invitationToken}
              setInvitationToken={setInvitationToken}
            />

            <FetchCurrentSong
              token={invitationToken ? invitationToken : token}
              spotifyApi={spotifyApi}
            />

            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Logout</button>
            </div>
          </div>
        }
      </div>

    </div>
  )
}
