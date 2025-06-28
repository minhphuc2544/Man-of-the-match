"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const StatsPage = ({ onBackToVoting }) => {
  const [statsData, setStatsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/proxy/stats")

      if (!response.ok) {
        throw new Error("Failed to fetch statistics")
      }

      const data = await response.json()
      setStatsData(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-container">
          <motion.div
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="loading-text">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="error-container">
          <h2 className="error-title">Error Loading Statistics</h2>
          <p className="error-message">{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Try Again
          </button>
          <button onClick={onBackToVoting} className="back-button">
            Back to Voting
          </button>
        </div>
      </div>
    )
  }

  // Convert playerStats object to array and sort by totalPoints
  const playersArray = Object.values(statsData.playerStats || {}).sort((a, b) => b.totalPoints - a.totalPoints)

  const maxPoints = Math.max(...playersArray.map((p) => p.totalPoints), 1)

  return (
    <div className="stats-container">
      <motion.div
        className="stats-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="stats-header">
          <h1 className="stats-title">Player of the Match - Live Results</h1>
          <div className="stats-info">
            <p className="total-submissions">Total Votes: {statsData.totalSubmissions}</p>
            <p className="last-updated">Last Updated: {new Date(statsData.timestamp).toLocaleString()}</p>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h2 className="chart-title">Points Leaderboard</h2>
          </div>

          <div className="chart-content">
            {playersArray.map((player, index) => (
              <motion.div
                key={player.playerId}
                className="player-bar-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="player-info-bar">
                  <div className="player-rank-badge">#{index + 1}</div>
                  <div className="player-details">
                    <h3 className="player-name-bar">{player.playerName}</h3>
                    <p className="player-position-bar">{player.position}</p>
                  </div>
                  <div className="player-stats">
                    <span className="total-points">{player.totalPoints} pts</span>
                    <span className="total-votes">({player.totalVotes} votes)</span>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <motion.div
                    className={`progress-bar ${index === 0 ? "first-place" : index === 1 ? "second-place" : index === 2 ? "third-place" : "other-place"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(player.totalPoints / maxPoints) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>

                <div className="vote-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-label">1st:</span>
                    <span className="breakdown-value">{player.firstPlace}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">2nd:</span>
                    <span className="breakdown-value">{player.secondPlace}</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-label">3rd:</span>
                    <span className="breakdown-value">{player.thirdPlace}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="stats-actions">
          <button onClick={fetchStats} className="refresh-button">
            Refresh Results
          </button>
          <button onClick={onBackToVoting} className="back-to-voting-button">
            Vote Again
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default StatsPage
