# import necessary libraries
import os
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
## rename olympicsdb 
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///olympics.sqlite"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# Columns already defined? 
class Olympics(db.Model):
        __tablename__ = 'olympics'

        primary_id = db.Column(db.Integer, primary_key=True)
        NOC = db.Column(db.String(10))
        Region = db.Column(db.String(100))
        Medal = db.Column(db.String(20))
        Year = db.Column(db.Integer)
        def __repr__(self):
            return '<Olympics %r>' % (self.name)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


# Remove??
# @app.route("/send", methods=["GET", "POST"])
# def send():
#     if request.method == "POST":
#         name = request.form["petName"]
#         lat = request.form["petLat"]
#         lon = request.form["petLon"]

#         pet = Pet(name=name, lat=lat, lon=lon)
#         db.session.add(pet)
#         db.session.commit()
#         return redirect("/", code=302)

#     return render_template("form.html")

#Olympics.all columns - 
@app.route("/api/olympics")
def olympics():
    results = db.session.query(Olympics.primary_id, Olympics.NOC, Olympics.Region, Olympics.Medal, Olympics.Year).all()

    primary_id = [result[0] for result in results]
    NOC = [result[1] for result in results]
    Region = [result[2] for result in results]
    Medal = [result[3] for result in results]
    Year = [result[4] for result in results]

    olympics_data = {
        "primary_id": {
            "NOC": [],
            "Region": [],
            "Medal": [],
            "Year": [],
        }
    }
   for i in len(primary_id):
       olympics_data["primary_id"].append(primary_id[i])
       olympics_data["NOC"].append(NOC[i])
       olympics_data["Region"].append(Region[i])
       olympics_data["Medal"].append(Medal[i])
       olympics_data["Year"].append(Year[i])
    # olympics_data = [{
    #     #"type": "scattergeo",
    #     #"locationmode": "USA-states",
    #     "primary_id": primary_id,
    #     "NOC": NOC,
    #     "Region": Region,
    #     "Medal": Medal,
    #     "Year": Year,
    #     #"text": hover_text,
    #     #"hoverinfo": "text",
    #     #"marker": {
    #         #"size": 50,
    #         #"line": {
    #             #"color": "rgb(8,8,8)",
    #             #"width": 1
    #         #},
    #     #}
    # }]

    return jsonify(olympics_data)


if __name__ == "__main__":
    app.run()
