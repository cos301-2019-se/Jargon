"""
    Filename: neural-network.py
    Author  : Christiaan Nel
    Type    : Class

        The neural-network.py contains the NeuralNetwork class.

"""
import os
import time
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchtext import data
import torch.optim as optim


class NeuralNetwork(nn.Module):
    """
        A convolutional neural network (to be) trained to perform sentitment
        analysis on strings.

        Uses a pre-trained English word embedding neaural net.
    """
    def __init__(self, train_data, valid_data, test_data, vocab_size,
                 embedding_dim, n_filters, filter_sizes, output_dim,
                 dropout, pad_idx):
        """
            __init__(self, vocab_size, embedding_dim, n_filters, filter_sizes,
                output_dim, dropout, pad_idx) : none
            Contstructor.
        """

        super().__init__()

        self.device = torch.device(
                'cuda' if torch.cuda.is_available() else 'cpu')
        self.device = torch.device('cpu')
        print('Using device: ', self.device)

        self.embedding = nn.Embedding(
                vocab_size, embedding_dim, padding_idx=pad_idx)

        self.convs = nn.ModuleList([
            nn.Conv2d(
                in_channels=1,
                out_channels=n_filters,
                kernel_size=(fs, embedding_dim)
            ) for fs in filter_sizes
        ])

        self.fc = nn.Linear(len(filter_sizes) * n_filters, output_dim)

        self.dropout = nn.Dropout(dropout)

        if self.load():
            print('Saved model state init')
        else:
            BATCH_SIZE = 64
            train_iterator, valid_iterator, test_iterator = \
                data.BucketIterator.splits(
                    (train_data, valid_data, test_data),
                    sort=False,  # don't sort test/validation data
                    batch_size=BATCH_SIZE,
                    device=self.device)

            train_model(self, train_iterator, valid_iterator)

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
            self.load_state_dict(
                torch.load(
                    './nn-model.pt',
                    map_location=self.device
                )
            )
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
        pooled = [
            F.max_pool1d(conv, conv.shape[2]).squeeze(2) for conv in conved
        ]
        cat = self.dropout(torch.cat(pooled, dim=1))

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


def epoch_time(start_time, end_time):
    elapsed_time = end_time - start_time
    elapsed_mins = int(elapsed_time / 60)
    elapsed_secs = int(elapsed_time - (elapsed_mins * 60))
    return elapsed_mins, elapsed_secs


def evaluate(model, iterator, criterion):

    epoch_loss = 0
    epoch_acc = 0

    model.eval()

    with torch.no_grad():

        for batch in iterator:

            predictions = model(batch.t).squeeze(1)

            loss = criterion(predictions, torch.squeeze(batch.s))
            acc = binary_accuracy(predictions, torch.squeeze(batch.s))

            epoch_loss += loss.item()
            epoch_acc += acc.item()

    return epoch_loss / len(iterator), epoch_acc / len(iterator)


def train_model(model, train_iterator, valid_iterator):
    """TODO: Docstring for train_model.
    :returns: TODO

    """

    optimizer = optim.Adam(model.parameters())

    criterion = nn.BCEWithLogitsLoss()

    model = model.to(model.device)
    criterion = criterion.to(model.device)

    N_EPOCHS = 5

    best_valid_loss = float('inf')

    for epoch in range(N_EPOCHS):

        start_time = time.time()

        train_loss, train_acc = \
            train(model, train_iterator, optimizer, criterion)
        valid_loss, valid_acc = evaluate(model, valid_iterator, criterion)

        end_time = time.time()

        epoch_mins, epoch_secs = epoch_time(start_time, end_time)

        if valid_loss < best_valid_loss:
            best_valid_loss = valid_loss
            torch.save(model.state_dict(), 'nn-model.pt')

        print(f'Epoch: {epoch+1:02} | Epoch Time: {epoch_mins}m {epoch_secs}s')
        print(
            f'\tTrain Loss: {train_loss:.3f} | Train Acc: {train_acc*100:.2f}%'
        )
        print(
            f'\t Val. Loss: {valid_loss:.3f} |  Val. Acc: {valid_acc*100:.2f}%'
        )


def binary_accuracy(preds, y):
    """
    Returns accuracy per batch, i.e. if you get 8/10 right, this returns 0.8,
    NOT 8
    """

    # round predictions to the closest integer
    rounded_preds = torch.round(torch.sigmoid(preds))
    correct = (rounded_preds == y).float()  # convert into float for division
    acc = correct.sum() / len(correct)
    return acc


def train(model, iterator, optimizer, criterion):

    epoch_loss = 0
    epoch_acc = 0

    model.train()
    num = 0
    batch_count = len(iterator)
    prev_progress = -1

    for batch in iterator:
        optimizer.zero_grad()
        predictions = model(batch.t).squeeze(1)
        loss = criterion(predictions, torch.squeeze(batch.s))
        acc = binary_accuracy(predictions, torch.squeeze(batch.s))

        loss.backward()
        optimizer.step()

        epoch_loss += loss.item()
        epoch_acc += acc.item()

        progress = int(round((num / batch_count) * 100))
        if (progress > prev_progress):
            print('-> [' + str(
                progress) + '%] Batch: ' + str(num) + '/' + str(batch_count)
            )
        num += 1
        prev_progress = progress

    return epoch_loss / len(iterator), epoch_acc / len(iterator)
