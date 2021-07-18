import React, { useState, useEffect } from "react";
import { readDeck } from "./utils/api/index";
import { useHistory, Link, useParams } from "react-router-dom";

function Study() {
    const { deckId } = useParams();
    const history = useHistory();
    //The path to this screen should include the deckId (i.e., /decks/:deckId/study).

    const [deck, setDeck] = useState({});
    const [cards, setCard] = useState([]);
    const [front, setFront] = useState(true);
    const [cardNumber, setCardNumber] = useState(1);

    useEffect(() => {
        async function fetchDeck() {
            const abortController = new AbortController();
            const response = await readDeck(deckId, abortController.signal);
            setDeck(response);
            setCard(response.cards);
            return () => {
                abortController.abort();
            };
        }
        fetchDeck();
    }, []);

    function nextCard(index, cardsTotal) {
        if (index < cardsTotal) {
            setCardNumber(cardNumber + 1);
            setFront(true);
        } else {
            if (
                window.confirm(
                    `Restart cards? Click 'cancel' to return to the home page.`
                )
            ) {
                setCardNumber(1);
                setFront(true);
            } else {
                history.push("/");
            }
        }
    }

    function flipCard() {
        if (front) {
            setFront(false);
        } else {
            setFront(true);
        }
    }

    function showNextBtn(cards, index) {
        if (front) {
            return null;
        } else {
            return (
                <button
                    className="btn btn-primary"
                    onClick={() => nextCard(index + 1, cards.length)}
                >
                    Next
                </button>
            );
        }
    }

    function enoughCards() {
        return (
            <div className="card">
                {cards.map((card, index) => {
                    if (index === cardNumber - 1) {
                        return (
                            <div className="card-body" key={card.id}>
                                <div className="card-title">
                                    {`Card ${index + 1} of ${cards.length}`}
                                </div>
                                <div className="card-text">
                                    {front ? card.front : card.back}
                                </div>
                                <button
                                    className="btn btn-secondary"
                                    onClick={flipCard}
                                >
                                    Flip
                                </button>
                                {showNextBtn(card, index)}
                            </div>
                        );
                    }
                })}
            </div>
        );
    }

    function notEnoughCards() {
        return (
            <div>
                <h2>Not enough cards.</h2>
                <p>
                    You need at least 3 cards to study. There are {cards.length}{" "}
                    cards in this deck.
                </p>
                <Link
                    to={`/decks/${deck.id}/cards/new`}
                    className="btn btn-primary mx-1"
                >
                    Add Cards
                </Link>
            </div>
        );
    }

    return (
        <div>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </li>
                <li className="breadcrumb-item">Study</li>
            </ol>
            <h2>{deck.name}: Study</h2>
            <div>
                {cards.length === 0
                    ? notEnoughCards()
                    : cards.length > 2
                    ? enoughCards()
                    : notEnoughCards()}
            </div>
        </div>
    );
}

export default Study;
