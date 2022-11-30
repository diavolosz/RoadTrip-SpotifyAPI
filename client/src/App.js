import logo from './logo.svg';
import './App.scss';
import './styles/color/color.scss'

import { useEffect, useState } from 'react'

import LandingAnimation from './components/LandingAnimation';
import Authorization from './components/Authorization';
import FetchCurrentSong from './components/FetchCurrentSong'
import SongbySearch from './components/SongbySearch'
import GenerateInvitation from './components/GenerateInvitation'
import JoinSession from './components/JoinSession'


let Spotify = require('spotify-web-api-js')
let SpotifyWebApi = require('./spotify-web-api.js')
let s = new Spotify();
let spotifyApi = new SpotifyWebApi();

function App() {

  let [landingDisplay, setLandingDisplay] = useState(true)

  let [tokenInfo, setTokenInfo] = useState();
  // this is only the access token 

  let [invitationToken, setInvitationToken] = useState()
  // this is only updated if invitation is recieved 

  let [functionDisplay, setFunctionDisplay] = useState('fetch-current')


  const getTokenInfo = (hash) => {
    const stringAfterHash = hash.substring(1)
    const paramsInUrl = stringAfterHash.split("&")
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      const [key, value] = currentValue.split("=")
      accumulater[key] = value
      return accumulater
    }, {})
    return paramsSplitUp
  }

  useEffect(() => {

    let invite = localStorage.invitation_token
    let current = localStorage.access_token

    if (invite) {
      spotifyApi.setAccessToken(invite)
      setTokenInfo(invite)
    } else if (window.location.hash) {
      const { access_token, expires_in, token_type } = getTokenInfo(window.location.hash)

      localStorage.setItem("access_token", access_token)
      spotifyApi.setAccessToken(access_token)
      setTokenInfo(access_token)
    } else {
      spotifyApi.setAccessToken(current)
      setTokenInfo(current)
    }
  }, [])

  setTimeout(() => {
    setLandingDisplay(false)
  }, 5000)


  const showCurrentAcessToken = () => {
    console.log(localStorage.access_token)
    navigator.clipboard.writeText(localStorage.access_token)
  }



  const [currentFunc, setCurrentFunc] = useState('default')

  return (
    <div className="App">

      {landingDisplay && <LandingAnimation />}



      <Authorization
        token={invitationToken ? invitationToken : tokenInfo}
        spotifyApi={spotifyApi}
      />

      {currentFunc === 'default' && tokenInfo &&
        <div className='options-container'>
          <section className='option-C'>
            <div onClick={() => { setCurrentFunc('fetchSong') }} className='option-card'>
              <span>Current Song</span>
            </div>


            {localStorage.session_state === "create" &&
              <div className='option-card' onClick={() => showCurrentAcessToken()}>
                <span>Generate Invite</span>
              </div>
            }
            {localStorage.session_state === "join" &&
              <div className='option-card' onClick={() => { setCurrentFunc('joinSession') }}>
                <span>Join Session</span>
              </div>
            }

            {/* <div className='option-card'>
              <span>Current Song</span>
            </div> */}

            {/* <div className='option-card'>
              <span>Current Song</span>
            </div> */}
          </section>

          <section className='option-C'>
            <div className='option-card' onClick={() => { setCurrentFunc('queueSong') }}>
              <span>Queue Song</span>
            </div>



            {/* <div className='option-card'>
              <span>Current Song</span>
            </div> */}
            {/* <div className='option-card'>
              <span>Current Song</span>
            </div> */}
          </section>


        </div>
      }

      {currentFunc === 'fetchSong' &&
        <FetchCurrentSong
          token={invitationToken ? invitationToken : tokenInfo}
          spotifyApi={spotifyApi}
          setCurrentFunc={setCurrentFunc}
        />
      }

      {currentFunc === 'joinSession' &&
        <JoinSession
          token={invitationToken ? invitationToken : tokenInfo}
          invitationToken={invitationToken}
          setInvitationToken={setInvitationToken}
          spotifyApi={spotifyApi}
        />
      }

      {currentFunc === 'queueSong' &&
        <SongbySearch spotifyApi={spotifyApi} />
      }



      {/* <SongbySearch spotifyApi={spotifyApi} /> */}

      {/* <GenerateInvitation /> */}

      {/* <JoinSession
        token={invitationToken ? invitationToken : tokenInfo}
        invitationToken={invitationToken}
        setInvitationToken={setInvitationToken}
        spotifyApi={spotifyApi}
      /> */}

    </div>
  );
}

export default App;
