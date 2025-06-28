"use client"

import { useState } from "react"
import IntroAnimation from "./components/IntroAnimation"
import VotingUI from "./components/VotingUI"
import "./App.css"

function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const [players, setPlayers] = useState([
    { id: 1, name: "Hoàng Minh Tuấn", position: "Forward", votes: 0, image: "/images/player1.png" },
    { id: 2, name: "Thái Quốc An", position: "Forward", votes: 0, image: "/images/player2.png" },
    { id: 3, name: "Lê Hồng Quốc Quy", position: "Midfielder", votes: 0, image: "/images/player3.png" },
    { id: 4, name: "Lê Dương Minh Phúc", position: "Defender", votes: 0, image: "/images/player4.png" },
    { id: 5, name: "Đặng Gia Bảo", position: "Goalkeeper", votes: 0, image: "/images/player5.png" },
    { id: 6, name: "Nguyễn Chí Huy", position: "Goalkeeper", votes: 0, image: "/images/player6.png" },
    { id: 7, name: "Trần Đình Giàu", position: "Goalkeeper", votes: 0, image: "/images/player7.png" },
    { id: 8, name: "Duy Hoàng", position: "Goalkeeper", votes: 0, image: "/images/player8.png" },
    { id: 9, name: "Quân Trần", position: "Goalkeeper", votes: 0, image: "/images/player9.png" },
    { id: 10, name: "Tuấn Anh", position: "Goalkeeper", votes: 0, image: "/images/player10.png" }
  ])

  const handleVote = (playerId, points) => {
    setPlayers(players.map((player) => (player.id === playerId ? { ...player, votes: player.votes + points } : player)))
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
