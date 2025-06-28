"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const VotingUI = ({ players, onVote }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([])
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // API function to submit votes
  const submitVotesToAPI = async (voteData) => {
    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voteData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit votes")
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting votes:", error)
      throw error
    }
  }

  const handleSubmitVote = async () => {
    if (selectedPlayers.length > 0 && !hasVoted && !isSubmitting) {
      setIsSubmitting(true)

      try {
        // Prepare vote data for API
        const voteData = {
          votes: selectedPlayers.map((playerId, index) => {
            const player = players.find((p) => p.id === playerId)
            return {
              playerId: playerId,
              playerName: player.name,
              position: player.position,
              rank: index + 1, // 1st, 2nd, 3rd choice
              points: 3 - index, // 3, 2, 1 points
            }
          }),
          timestamp: new Date().toISOString(),
          totalPlayers: selectedPlayers.length,
        }

        // Submit to API
        await submitVotesToAPI(voteData)

        // Update local state for UI
        selectedPlayers.forEach((playerId, index) => {
          const points = 3 - index // 3, 2, 1 points based on position
          onVote(playerId, points)
        })

        setHasVoted(true)
        setShowSuccess(true)

        // Auto-hide success screen after 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
          setShowResults(true)
        }, 3000)
      } catch (error) {
        alert("Failed to submit vote. Please try again.")
        setIsSubmitting(false)
      }
    }
  }

  // Sort players by votes for results display
  const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes)

  // Success Screen Component
  if (showSuccess) {
    return (
      <div className="success-container">
        <motion.div
          className="success-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            ✓
          </motion.div>

          <h2 className="success-title">Vote Submitted Successfully!</h2>

          <div className="voted-players">
            <p className="voted-players-title">Your votes:</p>
            {selectedPlayers.map((playerId, index) => {
              const player = players.find((p) => p.id === playerId)
              return (
                <div key={playerId} className="voted-player-item">
                  <span className="vote-rank">{index + 1}</span>
                  <span className="vote-player-name">{player.name}</span>
                  <span className="vote-points">{3 - index} points</span>
                </div>
              )
            })}
          </div>

          <motion.div
            className="success-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Thank you for participating!
          </motion.div>
        </motion.div>
      </div>
    )
  }

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
                disabled={selectedPlayers.length === 0 || hasVoted || isSubmitting}
                className="submit-vote-button"
              >
                {isSubmitting ? "Submitting..." : hasVoted ? "Vote Submitted" : "Submit Vote"}
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
                        animate={{ width: `${(player.votes / 9) * 100}%` }}
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
                  setShowSuccess(false)
                  setIsSubmitting(false)
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
