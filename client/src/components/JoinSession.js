



import { useState } from 'react'

let CryptoJS = require("crypto-js")

export default function JoinSession(props) {

  const {spotifyApi, token, invitationToken, setInvitationToken} = props

  const [ invitationTokenEntry, setInvitationTokenEntry ] = useState("")

  
  const handleSessionJoin = (e, newTokenInvite) => {
    e.preventDefault()
    setInvitationTokenEntry("")

    setInvitationToken(newTokenInvite)

    let bytes = CryptoJS.AES.decrypt(newTokenInvite, "******")
    let decrypted_token = bytes.toString(CryptoJS.enc.Utf8)

    console.log(decrypted_token)

    localStorage.setItem("invitation_token", decrypted_token)
    spotifyApi.setAccessToken(localStorage.invitation_token)
  }

  const handleSessionLeave = () => {
    let bytes = CryptoJS.AES.decrypt(localStorage.access_token, "******")
    let decrypted_token = bytes.toString(CryptoJS.enc.Utf8)

    spotifyApi.setAccessToken(decrypted_token)
    localStorage.removeItem("invitation_token")
  }

  return (
    <section>
      <h1>Enter new token here</h1>
      <form onSubmit={(e) => handleSessionJoin(e, invitationTokenEntry)}>
        <input 
        value={invitationTokenEntry} 
        onChange={(e) => setInvitationTokenEntry(e.target.value)}
        type='text' 
        placeholder="enter token here"></input>
        <button type='submit'>click to join session</button>
      </form>
        <button onClick={() => handleSessionLeave()}>Click to leave lession</button>
    </section>
  )
}