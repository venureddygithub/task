import './App.css'

// These are the lists used in the application. You can move them to any component needed.
// App.js component
import React, {useState, useEffect} from 'react'
import GameBoard from './components/GameBoard'

import UserName from './components/UserName'

const cardList = [
  {
    cardUrl: 'https://wallpapercave.com/wp/wp2550721.jpg',
  },
  {
    cardUrl:
      'https://lh3.googleusercontent.com/K2SCNxoT2uqFVqqYOXMyE_ayYt5d_C7ZzTrT_A2XX-Xm6_JM5e9nnzzG1slUDmc',
  },
  {
    cardUrl: 'https://wallpapercave.com/wp/wp3160028.jpg',
  },
  {
    cardUrl: 'https://wallpapercave.com/wp/wp6723193.jpg',
  },
  {
    cardUrl: 'https://wallpapercave.com/wp/wp2550719.jpg',
  },
  {
    cardUrl:
      'https://2.bp.blogspot.com/-bXA8S6LswJo/UX5MC9HNDcI/AAAAAAAACrs/BAdBNPsKSBk/s1600/Love+story+Heroine+Nayanthara+Latest+photos+stills+gallery+(8).jpg',
  },
  {
    cardUrl:
      'https://moviegalleri.net/wp-content/gallery/doctor-movie-hd-images/Doctor-Movie-Heroine-Priyanka-Mohan-HD-Images.jpg',
  },
  {
    cardUrl:
      'https://www.gethucinema.com/wp-content/uploads/2018/12/Srinidhi-Shetty-KGF-Heroine-smile-cute.jpg',
  },
]

const App = () => {
  const [name, setName] = useState('')
  const [cards, setCards] = useState([])
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [choiseOne, setChoiseOne] = useState(null)
  const [choiseTwo, setChoiseTwo] = useState(null)
  const [gameOver, setGameOver] = useState(false)

  const handleUserNameSubmit = submittedName => {
    setName(submittedName)
  }

  useEffect(() => {
    if (name && !gameOver) {
      const intervalId = setInterval(() => setTime(time => time + 1), 1000)
      return () => clearInterval(intervalId)
    }
  }, [name, gameOver])

  const handleCardClick = clickedCardId => {
    const clickedCard = cards.find(card => card.id === clickedCardId)
    if (clickedCard.matched || clickedCard.flipped) {
      return
    }

    const updatedCard = cards.map(card =>
      card.id === clickedCardId ? {...card, flipped: true} : card,
    )

    setCards(updatedCard)

    if (choiseOne === null) {
      setChoiseOne(clickedCardId)
    } else {
      setChoiseTwo(clickedCardId)
    }
  }

  useEffect(() => {
    const duplicatedCards = [...cardList, ...cardList].map(card => ({
      ...card,
      id: Math.random(),
      flipped: false,
      matched: false,
    }))
    setCards(duplicatedCards.sort(() => Math.random() - 0.5))
  }, [])

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`
  }

  const resetSelect = () => {
    setChoiseOne(null)
    setChoiseTwo(null)
  }

  useEffect(() => {
    if (choiseOne && choiseTwo) {
      const cardOne = cards.find(card => card.id === choiseOne)
      const cardTwo = cards.find(card => card.id === choiseTwo)

      if (cardOne.cardUrl === cardTwo.cardUrl) {
        const updatedCards = cards.map(card =>
          card.id === choiseOne || card.id === choiseTwo
            ? {...card, matched: true}
            : card,
        )
        setCards(updatedCards)
        setScore(score => score + 1)
        if (updatedCards.every(card => card.matched)) {
          setGameOver(true)
        }
      } else {
        const updatedCards = cards.map(card =>
          card.id === choiseOne || card.id === choiseTwo
            ? {...card, flipped: true}
            : card,
        )
        setCards(updatedCards)

        setTimeout(() => {
          const updatedCards = cards.map(card =>
            card.id === choiseOne || card.id === choiseTwo
              ? {...card, flipped: false}
              : card,
          )
          setCards(updatedCards)
        }, 1000)

        setScore(score => score - 1)
      }

      resetSelect()
    }
  }, [choiseOne, choiseTwo, cards])

  // console.log(cards)
  return (
    <div className="App">
      {name ? (
        <GameBoard
          cards={cards}
          onClickCard={handleCardClick}
          score={score}
          time={formatTime(time)}
          name={name}
          gameOver={gameOver}
        />
      ) : (
        <UserName onSubmit={handleUserNameSubmit} />
      )}
    </div>
  )
}

export default App
