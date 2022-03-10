# Project Name = UDPort

## Hackathon's submissions requirements
- Working Website: https://stefan1612.github.io/UDPort/
- Demo video:  https://www.youtube.com/watch?v=Isl4JTKANaw
- Eth Address: 0xCF4a75825f40b46bEdca7aBFC6bfF63a50752724
- Discord Id: 353599460145627136
- Discord Name: Rank2Ape#6604


## Status
- Work in progress
### To-do's
- Host website on netlify instead of Github Pages - Github Pages has some weird interactions with Redirects.
- Rewrite frontend with MUI instead of Bootstrap
- Allow the Portfolio to track ALL ERC20's
- Use a subgraph to grab historic data instead of centralized Coin Gecko API

## Approach
Useable for every network
A portfolio app which allows the user to EITHER log in via Unstoppable DOMAIN or via metamask.
Fetches all ERC20's instantely and visualizes their Historic data.
## Stack

### Blockchain Technologies
1. Indexing/querying - [Moralis](https://moralis.io/)/[the Graph](https://thegraph.com/en/)
2. Client - [ethers.js](https://docs.ethers.io/v5/)

### Frontend
- [React](https://reactjs.org/)
- [ethers.js](https://docs.ethers.io/v5/)
- [MUI: React UI Library](https://mui.com/)

## Backend
- [Netlify](https://www.netlify.com/): Website host
- [Node.js](https://nodejs.org/en/)

## Fundamental Issues
We are indexing historic data from a centralized API, therefore disrupting the overall idea of this space (decentralization). In theory coin gecko could present us falls informationen (even tho it's unlikely that coingecko would do so). 
## Ways to solve the problems
Using an indexed subgraph (not talking about the centralized API THE GRAPH is giving us) but an actual subgraph indexed from so called Indexers, we could fetch all historic data from a decentralized API.
## Technical Issues
1. The wesbite is only able to fetch ERC20's that are listed on coingecko due to utilizing their API for the data.
## Ways to solve the problems
1. Subgraph (could create one myself or use one like Uniswap)




