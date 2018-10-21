//so far this libary only allows for a 3 layer NN

class NeuralNetwork{
constructor(input_nodes, hidden_nodes, output_nodes){
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    console.log(this.weights_ih);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
    this.learning_rate = 0.1;

}
sigmoid(x){
    return 1/(1+Math.exp(-x));
}
disgmoid(y){
    return y*(1-y); 
}
//feedforward process
//we recieve inputs
//we need to do a weighted sum
feedforward(input_arr){
    //generating the hidden layer
    let inputs = Matrix.fromArray(input_arr);
    let hidden = Matrix.multiply(this.weights_ih, inputs); //in matrix * order really matters
    hidden.add(this.bias_h);
    //use the sigmoid funcction for the acctivation function
    hidden.map(sigmoid);
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);
    return output.toArray();
}

train(input_array, target_array){
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    //use the sigmoid funcction for the acctivation function
    hidden.map(sigmoid);
    let outputs = Matrix.multiply(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);   
    //calculate the error
    //ERROr = TARGETS - OUTPUTS
    let targets = Matrix.fromArray(target_array);

    let output_errors = Matrix.subtract(targets, outputs);
    let gradients = Matrix.map(this.outputs, disgmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    let hidden_T = Matrix.transpose(hidden);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden_T);

    this.weights_ho.add(weight_ho_deltas);

    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors); //calculate the hidden layer errors
    //calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden, disgmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);

    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih.add(weight_ih_deltas);
}

}
