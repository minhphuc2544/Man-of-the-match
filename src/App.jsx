"use client"

import { useState } from "react"
import IntroAnimation from "./components/IntroAnimation"
import VotingUI from "./components/VotingUI"
import "./App.css"

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [players, setPlayers] = useState([
    { id: 9, name: "Tuan De lima", position: "Forward", votes: 0, image: "/images/player1.png" },
    { id: 4, name: "Anraujo", position: "Forward", votes: 0, image: "/images/player2.png" },
    { id: 3, name: "Piquy", position: "Midfielder", votes: 0, image: "/images/player3.png" },
    { id: 11, name: "Phuclipe Coutinho", position: "Defender", votes: 0, image: "/images/player4.png" },
    { id: 19, name: "Lamine Yabao", position: "Goalkeeper", votes: 0, image: "/images/player5.png" },
    { id: 10, name: "Son Huymin", position: "Goalkeeper", votes: 0, image: "/images/player6.png" },
    { id: 14, name: "Jiauhan Cruyff", position: "Goalkeeper", votes: 0, image: "/images/player7.png" },
    { id: 17, name: "Jorduy Alba", position: "Goalkeeper", votes: 0, image: "/images/player8.png" },
    { id: 7, name: "Quanresma", position: "Goalkeeper", votes: 0, image: "/images/player9.png" },
    { id: 100, name: "Tuấn Anh", position: "Goalkeeper", votes: 0, image: "/images/player10.png" }
  ])

  // Remove the onVote function since we're not tracking local votes anymore
  const handleVote = () => {
    // This function is no longer needed but kept for compatibility
  }

  const skipIntro = () => {
    setIntroComplete(true)
  }

  return (
    <div className="app-container">
      {!introComplete ? (
        <IntroAnimation players={players} onComplete={() => setIntroComplete(true)} onSkip={skipIntro} />
      ) : (
        <VotingUI players={players} onVote={handleVote} />
      )}
    </div>
  )
}

export default App
