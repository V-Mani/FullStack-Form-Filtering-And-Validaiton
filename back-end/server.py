import csv
from flask import Flask, request, jsonify
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MySQL_HOST'] = 'locathost'
app.config['MYSQL_USER'] ='root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'parshva_db'

mysql = MySQL(app)

# @app.route('/api/get_all_data', methods=['GET'])
# def get_all_data():
#     cursor = mysql.connection.cursor()
#     cursor.execute("SELECT * FROM docket;")
#     rv = cursor.fetchall()
#     cursor.close()
#     return str(rv)

# Create a route to handle form submissions
@app.route('/submit', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        data = request.json
        name = data.get('name')
        startTime = data.get('startTime')
        endTime = data.get('endTime')
        hoursWorked = data.get('hoursWorked')
        ratePerHour = data.get('ratePerHour')
        selectedSupplier = data.get('selectedSupplier')
        selectedPurchaseOrder = data.get('selectedPurchaseOrder')
        description = data.get('description')
        
        # Insert the data into the MySQL database
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO docket (name, starttime, endtime, hoursworked, rate, supplier, purchaseorder, decription) VALUES (%s, %s,%s, %s,%s, %s,%s,%s)", (name, startTime, endTime, hoursWorked, ratePerHour, selectedSupplier, selectedPurchaseOrder, description))
        mysql.connection.commit()
        cursor.close()
        
        return jsonify({"message": "Data added to the database"})

@app.route('/api/csv-data', methods=['GET'])
def get_csv_data():
    data = []
    # Read the CSV file and process data to fill in missing Supplier values based on the same PO Number
    with open('data.csv', 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        prev_supplier = None
        for row in csvreader:
            if not row['Supplier'] and prev_supplier:
                row['Supplier'] = prev_supplier
            data.append(row)
            prev_supplier = row['Supplier']
    return jsonify(data)

#------------------------------------------------------------------------------------------
# Define an endpoint to fetch the Description
@app.route('/get_description', methods=['GET'])
def get_description():
    selected_supplier = request.args.get('selectedSupplier')
    selected_po = request.args.get('selectedPurchaseOrder')
    description = None

    with open('data.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            if row['Supplier'] == selected_supplier and row['PO Number'] == selected_po:
                description = row['Description']
                break

    return jsonify({'Description': description})
#------------------------------------------------------------------------------------------ 

@app.route('/api/get_all_data', methods=['GET'])
def get_all_data():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM docket;")
    rows  = cursor.fetchall()
    data = []
    for row in rows:
        data.append({
            'id': row[0],
            'name': row[1],
            'startTime': row[2],
            'endTime': row[3],
            'hoursWorked': row[4],
            'ratePerHour': row[5],
            'selectedSupplier': row[6],
            'selectedPurchaseOrder': row[7],
            'decription':row[8]
            })
    cursor.close()
    return jsonify(data)  


@app.route('/api/get_selected_data/<int:id>', methods=['GET'])
def get_selected_data(id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM docket WHERE id = %s;", (id,))
    row = cursor.fetchone()
    data = {
        'id': row[0],
        'name': row[1],
        'startTime': row[2],
        'endTime': row[3],
        'hoursWorked': row[4],
        'ratePerHour': row[5],
        'selectedSupplier': row[6],
        'selectedPurchaseOrder': row[7],
        'description': row[8]
    }
    cursor.close()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
