from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
#import numpy as np
#from pandas import Dataframe

#from flask_script import Manager
#import json
#from pprint import pprint
#import pandas as pd
#from sqlalchemy import create_engine
import sqlite3 as sq

#db_connect = create_engine('sqlite:///chinook.db')
conn = sq.connect('chinook.db')
c = conn.cursor()
#query = conn.execute('CREATE TABLE train_dxball (db_x NVARCHAR, db_y NVARCHAR, db_dx NVARCHAR, db_dy NVARCHAR, db_paddleX NVARCHAR, db_flag TEXT)')
#print "New table train_dxball created..."

app = Flask(__name__)
api = Api(app)

class HelloWorld(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        
        x=json_data[0]['x']
        y=json_data[0]['y']
        dx=json_data[0]['dx']
        dy=json_data[0]['dy']
        paddleX=json_data[0]['paddleX']
        flag=json_data[0]['flag']
        trainOrTest=json_data[0]['trainOrTest']
        
        if trainOrTest==0:
            print("Inserting play information into my database")
            col1,col2,col3,col4,col5,col6 = (x,y,dx,dy,paddleX,flag)
            c.execute("""INSERT INTO train_dxball (db_x,db_y,db_dx,db_dy,db_paddleX,db_flag) VALUES (?,?,?,?,?,?)""",(col1,col2,col3,col4,col5,col6))
            conn.commit()
            return json_data
        
        if trainOrTest==1:
            print("Now playing on my own...")
            resoverall = c.execute("""SELECT * from train_dxball""")
            print(resoverall.fetchall())
            
api.add_resource(HelloWorld, '/home')
				 
if __name__ == '__main__':
    app.run(port=5000)