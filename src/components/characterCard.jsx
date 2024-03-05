// CharacterCard.jsx
import React from "react";

const CharacterCard = ({ character, stamina, attackMessage, isPlayer, calculateHealthPercentage }) => {
    return (
        <div className="character-card">
            {character && (
                <>
                    <h1>{character.name}</h1>
                    <img src={character.gif} alt={`Photo de ${character.name}`} width={200} />
                    <div className="stamina-bar-container">
                        <div className="stamina-bar" style={{ width: `${calculateHealthPercentage(stamina, character.stamina)}%` }}></div>
                    </div>
                    <h2> {stamina !== null ? `${stamina}/${character.stamina}` : `${character.stamina}/${character.stamina}`}</h2>
                    <p>Speed: {character.speed}</p>
                    <p>Defense: {character.defense}</p>
                    <p>Strength: {character.strength}</p>
                </>
            )}
        </div>
    );
}

export default CharacterCard;

