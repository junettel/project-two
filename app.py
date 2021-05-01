# Import libraries
import os
import collections
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy

# Define database URI
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///olympics.sqlite"

# Remove tracking modifications
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define database table and column attributes
class Olympics(db.Model):
    __tablename__ = 'olympics'

    primary_id = db.Column(db.Integer, primary_key=True)
    NOC = db.Column(db.String(10))
    Region = db.Column(db.String(100))
    Medal = db.Column(db.String(20))
    Year = db.Column(db.Integer)

    def __repr__(self):
        return '<Olympics %r>' % (self.name)

# Flask route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

# Flask route to query data from SQLite database and output in json format
@app.route("/api/olympics")
def olympics():
    results = db.session.query(Olympics.primary_id, Olympics.NOC, Olympics.Region, Olympics.Medal, Olympics.Year).all()

    olympics_data = []

    # Loop through query results and assign key value pairs for each row
    for result in results:
        dict = collections.OrderedDict()
        dict["primary_id"] = result[0]
        dict["NOC"] = result[1]
        dict["Region"] = result[2]
        dict["Medal"] = result[3]
        dict["Year"] = result[4]
        olympics_data.append(dict)

    # Loop through query results and assign variables to each series
    # primary_id = [result[0] for result in results]
    # NOC = [result[1] for result in results]
    # Region = [result[2] for result in results]
    # Medal = [result[3] for result in results]
    # Year = [result[4] for result in results]

    # Assign key value pairs to data series
    # olympics_data = [{
    #     "primary_id": primary_id,
    #     "NOC": NOC,
    #     "Region": Region,
    #     "Medal": Medal,
    #     "Year": Year
    # }]
    
    return jsonify(olympics_data)


if __name__ == "__main__":
    app.run()
