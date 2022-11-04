



import { useState } from 'react'

export default function JoinSession(props) {

  const {spotifyApi, token, invitationToken, setInvitationToken} = props

  const [ invitationTokenEntry, setInvitationTokenEntry ] = useState("")

  
  const handleSessionJoin = (e, newTokenInvite) => {
    e.preventDefault()
    setInvitationTokenEntry("")

    setInvitationToken(newTokenInvite)
    spotifyApi.setAccessToken(localStorage.invitation_token)
    localStorage.setItem("invitation_token", newTokenInvite)
  }

  const handleSessionLeave = () => {
    spotifyApi.setAccessToken(localStorage.access_token)
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