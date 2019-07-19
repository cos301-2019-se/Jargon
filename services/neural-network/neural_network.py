"""
    Filename: neural-network.py
    Author  : Christiaan Nel
    Type    : Class
    
        The neural-network.py contains the NeuralNetwork class.
        
"""
import os
import random
import torch
import torch.nn as nn
import torch.nn.functional as F
from datetime import datetime
from torchtext import data
from torchtext import datasets


class NeuralNetwork(nn.Module):
    """
        A convolutional neural network (to be) trained to perform sentitment
        analysis on strings.

        Uses a pre-trained English word embedding neaural net.
    """
    def __init__(self, vocab_size, embedding_dim, n_filters, filter_sizes, 
                output_dim, dropout, pad_idx):
        """
            __init__(self, vocab_size, embedding_dim, n_filters, filter_sizes, 
                output_dim, dropout, pad_idx) : none
            Contstructor.
        """

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
        """
            save(self) : none
            Saves the currently trained model as a persisent file.
        """
        torch.save(self.state_dict(), './nn-model.pt')

    def load(self):
        """
            load(self) : boolean
            Loads the pre-trained model from a persistent file (if it exists).
            If no file containing a model is found, the return value is False.
        """
        if os.path.isfile('./nn-model.pt'):
            self.load_state_dict(torch.load('./nn-model.pt',
                    map_location=self.device))
            self.eval()
            return True
        return False


    def forward(self, text):
        """
            forward(self, text) : float
            Propagate text to produce a sentiment.
        """
        text = text.permute(1, 0)
        embedded = self.embedding(text)
        embedded = embedded.unsqueeze(1)
        conved = [F.relu(conv(embedded)).squeeze(3) for conv in self.convs]
        pooled = [F.max_pool1d(conv, conv.shape[2]).squeeze(2) for conv in conved]
        cat = self.dropout(torch.cat(pooled, dim = 1))

        return self.fc(cat)

    def evaluate(self, indexed):
        """
            evaluate(self, indexed) : 
            Description of the function.
        """
        tensor = torch.LongTensor(indexed).to(self.device)
        tensor = tensor.unsqueeze(1)
        prediction = torch.sigmoid(self(tensor))

        return prediction.item()

