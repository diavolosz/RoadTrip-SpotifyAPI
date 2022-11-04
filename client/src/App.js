import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'

import Authorization from './components/Authorization';
import FetchCurrentSong from './components/FetchCurrentSong'
import SongbySearch from './components/SongbySearch'
import GenerateInvitation from './components/GenerateInvitation'
import JoinSession from './components/JoinSession'


let Spotify = require('spotify-web-api-js')
let SpotifyWebApi = require('spotify-web-api-js')
let s = new Spotify();
let spotifyApi = new SpotifyWebApi();

function App() {

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

      localStorage.setItem("access_token", access_token)
      spotifyApi.setAccessToken(access_token)
      setTokenInfo(access_token)
    } else {
      spotifyApi.setAccessToken(current)
      setTokenInfo(current)
    }
  })

  return (
    <div className="App">

      <Authorization
        token={invitationToken ? invitationToken : tokenInfo}
        spotifyApi={spotifyApi}
      />

      <FetchCurrentSong
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
      />

    </div>
  );
}

export default App;
