import random
from datetime import datetime

class NeuralNetwork():
    def __init__(self):
        super(NeuralNetwork, self).__init__()

    def evaluate(self, data):
        return self.forward(data)

    def train(self, data):
        rand = self.forward(data)
        return self.backward()

    def forward(self, data):
        random.seed(datetime.now())
        return random.random()

    def backward(self):
        random.seed(datetime.now())
        return random.random()
