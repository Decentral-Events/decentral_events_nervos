# Decentral Events
## Inspiration
Currently, if a participant reserve for an event, then the event organizers have to pay for the food, and the space and also the seats are limited. And then if the participant doesn't show up then the resources are wasted.

## What it does
We have built a platform where the participant can reserve for the event by staking some tokens and if he/she doesn't show for the event then the tokens will be transferred to the event organizers as compensation. Users can also cancel the reservation before the start time.

## How We built it
We have first built a smart contract called EventPlanner which controls all the logic for the project. Then for easy and fast data fetching we have added a node js server, and added event listener on the smart contracts to save all the data in a postgres database. After building the backend we had built the frontend using ethers.js and react. What the frontend is doing is fetching all the data from the node server to make if super fast and writing the data on the smart contract.

## Challenges We ran into
We had a lot of difficulty in deploying the backend to the Virtual Machine. So, we finally settled on using docker to deploy the backend on the Virtual Machine.

## Accomplishments that We're proud of
We have made a great user experience, from connecting to the chain to fetch the data and creating the event by the admin. We have tried our best to make the user experience very streamlined. 

## What We learned
We learned a lot about Nervos ecosystem and how to listen to solidity events from our backend to make a fast and better user experience by providing the data from our backend instead of providing it from blockchain directly. 

## What's next for Decentral Events
Currently only admin can mark attendance of the participants, but have also added a function in smart contract so that users can mark the presence of another users, and if a threshold is reached then the attendance will be marked automatically.
