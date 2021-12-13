import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import ABI from "../../artifacts/abi.json";
import LoadingIndicator from "../LoadingIndicator";
import "./SelectCharacter.css";

const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState();
  const [mintingCharacter, setMintingCharacter] = useState(false);
  const [mintLink, setMintLink] = useState();

  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        setMintingCharacter(true);
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
        setMintingCharacter(false);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
      setMintingCharacter(false);
    }
  };

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        const nft_url = `https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId}?tab=details`;
        setMintLink(nft_url);
      }
    };

    if (gameContract) {
      getCharacters();

      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      <div className="character-grid">
        {characters.map((character, index) => (
          <div className="character-item" key={character.name}>
            <div className="name-container">
              <p>{character.name}</p>
            </div>
            <img src={character.imageURI} alt={character.name} />
            <button
              type="button"
              className="character-mint-button"
              onClick={mintCharacterNFTAction(index)}
            >{`Mint ${character.name}`}</button>
          </div>
        ))}

        {mintingCharacter && (
          <div className="loading">
            <div className="indicator">
              <LoadingIndicator />
              <p>Minting In Progress...</p>
            </div>
            <img
              src="https://media2.giphy.com/media/61tYloUgq1eOk/giphy.gif?cid=ecf05e47dg95zbpabxhmhaksvoy8h526f96k4em0ndvx078s&rid=giphy.gif&ct=g"
              alt="Minting loading indicator"
            />
          </div>
        )}
      </div>
      {mintLink && <h3>Here's you minted NFT: {mintLink}</h3>}
    </div>
  );
};

export default SelectCharacter;
