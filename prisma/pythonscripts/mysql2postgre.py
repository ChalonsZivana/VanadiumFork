from mysql2postgre import a


#connect mysql server
a.connect_mysql(host='localhost',
            port='3306',
            user='root',
            passwd='password',
            db='vanadium')

#connect postgresql server
a.connect_postgresql(host='localhost',            
                    port=5432,
                    user='vanadium',                                
                    password='omkm1806$',                     
                    database='vanadium')  


# manual table to transfer data  -> default all table in database
a.tables = ['table1', 'table2', ...]

# manual without table to transfer data  -> default empty
a.without = ['table3', 'table4', ...]

# manual limit to query data -> default 10000 
# not limit -> a.limit = 0 
a.limit = 10000


# program run
a.run()   