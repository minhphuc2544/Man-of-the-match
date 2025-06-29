"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const IntroAnimation = ({ players, onComplete, onSkip }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState("initial") // initial, players, final

  useEffect(() => {
    // Initial delay before starting player animations
    const initialTimer = setTimeout(() => {
      setAnimationPhase("players")
    }, 2000)

    return () => clearTimeout(initialTimer)
  }, [])

  useEffect(() => {
    if (animationPhase === "players") {
      // Cycle through players
      const interval = setInterval(() => {
        if (currentPlayerIndex < players.length - 1) {
          setCurrentPlayerIndex((prev) => prev + 1)
        } else {
          clearInterval(interval)
          setAnimationPhase("final")

          // Final animation before showing voting UI
          setTimeout(() => {
            onComplete()
          }, 2000)
        }
      }, 2000) // Time each player is shown

      return () => clearInterval(interval)
    }
  }, [currentPlayerIndex, players.length, animationPhase, onComplete])

  // Define different entrance animations for each player
  const entranceAnimations = [
    // Player 1: Slide in from left
    {
      initial: { x: "-100%", opacity: 0, rotate: -5 },
      animate: { x: 0, opacity: 1, rotate: 0 },
      exit: { x: "100%", opacity: 0, rotate: 5 },
      transition: { duration: 0.8, ease: "easeOut" },
    },
    // Player 2: Slide in from right
    {
      initial: { x: "100%", opacity: 0, rotate: 5 },
      animate: { x: 0, opacity: 1, rotate: 0 },
      exit: { x: "-100%", opacity: 0, rotate: -5 },
      transition: { duration: 0.8, ease: "easeOut" },
    },
    // Player 3: Fade in from top with scale
    {
      initial: { y: "-50%", opacity: 0, scale: 0.8 },
      animate: { y: 0, opacity: 1, scale: 1 },
      exit: { y: "50%", opacity: 0, scale: 0.8 },
      transition: { duration: 0.8, ease: "easeOut" },
    },
    // Player 4: Zoom in from center
    {
      initial: { scale: 0.2, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.2, opacity: 0 },
      transition: { duration: 0.8, ease: "backOut" },
    },
    // Player 5: Slide in from bottom
    {
      initial: { y: "50%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "-50%", opacity: 0 },
      transition: { duration: 0.8, ease: "easeOut" },
    },
  ]

  // Define different light sweep animations
  const lightSweepAnimations = [
    // Horizontal sweep left to right
    {
      className: "light-sweep-horizontal",
      initial: { x: "-100%", opacity: 0 },
      animate: { x: "100%", opacity: [0, 1, 0] },
      transition: { duration: 1.2, delay: 0.3 },
    },
    // Vertical sweep top to bottom
    {
      className: "light-sweep-vertical",
      initial: { y: "-100%", opacity: 0 },
      animate: { y: "100%", opacity: [0, 1, 0] },
      transition: { duration: 1.2, delay: 0.3 },
    },
    // Diagonal sweep top-left to bottom-right
    {
      className: "light-sweep-diagonal-1",
      initial: { x: "-100%", y: "-100%", opacity: 0 },
      animate: { x: "100%", y: "100%", opacity: [0, 1, 0] },
      transition: { duration: 1.2, delay: 0.3 },
    },
    // Diagonal sweep top-right to bottom-left
    {
      className: "light-sweep-diagonal-2",
      initial: { x: "100%", y: "-100%", opacity: 0 },
      animate: { x: "-100%", y: "100%", opacity: [0, 1, 0] },
      transition: { duration: 1.2, delay: 0.3 },
    },
    // Radial sweep from center
    {
      className: "light-sweep-radial",
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 2, opacity: [0, 1, 0] },
      transition: { duration: 1.2, delay: 0.3 },
    },
  ]

  // Get animation for current player
  const getPlayerAnimation = (index) => {
    return entranceAnimations[index % entranceAnimations.length]
  }

  const getLightSweepAnimation = (index) => {
    return lightSweepAnimations[index % lightSweepAnimations.length]
  }

  return (
    <div className="intro-container">
      <button onClick={onSkip} className="skip-button">
        Skip Intro
      </button>

      <div className="intro-content-wrapper">
        <AnimatePresence mode="wait">
          {animationPhase === "initial" && (
            <motion.div
              className="intro-text-centered"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 1 }}
              key="intro-title"
            >
              <h1 className="intro-main-title">MATCH OF THE DAY</h1>
              <h2 className="intro-sub-title">PLAYER OF THE MATCH</h2>
            </motion.div>
          )}

          {animationPhase === "players" && (
            <div className="player-animation-container" key="player-animation">
              <motion.div
                key={`player-${currentPlayerIndex}`}
                className="player-spotlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="player-image-container relative"
                  initial={getPlayerAnimation(currentPlayerIndex).initial}
                  animate={getPlayerAnimation(currentPlayerIndex).animate}
                  exit={getPlayerAnimation(currentPlayerIndex).exit}
                  transition={getPlayerAnimation(currentPlayerIndex).transition}
                >
                  <img
                    src={players[currentPlayerIndex].image || "/placeholder.svg"}
                    alt={players[currentPlayerIndex].name}
                    className="player-image"
                  />

                  {/* Dynamic light sweep effect */}
                  <motion.div
                    className={`absolute inset-0 ${getLightSweepAnimation(currentPlayerIndex).className}`}
                    initial={getLightSweepAnimation(currentPlayerIndex).initial}
                    animate={getLightSweepAnimation(currentPlayerIndex).animate}
                    transition={getLightSweepAnimation(currentPlayerIndex).transition}
                  />
                </motion.div>

                <motion.div
                  className="player-info-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="player-name-text">{players[currentPlayerIndex].name}</h2>
                  <p className="player-position-text">{players[currentPlayerIndex].position}</p>
                </motion.div>
              </motion.div>
            </div>
          )}

          {animationPhase === "final" && (
            <motion.div
              className="intro-text-centered"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              key="final-intro"
            >
              <h1 className="intro-main-title">VOTE NOW</h1>
              <motion.div
                className="pulse-animation"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <span className="arrow-text">⟶</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default IntroAnimation
