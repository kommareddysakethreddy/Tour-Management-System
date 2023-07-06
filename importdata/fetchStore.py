from pymongo import MongoClient
import pymongo
import pandas as pd
import glob
import json
import os

def convert_to_json(data):
    try:
        lt=[]
        for res in data:
            lt.append(res)
        json_string=json.dumps(lt)
        jsonFile = open("C:/Users/saket/Desktop/xwebsite/client/importdata/data1.json", "w")
        jsonFile.write(json_string)
        jsonFile.close()
        return 1
    except:
        print("ERROR OCCURED CLOSING CONNECTION")
        return 0
def convert_to_excel():
    try:
        df_json=pd.read_json('C:/Users/saket/Desktop/xwebsite/client/importdata/data1.json')
        df_json.to_excel('C:/Users/saket/Desktop/xwebsite/client/importdata/store1.xlsx')
        os.remove("C:/Users/saket/Desktop/xwebsite/client/importdata/data1.json")
        return 1
    except:
        print("ERROR IN CONVERSION, CLOSE EXCEL FILES IF ANY")
        return 0
def merge_excel():
    try:
        path = "C:/Users/saket/Desktop/xwebsite/client/importdata"
        files = glob.glob(path + "/*.xlsx")
        excl = []
        for file in files:
            excl.append(pd.read_excel(file))
        mergedFile = pd.DataFrame()
        for excl_file in excl:
            mergedFile = mergedFile.append(excl_file, ignore_index=True)
        mergedFile.to_excel('final.xlsx', index=False)
        os.remove("C:/Users/saket/Desktop/xwebsite/client/importdata/store1.xlsx")
        return 1
    except:
        print("ERROR IN MERGING FILE")
        return 0


CONNECTION_STRING = "mongodb+srv://sakethreddy:sakethreddy@cluster0.ci1uvvm.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(CONNECTION_STRING)
if(client):
    print("connection successful")
    dbname=client['mongo_test']
    collection_name = dbname['test']
    data=collection_name.find()
    if convert_to_json(data)==1:
        if convert_to_excel()==1:
            if merge_excel()==1:
                print("SUCCESSFULLY MERGED FILES")

else:
    print("sorry")


# # Import Aspose.Words for Python via .NET module
# import aspose.words as aw

# # Create and save a simple document
# doc = aw.Document("C:/Users/saket/Pictures/Camera Roll/Saved Pictures/My Diary.pdf")
# # builder = aw.DocumentBuilder(doc)
# # # builder.writeln("Hello Aspose.Words for Python via .NET")

# doc.save("C:/Users/saket/Desktop/xwebsite/client/importdata/new.docx")

