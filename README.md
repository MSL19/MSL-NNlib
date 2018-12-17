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
 ** EACH FILE'S PURPOSE**
 stockPredictionNode.js - node.js code to be run on a server--this actually has the Neural Network
 Every other file- old depreciated code...you can ignore these

 **HOW TO RUN**
 Simply open the index.html file in any browser (crome prefered)