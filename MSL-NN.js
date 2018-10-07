//so far this libary only allows for a 3 layer NN
fucntion sigmoid(x){
    return 1/(1+Math.exp(-x));
}
class NeuralNetwork{
constructor(input_nodes, hidden_nodes, output_nodes){
    this.input_nodes = numI;
    this.hidden_nodes = numH;
    this.output_nodes = numO;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);


}
//feedforward process
//we recieve inputs
//we need to do a weighted sum
feedforward(input_arr){
    let inputs = Matrix.fromArray(input_arr);
    let hidden = Matrix.multiply(this.weights, inputs); //in matrix * order really matters
    hidden.add(this.bias_h);
    //use the sigmoid funcction for the acctivation function
    hidden.map(sigmoid);

    return guess;
}