#!/usr/bin/python
#-*- coding:utf-8 -*-

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
import os
from jinja2 import Environment, FileSystemLoader
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
j2_env = Environment(loader=FileSystemLoader(THIS_DIR))

# 메일 송수신 주소 설정
mailSubject = '[자동메일] 클린DNS 우회 IP 무응답 경보'
fromaddr = 'ktsec.public@gmail.com'
toaddrs = ['kt-nw-security@kt.com']

# Gmail Login
username = 'ktsec.public'
password = 'qhdksrhkswp)#^%'

def sendMail(contents):
    # MIMEHtml 생성
    msg = MIMEMultipart('alternative')
    msg['Subject'] = Header(mailSubject,'utf8')
    msg['From'] = fromaddr
    msg['To'] = ", ".join(toaddrs)
    msg['charset'] = "utf-8"

    html = contents.encode('utf-8')
    # Record the MIME types of both parts - text/plain and text/html.
    htmlMsg = MIMEText(html, 'html')
    msg.attach(htmlMsg)

    # 메일 발송
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.starttls()
    server.login(username, password)
    server.sendmail(fromaddr, toaddrs, msg.as_string())
    server.quit()
