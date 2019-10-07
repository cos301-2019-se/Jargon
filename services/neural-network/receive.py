import neural_network as nno
import random
import spacy
import torch
from torchtext import data
import pika
import pymongo
import urllib
from bson.objectid import ObjectId
from send import Sender


SEED = 1234

torch.manual_seed(SEED)
torch.backends.cudnn.deterministic = True

MAX_VOCAB_SIZE = 25_000
TEXT = data.Field(tokenize='spacy')
LABEL = data.LabelField(dtype=torch.float)

print('-> Receiving data...')

fields = [
    ('label', LABEL),
    (None, None),
    (None, None),
    (None, None),
    (None, None),
    ('text', TEXT)
]

train_data = data.TabularDataset(
    path='data/train.csv',
    format='csv',
    fields=fields,
    skip_header=True
)
train_count = len(train_data)
print('-> Dataset loaded successfully, contains '
      + str(train_count) + ' data points.')

print('-> Splitting dataset...')
train_data, test_data = train_data.split()
train_data, valid_data = train_data.split(random_state=random.seed(SEED))

train_count = len(train_data)
valid_count = len(valid_data)
test_count = len(test_data)

print('-> Dataset split into training ('+str(train_count)+') '
      'and test ('+str(test_count)+') and validation ('+str(valid_count)+').')
print(vars(train_data[0]))


print('-> Building vocab...')
LABEL.build_vocab(train_data)
TEXT.build_vocab(
    train_data,
    max_size=MAX_VOCAB_SIZE,
    vectors='glove.6B.100d',
    unk_init=torch.Tensor.normal_
)

INPUT_DIM = len(TEXT.vocab)
EMBEDDING_DIM = 100
N_FILTERS = 100
FILTER_SIZE = [3, 4, 5]
OUTPUT_DIM = 1
DROPOUT = 0.5
PAD_IDX = TEXT.vocab.stoi[TEXT.pad_token]

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

pretrained_embedding = TEXT.vocab.vectors

print("-> Applying pretrained embeddings...")
cnn.embedding.weight.data.copy_(pretrained_embedding)
nlp = spacy.load('en')

queue = 'tweet_queue'
print(f'-> RMQ consumer listening on {queue}.')
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host='localhost',
        socket_timeout=300000
    )
)
channel = connection.channel()

channel.queue_declare(queue=queue)
print("-> [done]")


def create_indexed(sentence, min_len=5):
    """
        create_indexed(sentence, min_len = 5):
    """
    tokenized = [tok.text for tok in nlp.tokenizer(sentence)]

    if len(tokenized) < min_len:
        tokenized += ['<pad>'] * (min_len - len(tokenized))

    return [TEXT.vocab.stoi[t] for t in tokenized]


def evaluate(sentence):
    """
        evaluate(data):
        Evaulate a list of strings and return a sentiment for each.
    """
    indexed = create_indexed(sentence)
    result = cnn.evaluate(indexed)
    return result


def callback(ch, method, properties, body):
    project_id, tweet_id = body.decode().split()
    if(tweet_id != '/t'):
        client = pymongo.MongoClient(
            "mongodb+srv://admin:" + urllib.parse.quote("sug@r123") +
            "@cluster0-jsbm1.gcp.mongodb.net/test?retryWrites=true"
        )
        print('Database connection established.')

        mydb = client["test"]
        proj = mydb["projects"]

        query = {"_id": ObjectId(project_id)}
        project = proj.find_one(query)
        tweets = project['data']

        tweet = [tweet for tweet in tweets if tweet['tweetID'] == tweet_id][0]
        t = tweet['tweetObject']['text']
        i = tweets.index(tweet)
        print(t)
        print(f'-> Sending text to NN:\n\t{t}')

        sentiment = evaluate(t)
        print(f'-> Result:\t{sentiment}')
        print(f'-> Updating database entry')
        update_result = proj.update_one(
            {'_id': ObjectId(project_id)},
            {
                "$set": {
                    "data."+str(i)+".tweetSentiment": sentiment
                }
            },
            upsert=False
        )
        print(
            f'-> Matched {update_result.matched_count} doc, '
            f'modified {update_result.modified_count} doc.'
        )
        client.close()
    s = Sender()
    s.open_conn()
    s.send_message(f'{project_id} {tweet_id}')
    s.close_conn()


channel.basic_consume(queue=queue, auto_ack=True, on_message_callback=callback)

print('[*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
