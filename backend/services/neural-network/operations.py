import neural_network as nno
import json

cnn = nno.NeuralNetwork()

def evaluate(data):
    print(data)
    results = [cnn.evaluate(sentiment) for sentiment in data['data']]#, 200
    res = {}
    res['sentiments'] = results
    return res

def train(data):
    print(data)
    return cnn.train('')
