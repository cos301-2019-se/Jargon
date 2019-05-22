import neural_network as nno
import json

import torch
import random

from torchtext import data
from torchtext import datasets

import spacy

SEED = 1234

torch.manual_seed(SEED)
torch.backends.cudnn.deterministic = True

MAX_VOCAB_SIZE = 25_000
TEXT = data.Field(tokenize = 'spacy')
LABEL = data.LabelField(dtype = torch.float)

print('Receiving data...')
train_data, test_data = datasets.IMDB.splits(TEXT, LABEL)
train_data, valid_data = train_data.split(random_state = random.seed(SEED))

print('Building vocab...')
TEXT.build_vocab(train_data,
        max_size = MAX_VOCAB_SIZE,
        vectors = 'glove.6B.100d',
        unk_init = torch.Tensor.normal_)

INPUT_DIM = len(TEXT.vocab)
EMBEDDING_DIM = 100
N_FILTERS = 100
FILTER_SIZE = [3, 4, 5]
OUTPUT_DIM = 1
DROPOUT = 0.5
PAD_IDX = TEXT.vocab.stoi[TEXT.pad_token]

cnn = nno.NeuralNetwork(INPUT_DIM, EMBEDDING_DIM, N_FILTERS, 
        FILTER_SIZE, OUTPUT_DIM, DROPOUT, PAD_IDX)

pretrained_embedding = TEXT.vocab.vectors

cnn.embedding.weight.data.copy_(pretrained_embedding)
print("Pretrained embeddings applied")

nlp = spacy.load('en')

def create_indexed(sentence, min_len = 5):
    tokenized = [tok.text for tok in nlp.tokenizer(sentence)]

    if len(tokenized) < min_len:
        tokenized += ['<pad>'] * (min_len - len(tokenized))

    return [TEXT.vocab.stoi[t] for t in tokenized]


def evaluate(data):
    print(data)
    indexed = [create_indexed(sentence) for sentence in data['data']]
    results = [cnn.evaluate(indexed_sentence) for indexed_sentence
            in indexed]#, 200
    res = {}
    res['sentiments'] = results
    return res

def train(data):
    print(data)
    return cnn.train('')
