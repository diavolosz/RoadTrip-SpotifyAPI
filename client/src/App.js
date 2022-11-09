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

let CryptoJS = require("crypto-js")

let Spotify = require('spotify-web-api-js')
let SpotifyWebApi = require('spotify-web-api-js')
let s = new Spotify();
let spotifyApi = new SpotifyWebApi();

function App() {

  let [landingDisplay, setLandingDisplay] = useState(true)

  let [tokenInfo, setTokenInfo] = useState();
  // this is only the access token 

  let [invitationToken, setInvitationToken] = useState()
  // this is only updated if invitation is recieved 



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

      let encrypted_token = CryptoJS.AES.encrypt(access_token, "******")
      let bytes = CryptoJS.AES.decrypt(encrypted_token, "******")
      let decrypted_token = bytes.toString(CryptoJS.enc.Utf8)

      // console.log(encrypted_token)
      // console.log(decrypted_token)

      localStorage.setItem("access_token", encrypted_token)
      spotifyApi.setAccessToken(decrypted_token)
      setTokenInfo(decrypted_token)
    } else {
      if (current) {
        let bytes = CryptoJS.AES.decrypt(current, "******")
        let decrypted_token = bytes.toString(CryptoJS.enc.Utf8)
        spotifyApi.setAccessToken(decrypted_token)
        setTokenInfo(decrypted_token)
      }

    }
  }, [])

  setTimeout(() => {
    setLandingDisplay(false)
  }, 5000)


  return (
    <div className="App">

      {landingDisplay && <LandingAnimation />}

      <Authorization
        token={invitationToken ? invitationToken : tokenInfo}
        spotifyApi={spotifyApi}
        invitationToken={invitationToken}
        setInvitationToken={setInvitationToken}
      />

      {/* <FetchCurrentSong
        token={invitationToken ? invitationToken : tokenInfo}
        spotifyApi={spotifyApi}
      />

      <SongbySearch spotifyApi={spotifyApi} />

      <GenerateInvitation />

      <JoinSession
        token={invitationToken ? invitationToken : tokenInfo}
        invitationToken={invitationToken}
        setInvitationToken={setInvitationToken}
        spotifyApi={spotifyApi}
      /> */}

    </div>
  );
}

export default App;
