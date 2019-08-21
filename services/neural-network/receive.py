import pika
import pymongo
import urllib

# myclient = pymongo.MongoClient("mongodb+srv://admin:" + urllib.parse.quote("sug@r123") + "@cluster0-jsbm1.gcp.mongodb.net/test?retryWrites=true")
# print(myclient.list_database_names())

# mydb = myclient["test"]

# proj = mydb["projects"]

# for x in proj.find({ "_id": 'ObjectId("5d309866b713aa10daabf587")'}):
#     print(x)


connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel();

channel.queue_declare(queue='tweet_queue')

def callback(ch, method, properties, body):
    print(f" {body.decode()}")

channel.basic_consume(queue='tweet_queue', auto_ack=True, on_message_callback=callback)

print('[*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming();