from flask import Flask, jsonify, request
from flask_restful import reqparse, abort, Api, Resource
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn import linear_model
from sklearn.metrics import mean_squared_error, r2_score
import sqlite3

conn = sqlite3.connect('dxball.db',check_same_thread=False)
print("Opened database successfully")

c = conn.cursor()

app = Flask(__name__)
api = Api(app)

train_row=[];

def predict(test_row):
    df_train = pd.read_sql_query("SELECT * FROM dxball where db_flag = 1", conn)
    X = pd.DataFrame(df_train[['db_x','db_y','db_dx','db_dy']])
    Y = pd.DataFrame(df_train['db_paddleX'])
    reg = linear_model.LinearRegression()
    reg.fit(X,Y)
    res = reg.predict(test_row)
    return res
	
class train(Resource):
    def post(self):      
        json_data = request.get_json(force=True)        
        x=json_data[0]['x']
        y=json_data[0]['y']
        dx=json_data[0]['dx']
        dy=json_data[0]['dy']
        paddleX=json_data[0]['paddleX']
        trainOrTest=json_data[0]['trainOrTest']
        flag=json_data[0]['flag']
        curr_row = [x,y,dx,dy,paddleX,flag,trainOrTest]
        train_row.append(curr_row)
        if flag == 0:
            print("Now writing to the database!")
            for item in train_row:
                c.execute("""INSERT INTO dxball (db_x,db_y,db_dx,db_dy,db_paddleX,db_flag,db_trainOrTest) VALUES (?,?,?,?,?,?,?)""",item)
            train_row[:] = []
            conn.commit()

class test(Resource):
    def post(self):
        json_data = request.get_json(force=True) 
        x=json_data[0]['x']
        y=json_data[0]['y']
        dx=json_data[0]['dx']
        dy=json_data[0]['dy']
        
        test_row = [[x,y,dx,dy]]
        res = predict(test_row)
        print(res[0][0])
        return res[0][0]
        
api.add_resource(train, '/train')
api.add_resource(test, '/test')

if __name__ == '__main__':
    app.run(debug=True)
    
conn.close()