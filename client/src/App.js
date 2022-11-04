import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react'

import Authorization from './components/Authorization';
import FetchCurrentSong from './components/FetchCurrentSong'

let Spotify = require('spotify-web-api-js')
let SpotifyWebApi = require('spotify-web-api-js')
let s = new Spotify();
let spotifyApi = new SpotifyWebApi();

function App() {

  let [tokenInfo, setTokenInfo] = useState();


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
    if (window.location.hash) {
      const { access_token, expires_in, token_type } = getTokenInfo(window.location.hash)
      localStorage.clear()
      localStorage.setItem("access_token", access_token)
      localStorage.setItem("expires_in", expires_in)
      localStorage.setItem("token_type", token_type)
      spotifyApi.setAccessToken(`${access_token}`)
      setTokenInfo(access_token)
    }
  }, [])

  return (
    <div className="App">
      <Authorization />
      <FetchCurrentSong token={tokenInfo} spotifyApi={spotifyApi}/>
    </div>
  );
}

export default App;
