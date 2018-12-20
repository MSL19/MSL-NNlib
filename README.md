# NNfrontEnd
/**
 * Name: Max Lewis
 * Project Name: Max Lewis 20% Proj Sem 1
 * Purpose: 
 * This server side code runs on the KDS ATP server
 * Every 30 minutes, it pulls the the price and volume traded of Apple Stock from the Alphavantage API along with the search
 * interest for Apple from Google Trends
 * These three inputs are normalized and then fed into a 3,3,2 Neural Network, which then predicth how the price of the stock 
 * will changed by comparing the values of the final outpur nodes
 * The Stock Data, along with all the various weights and biases from the Neural Network are then added to a JSON object which
 * is braodcasted to kdsatp.org/nnpp/ for the fron end GUI to pull from
 * Date: 12/15/18
 * Collaborators: None
 */
 
 
 
 **Each File's Purpose**
 
 
 stockPredictionNode.js - node.js code to be run on a server--this actually has the Neural Network that grabs JSON data from Alphavantage and Google Trends and uses it to predict the price of Apple Stock with a prediction horizon of 30 minutes


nn.js - a JS neural network library I got from p5: https://github.com/CodingTrain/Toy-Neural-Network-JS/. However, it has been edited slightly to include functions to return the weights and biases at veraious stages of the network. 

matrix.js - a JS matrix library I also gor from p5: https://github.com/CodingTrain/Toy-Neural-Network-JS/tree/master/lib. This is completely unedited by me. 
 
 Every other file- old depreciated code...you can ignore these; honestly, I need to delete a lot of these, but I keep them around incase I might need something from them...actually I guess I could get it from an old commit....I guess if it aint broke don't fix it....

 **HOW TO RUN**
Install Node.js (latest version): https://nodejs.org/en/

Install npm for Node.js (latest version): https://www.npmjs.com/

In your commnand prompt, maneuver to the folder containing the stockPredictionNode.js file and type node stockPredictionNode.js
