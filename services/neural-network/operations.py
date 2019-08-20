"""
    Filename: operations.py
    Author  : Christiaan Nel
    Type    : Functions

        The operations.py file contains the methods for configuring
        the neural network. It also contains API methods for
        interfacing with the NeuralNetwork class.
"""
import neural_network as nno
import spacy
import torch
from torchtext import data
from math import floor

SEED = 1234

torch.manual_seed(SEED)
torch.backends.cudnn.deterministic = True

MAX_VOCAB_SIZE = 25_000

print('-> Receiving data...')
SENTIMENT = data.Field()
TWEET = data.Field(tokenize='spacy')

fields = [
    ('s', SENTIMENT),
    (None, None),
    (None, None),
    (None, None),
    (None, None),
    ('t', TWEET)
]

train_data = data.TabularDataset(
    path='data/train.csv',
    format='csv',
    fields=fields,
    skip_header=True
)
train_count = len(train_data)
print('-> Dataset contains ' + str(train_count) + ' data points.')

print('-> Building vocab...')
SENTIMENT.build_vocab(train_data)
TWEET.build_vocab(
    train_data,
    max_size=MAX_VOCAB_SIZE,
    vectors='glove.6B.100d',
    unk_init=torch.Tensor.normal_
)

print('-> Splitting dataset...')
test_count = floor(0.1 * train_count)
valid_count = test_count
train_count = train_count - test_count
train_data, test_data = train_data.split([test_count, train_count])
train_count = train_count - valid_count
train_data, valid_data = train_data.split([valid_count, train_count])

print('-> Dataset split into training ('+str(train_count)+') '
      'and test ('+str(test_count)+') and validation ('+str(valid_count)+').')
print(vars(train_data[0]))

INPUT_DIM = len(TWEET.vocab)
EMBEDDING_DIM = 100
N_FILTERS = 100
FILTER_SIZE = [3, 4, 5]
OUTPUT_DIM = 1
DROPOUT = 0.5
PAD_IDX = TWEET.vocab.stoi[TWEET.pad_token]

cnn = nno.NeuralNetwork(
    train_data,
    valid_data,
    test_data,
    INPUT_DIM,
    EMBEDDING_DIM,
    N_FILTERS,
    FILTER_SIZE,
    OUTPUT_DIM,
    DROPOUT,
    PAD_IDX
)

pretrained_embedding = TWEET.vocab.vectors

cnn.embedding.weight.data.copy_(pretrained_embedding)
print("Pretrained embeddings applied")

nlp = spacy.load('en')


def create_indexed(sentence, min_len=5):
    """
        create_indexed(sentence, min_len = 5):
    """
    tokenized = [tok.text for tok in nlp.tokenizer(sentence)]

    if len(tokenized) < min_len:
        tokenized += ['<pad>'] * (min_len - len(tokenized))

    return [TWEET.vocab.stoi[t] for t in tokenized]


def evaluate(data):
    """
        evaluate(data):
        Evaulate a list of strings and return a sentiment for each.
    """
    print(data)
    indexed = [create_indexed(sentence) for sentence in data['data']]
    results = [
        cnn.evaluate(indexed_sentence) for indexed_sentence in indexed
    ]  # 200
    res = {}
    res['sentiments'] = results
    return res


def train(data):
    """
        train(data):
        Trains the neural network.
    """
    print(data)
    return cnn.train('')
