
import '../styles/LandingAnimation.scss'



export default function LandingAnimation() {
  return (
    <div className='landing-container'>
      <div className="upper-block"></div>
      <div className="lower-block"></div>

      <div className='intro-logo-container'>
        <div className='logo-name'>Vynlia</div>
      </div>

      <div className='intro-logo-container'>
        <div className='logo-icon'>
          {/* <span>Logo Here</span> */}
          <img className='landing-logo' src='image/VynliaLogo.png' alt='logo'/>
        </div>
      </div>
    </div>
  )
} 