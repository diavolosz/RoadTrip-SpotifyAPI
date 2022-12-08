import { useEffect, useState } from "react";
import { CircleWavyQuestion } from "phosphor-react";


import '../styles/Authorization.scss'

export default function Authorization(props) {

  const { token, spotifyApi } = props

  const [CLIENT_ID, setCLIENT_ID] = useState("")
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";

  // -----------------------------
  // const REDIRECT_URI_AFTER_LOGIN = process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN;
  const REDIRECT_URI_AFTER_LOGIN = 'http://localhost:3000';
  // const REDIRECT_URI_AFTER_LOGIN = "https://iridescent-mousse-e23e3b.netlify.app/";
  //use this for build deployment
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

  const [simpleSessionState, setSimpleSessionState] = useState('default')

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
    // window.location = `${process.env.REACT_APP_REDIRECT_URI_AFTER_LOGIN}`
    window.location = 'http://localhost:3000'
    // window.location = REDIRECT_URI_AFTER_LOGIN
    //use this for build deployment
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

      <div className="return-main-container">
        <button className="return-main"
          onClick={() => handleReturn()}>
          Return
        </button>
      </div>

      <div className="login-function-container">
        {simpleSessionState === 'create' &&
          <div className="create-info-container">
            <div className="image-container">
              <img src="image/cozyFP.webp" />
            </div>
            <div className="login-hook">Warning: It is illegal to not get cozy / comfy before hosting a music session !</div>
          </div>
        }

        {simpleSessionState === 'join' &&
          <div>
            Get comfy before joining a music session
          </div>
        }

        <div className="login-instruction">
          <div>Start by logging into your spotify account.</div>
          <CircleWavyQuestion className="icon"/>
        </div>

        <form className="login-form-container" onSubmit={(e) => { handleLogin(e) }}>
          <input value={CLIENT_ID} onChange={e => setCLIENT_ID(e.target.value)} />
          <button type="submit">
            <span>Log in</span>
          </button>
        </form>
      </div>


    </section>



  return (
    <div className="auth-container">
      <div id="login">
        {
          sessionState === "default" && !localStorage.session_state &&
          <div className="session-option-container">
            <div className="image-container">
              <img className='intro-img-1' src='image/dance1.png' alt='dance1' />
              <img className='intro-img-2' src='image/dance2.png' alt='dance2' />
              <img className='intro-img-3' src='image/headphone1.png' alt='headphone1' />
              <img className='intro-img-4' src='image/line-vynl.png' alt='vynl' />
            </div>
            <div className="option-intro">Vynlia</div>
            <div className="option-quote">
              Let Sharing Music Be a Form of Love
            </div>
            <div className="option-des-container">

              <div className="button-container">
                <section
                  value="create"
                  onClick={() => {
                    handleCreate()
                    setSimpleSessionState('create')
                  }}
                  className="session-create">
                  - Host -
                </section>
                <section
                  value="join"
                  onClick={() => {
                    handleJoin()
                    setSimpleSessionState('join')
                  }}
                  className="session-create">
                  - Guest -
                </section>
              </div>
              <footer>
                By logging in your agree on the <a>privacy policy</a>
              </footer>
            </div>
            {/* <div className="option-intro">Are You Creating or Joining a Session?</div> */}
          </div>
        }

        {sessionState === "active" && loginForm}

        {localStorage.session_state === "create" &&
          <div className="intro-box">
            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Quit Session</button>
            </div>
            <div className="intro-statement">
              <span>Welcome back ! {userInfo.username}.</span>
              <span>Start inviting your friend to join !</span>
            </div>

          </div>
        }

        {localStorage.session_state === "join" &&
          <div className="intro-box">
            <div className="logout-button">
              <button onClick={() => { handleLogout() }}>Logout</button>
            </div>
            <div className="intro-statement">
              <span>Welcome back ! {userInfo.username}.</span>
              <span>Look for an invitaion for a session !</span>
            </div>
          </div>
        }
      </div>


      


    </div>
  )
}
