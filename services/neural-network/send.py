import pika


class Sender():

    """Wrapper class for AMQP message sending."""

    def __init__(self):
        """TODO: to be defined. """

    def open_conn(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost')
        )
        self.channel = self.connection.channel()
        self.queue = 'controller_queue'
        self.channel.queue_declare(queue=self.queue)

    def send_message(self, body):
        self.channel.basic_publish(
            exchange='', routing_key=self.queue, body=body
        )
        print(f'[AMQP] Sent \'{body}\' to {self.queue}')

    def close_conn(self):
        self.connection.close()
