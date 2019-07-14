from datetime import datetime

import torch
from torchtext import data
from torchtext import datasets
import random

import torch.nn as nn
import torch.nn.functional as F

import os

class NeuralNetwork(nn.Module):
    def __init__(self, vocab_size, embedding_dim, n_filters, filter_sizes, 
                output_dim, dropout, pad_idx):

        super().__init__()

        self.device = torch.device('cuda' if torch.cuda.is_available() 
                else 'cpu')
        self.device = torch.device('cpu')
        print('Using device: ', self.device)

        self.embedding = nn.Embedding(vocab_size, embedding_dim, 
                    padding_idx = pad_idx)

        self.convs = nn.ModuleList([
                    nn.Conv2d(in_channels = 1,
                    out_channels = n_filters,
                    kernel_size = (fs, embedding_dim))
                    for fs in filter_sizes
                ])

        self.fc = nn.Linear(len(filter_sizes) * n_filters, output_dim)

        self.dropout = nn.Dropout(dropout)

        if self.load():
            print('Saved model state init')

    def save(self):
        torch.save(self.state_dict(), './nn-model.pt')

    def load(self):
        if os.path.isfile('./nn-model.pt'):
            self.load_state_dict(torch.load('./nn-model.pt',
                    map_location=self.device))
            self.eval()
            return True
        return False


    def forward(self, text):

        #text = [sent len, batch size]

        text = text.permute(1, 0)

        #text = [batch size, sent len]

        embedded = self.embedding(text)

        #embedded = [batch size, sent len, emb dim]

        embedded = embedded.unsqueeze(1)

        #embedded = [batch size, 1, sent len, emb dim]

        conved = [F.relu(conv(embedded)).squeeze(3) for conv in self.convs]

        #conved_n = [batch size, n_filters, sent len - filter_sizes[n] + 1]

        pooled = [F.max_pool1d(conv, conv.shape[2]).squeeze(2) for conv in conved]

        #pooled_n = [batch size, n_filters]

        cat = self.dropout(torch.cat(pooled, dim = 1))

        #cat = [batch size, n_filters * len(filter_sizes)]

        return self.fc(cat)

    def evaluate(self, indexed):#sentence, min_len = 5):
        #self.eval()
        #nlp = spacy.load('en')
        #tokenized = [tok.text for tok in nlp.tokenizer(sentence)]

        #if len(tokenized) < min_len:
        #    tokenized += ['<pad>'] * (min_len - len(tokenized))

        #indexed = [TEXT.vocab.stoi[t] for t in tokenized]
        tensor = torch.LongTensor(indexed).to(self.device)
        tensor = tensor.unsqueeze(1)
        prediction = torch.sigmoid(self(tensor))

        return prediction.item()


#class NeuralNetwork():
#    def __init__(self):
#        super(NeuralNetwork, self).__init__()

#    def evaluate(self, data):
#        return self.forward(data)

#    def train(self, data):
#        rand = self.forward(data)
#        return self.backward()

#    def forward(self, data):
#        random.seed(datetime.now())
#        return random.random()

#    def backward(self):
#        random.seed(datetime.now())
#        return random.random()
