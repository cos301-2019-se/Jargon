"""
    Filename: server.py
    Author  : Christiaan Nel
    Type    : Functions

        The server.py file contains the flask web framework methods.
        The service server entrypoint.

"""
import connexion


# Create the application instance
app = connexion.App(__name__, specification_dir="./")

# Read the swagger.yml file to configure the endpoints
app.add_api("swagger.yml")

# create a URL route in our application for "/"
@app.route("/")
def home():
    """
        home():     the rendered template "home.html"
        This function just responds to the browser URL
        localhost:5000/
    """
    return "Hello"


if __name__ == "__main__":
    """
        __main__():     none
        Instantiate the server.
    """
    app.run(debug=False)
