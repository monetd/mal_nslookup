#!/home/ktsec/.pyenv/versions/2.7.10/bin/python2.7
#-*- coding:utf-8 -*-
import sqlite3
import dns.resolver

conn = sqlite3.connect("site.db")
my_resolver = dns.resolver.Resolver()
lookup_url = ""

with conn:
    cur = conn.cursor()

    cur.execute("select * from setting")
    rows = cur.fetchall()

    for row in rows:
        my_resolver.timeout = row[2]
        my_resolver.lifetime = row[2]
        lookup_url = row[3]

    cur.execute("select * from post")
    rows = cur.fetchall()

    for row in rows:
        my_resolver.nameservers = [row[1]]

        try:
            response = my_resolver.query(lookup_url, 'A')
            #print(row[1], "query ok...")
            cur.execute("UPDATE post SET status = 'true' WHERE id=?", (row[0],))
            cur.execute("UPDATE post SET resp_date = datetime('now','localtime') WHERE id=?", (row[0],))
        except:
            print(row[1], "query failed")
            cur.execute("UPDATE post SET status = 'false' WHERE id=?", (row[0],))
