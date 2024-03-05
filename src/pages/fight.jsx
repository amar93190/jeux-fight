import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Data from "../service/data.json";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import * as ACTION from "../redux/article";
import CharacterCard from "../components/characterCard";

function Fight() {
    const location = useSelector((state) => state.article.data);
    const { index } = useParams();
    const dispatch = useDispatch();
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [randomIndex, setRandomIndex] = useState(null);
    const [attackMessage, setAttackMessage] = useState("");
    const [randomCharacterStamina, setRandomCharacterStamina] = useState(null);
    const [selectedCharacterStamina, setSelectedCharacterStamina] = useState(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);
    const [winner, setWinner] = useState("");
    const [attack3Used, setAttack3Used] = useState(false);
    const [attack4Used, setAttack4Used] = useState(false);
    const [criticalHit, setCriticalHit] = useState(false); 

    useEffect(() => {
        dispatch(ACTION.FETCH_SUCCESS(Data));
        setSelectedIndex(index);
    }, [dispatch, index]);

    useEffect(() => {
        const randomIdx = Math.floor(Math.random() * 2);
        setRandomIndex(randomIdx);
    }, []);

    const selectedCharacter = location && location[selectedIndex];
    const randomCharacter = location && location[randomIndex];

    useEffect(() => {
        if (selectedCharacter && randomCharacter) {
            if (selectedCharacter.speed < randomCharacter.speed) {
                setIsPlayerTurn(false);
            }
        }
    }, [selectedCharacter, randomCharacter]);

    useEffect(() => {
        if (selectedCharacterStamina !== null && selectedCharacterStamina <= 0) {
            setWinner(randomCharacter.name);
            setIsGameOver(true);
        } else if (randomCharacterStamina !== null && randomCharacterStamina <= 0) {
            setWinner(selectedCharacter.name);
            setIsGameOver(true);
        }
    }, [selectedCharacterStamina, randomCharacterStamina, selectedCharacter, randomCharacter]);

    useEffect(() => {
        if (!isPlayerTurn && randomCharacter && !isGameOver) {
            const attackTimeout = setTimeout(() => {
                const randomTechniqueIndex = Math.floor(Math.random() * randomCharacter.techniques.length);
                const techniqueUsed = randomCharacter.techniques[randomTechniqueIndex];
                let damage = 0;
                let health = 0;
                let regenMessage = '';

                switch (randomTechniqueIndex) {
                    case 0:
                        damage = randomCharacter.strength - selectedCharacter.defense;
                        break;
                    case 1:
                        damage = randomCharacter.strength;
                        break;
                    case 2:
                        health = randomCharacter.defense * 2;
                        regenMessage = ` et récupère ${health} points de vie !`;
                        break;
                    case 3:
                        damage = (randomCharacter.strength - selectedCharacter.defense);
                        health = randomCharacter.defense;
                        regenMessage = ` et récupère ${health} points de vie !`;
                        break;
                    default:
                        break;
                }

                const isCriticalHit = Math.random() < 0.2; // 20% de chances de coup critique
                if (isCriticalHit) {
                    damage *= 2;
                    health *= 2;
                    setCriticalHit(true);
                } else {
                    setCriticalHit(false);
                }

                setAttackMessage(`${randomCharacter.name} lance ${techniqueUsed} et inflige ${damage} points de dégâts${regenMessage} ${isCriticalHit ? "(Coup critique !)" : ""}`); // Affichage du coup critique
                const newSelectedCharacterStamina = selectedCharacterStamina !== null ? selectedCharacterStamina - damage : selectedCharacter.stamina - damage;
                setSelectedCharacterStamina(Math.max(newSelectedCharacterStamina, 0));
                setIsPlayerTurn(true);

                if (newSelectedCharacterStamina <= 0) {
                    setWinner(randomCharacter.name);
                    setIsGameOver(true);
                }
            }, 500);
            return () => clearTimeout(attackTimeout);
        }
    }, [isPlayerTurn, randomCharacter, randomCharacterStamina, selectedCharacter, selectedCharacterStamina, isGameOver]);

    const handleAttack = (techniqueIndex) => {
        if (isPlayerTurn && selectedCharacter && randomCharacter) {
            const techniqueUsed = selectedCharacter.techniques[techniqueIndex];
            let damage = 0;
            let health = 0;
            let regenMessage = '';

            if (techniqueIndex === 0) {
                damage = selectedCharacter.strength - randomCharacter.defense;
                setAttack4Used(false);
                setAttack3Used(false);
            } else if (techniqueIndex === 1) {
                damage = selectedCharacter.strength;
                setAttack3Used(false);
                setAttack3Used(false);
            } else if (techniqueIndex === 2 && !attack3Used) {
                health = selectedCharacter.defense * 2;
                regenMessage = ` et récupère ${health} points de vie !`;
                setAttack3Used(true);
            } else if (techniqueIndex === 3 && !attack4Used) {
                damage = (selectedCharacter.strength - randomCharacter.defense);
                health = selectedCharacter.defense;
                regenMessage = ` et récupère ${health} points de vie !`;
                setAttack4Used(true);
            } else {
                // Si ce n'est pas une attaque valide, ne rien faire
                return;
            }

            const isCriticalHit = Math.random() < 0.2; // 20% de chances de coup critique
            if (isCriticalHit) {
                damage *= 2;
                health *= 2;
                setCriticalHit(true);
            } else {
                setCriticalHit(false);
            }

            setAttackMessage(`${selectedCharacter.name} lance ${techniqueUsed} et inflige ${damage} points de dégâts${regenMessage} ${isCriticalHit ? "(Coup critique !)" : ""}`); // Affichage du coup critique
            const newRandomCharacterStamina = randomCharacterStamina !== null ? randomCharacterStamina - damage : randomCharacter.stamina - damage;
            const newSelectedCharacterStamina = selectedCharacterStamina !== null ? selectedCharacterStamina + health : selectedCharacter.stamina + health;

            setRandomCharacterStamina(Math.max(newRandomCharacterStamina, 0));
            setSelectedCharacterStamina(Math.max(newSelectedCharacterStamina, 0));
            setIsPlayerTurn(false);

            if (newRandomCharacterStamina <= 0) {
                setWinner(selectedCharacter.name);
                setIsGameOver(true);
            }
        }
    };

    const handleRestart = () => {
        setIsGameOver(false);
        setRandomIndex(Math.floor(Math.random() * 17));
        setSelectedCharacterStamina(null);
        setRandomCharacterStamina(null);
        setAttackMessage("");
        setWinner("");
    };

    const calculateHealthPercentage = (currentHealth, maxHealth) => {
        return (currentHealth / maxHealth) * 100;
    };

    return (
        <div className="fight-container">
            {!isGameOver &&
                <div className="fight-wrapper">
                    <div className="action-buttons">
                        <button className="home-button"><Link to="/home">Repartir au choix du personnage</Link></button>
                        <button className="logout-button"><Link to="/">Déconnexion</Link></button>
                    </div>
    
                    <div className="fight-scene">
                        <CharacterCard character={selectedCharacter} stamina={selectedCharacterStamina} isPlayer={true} calculateHealthPercentage={calculateHealthPercentage} />
                        <h3 className="attack-message">{attackMessage}</h3>
                        <CharacterCard character={randomCharacter} stamina={randomCharacterStamina} attackMessage={attackMessage} isPlayer={false} calculateHealthPercentage={calculateHealthPercentage} />
                    </div>
    
                    {selectedCharacter && selectedCharacter.techniques && (
                        <div className="attack-buttons">
                            <button className="attack-button" onClick={() => handleAttack(0)} disabled={!isPlayerTurn}>{selectedCharacter.techniques[0]}</button>
                            <button className="attack-button" onClick={() => handleAttack(1)} disabled={!isPlayerTurn}>{selectedCharacter.techniques[1]}</button>
                            <button className="attack-button" onClick={() => handleAttack(2)} disabled={!isPlayerTurn || attack3Used}>{selectedCharacter.techniques[2]}</button>
                            <button className="attack-button" onClick={() => handleAttack(3)} disabled={!isPlayerTurn || attack4Used}>{selectedCharacter.techniques[3]}</button>
                        </div>
                    )}
                </div>
            }
            {isGameOver && (
                <div className="game-over">
                    <h2 className="game-over-heading">Le combat est terminé !</h2>
                    <h3 className="winner-message">{winner} a remporté la victoire !</h3>
                    <button className="restart-button" onClick={handleRestart}>Rejouer une partie</button>
                    <button className="home-button"><Link to="/home">Repartir au choix du personnage</Link></button>
                </div>
            )}
        </div>
    );
            }    

export default Fight;
