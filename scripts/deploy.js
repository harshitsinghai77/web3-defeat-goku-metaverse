const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const gameContractFactory = await hre.ethers.getContractFactory("ShadowGame");
  const gameContract = await gameContractFactory.deploy(
    ["Pikachu", "Charizard", "Bulbasaur"], // Names
    [
      "https://www.warmoven.in/media/catalog/product/cache/4e14bcb566d25893ae7201d4dbdc22fd/image/14883cb6/pikachu-photo-cake-2.png", // Images
      "https://images.saymedia-content.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cq_auto:eco%2Cw_1200/MTc2MjkyNDg2MzI1NDc4NTkw/pokemon-charizard-nicknames.png",
      "https://images.saymedia-content.com/.image/t_share/MTc2Mjk3OTE1NzAxMDExNjI5/pokemon-bulbasaur-nicknames.jpg",
    ],
    [300, 200, 150], // HP values
    [150, 150, 200], // Attack damage values
    "Goku", // Boss name
    "https://m.media-amazon.com/images/I/81PRr0RBnTL._SL1500_.jpg", // Boss image
    10000, // Boss hp
    50 // Boss attack damage
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
