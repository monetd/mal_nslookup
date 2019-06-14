#!/home/ktsec/.pyenv/versions/2.7.10/bin/python2.7
#-*- coding:utf-8 -*-
import os
import sqlite3
import dns.resolver
import time
import datetime
from sendMail import sendMail
from jinja2 import Environment, FileSystemLoader
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
j2_env = Environment(loader=FileSystemLoader(THIS_DIR))

conn = sqlite3.connect("site.db")
my_resolver = dns.resolver.Resolver()
lookup_url = ""
mailing_flag = ""
now_dt = datetime.datetime.now()
error_dt = datetime.datetime.now() - datetime.timedelta(minutes=3)
error_ips = []
error_flag = False

with conn:
    cur = conn.cursor()

    cur.execute("select * from setting")
    rows = cur.fetchall()

    for row in rows:
        my_resolver.timeout = row[2]
        my_resolver.lifetime = row[2]
        lookup_url = row[3]
        mailing_flag = row[4]

    cur.execute("select * from post")
    rows = cur.fetchall()

    for row in rows:
        my_resolver.nameservers = [row[1]]
        time.sleep(0.1)

        row_dt = datetime.datetime.strptime(row[4], '%Y-%m-%d %H:%M:%S')

        try:
            response = my_resolver.query(lookup_url, 'A')
            cur.execute("UPDATE post SET status = 'true' WHERE id=?", (row[0],))
            cur.execute("UPDATE post SET resp_date = datetime('now','localtime') WHERE id=?", (row[0],))
        except:

            if error_dt > row_dt:         # 현재시간보다 3분전보다 더 늦는다면 Error!
                error_flag = True
                print(row[1], "query failed")
                cur.execute("UPDATE post SET status = 'false' WHERE id=?", (row[0],))

                error_ips.append(row[1])

    if mailing_flag == 1 and error_flag:
        print("send alert mail with ip=[", error_ips,"]")
        contents = j2_env.get_template('mail.html').render(datas=error_ips)
        cur.execute("UPDATE setting SET mailing=0 WHERE id=1")
        sendMail(contents)