"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const VotingUI = ({ players, onVote }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handlePlayerSelect = (playerId) => {
    if (hasVoted) return

    // If player is already selected, remove them
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
      return
    }

    // If already selected 3 players, don't allow more
    if (selectedPlayers.length >= 3) return

    // Add player to selected list
    setSelectedPlayers([...selectedPlayers, playerId])
  }

  const getPlayerRank = (playerId) => {
    const index = selectedPlayers.indexOf(playerId)
    return index !== -1 ? index + 1 : null
  }

  const handleSubmitVote = () => {
    if (selectedPlayers.length > 0 && !hasVoted) {
      // Update votes for each selected player
      // First place (index 0) gets 3 points, second place gets 2, third place gets 1
      selectedPlayers.forEach((playerId, index) => {
        const points = 3 - index // 3, 2, 1 points based on position
        onVote(playerId, points)
      })

      setHasVoted(true)
      setShowResults(true)
    }
  }

  // Sort players by votes for results display
  const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes)

  return (
    <div className="voting-container">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="voting-header">
          <h1 className="voting-title">Vote for the Player of the Match</h1>
          <p className="voting-subtitle">Select up to three players in order of preference</p>
        </div>

        {!showResults ? (
          <>
            <div className="player-list-container">
              {players.map((player) => {
                const rank = getPlayerRank(player.id)
                const isSelected = rank !== null

                return (
                  <motion.div
                    key={player.id}
                    className={`player-list-item ${isSelected ? "selected" : ""}`}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ backgroundColor: "#f3f4f6" }}
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <div className="player-info">
                      <h3 className="player-name">{player.name}</h3>
                      <p className="player-position">{player.position}</p>
                    </div>
                    <div className="player-id">{player.id}</div>
                    {isSelected && (
                      <div className="player-rank">
                        <span>{rank}</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            <div className="voting-footer">
              <p className="selected-status">
                {selectedPlayers.length > 0
                  ? selectedPlayers
                      .map((id) => players.find((p) => p.id === id)?.name)
                      .map((name, i) => `${i + 1}. ${name}`)
                      .join(", ")
                  : "No players selected yet"}
              </p>

              <button
                onClick={handleSubmitVote}
                disabled={selectedPlayers.length === 0 || hasVoted}
                className="submit-vote-button"
              >
                Submit Vote
              </button>
            </div>
          </>
        ) : (
          <div className="results-container">
            <h2 className="text-2xl font-bold mb-6 text-center">Results</h2>

            <div className="space-y-6">
              {sortedPlayers.map((player, index) => {
                return (
                  <div key={player.id} className="result-item">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="player-number-result">{player.id}</div>
                      <div>
                        <h3 className="font-bold">{player.name}</h3>
                        <p className="text-sm text-gray-600">{player.position}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="font-bold">{player.votes} points</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <motion.div
                        className={`h-full ${index === 0 ? "bg-blue-600" : index === 1 ? "bg-blue-500" : "bg-blue-400"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(player.votes / 9) * 100}%` }} // Assuming max points is 9 (if everyone votes the same player 1st)
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowResults(false)
                  setSelectedPlayers([])
                  setHasVoted(false)
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-800 font-medium"
              >
                Back to Voting
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default VotingUI
