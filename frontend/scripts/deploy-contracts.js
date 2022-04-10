const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const EventPlanner = await hre.ethers.getContractFactory("EventPlanner");
  const testToken = await TestToken.deploy();
  await testToken.deployed();
  const eventPlanner = await EventPlanner.deploy(testToken.address);
  await eventPlanner.deployed();
  console.log(`The event planner contract is deployed on address ${eventPlanner.address}`);
  const { chainId } = hre.config.networks[hre.network.name];
  const eventPlannerData = {
    address: eventPlanner.address,
    chainId,
    abi: JSON.parse(eventPlanner.interface.format('json'))
  };
  const tokenData = {
    address: testToken.address,
    chainId,
    abi: JSON.parse(testToken.interface.format('json'))
  };
  fs.writeFileSync("src/abi/EventPlanner.json", JSON.stringify(eventPlannerData));
  fs.writeFileSync("src/abi/Token.json", JSON.stringify(tokenData));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });