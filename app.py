#!/usr/bin/python
#-*- coding:utf-8 -*-

from datetime import datetime

from flask import Flask, flash, render_template, request, redirect, Response
from flask_sqlalchemy import SQLAlchemy
import jsonpickle
import os
from sendMail import sendMail
from jinja2 import Environment, FileSystemLoader
THIS_DIR = os.path.dirname(os.path.abspath(__file__))
j2_env = Environment(loader=FileSystemLoader(THIS_DIR))

app = Flask(__name__)

app.config['SECRET_KEY'] = 'this is secret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        posts = Post.query.order_by("status").all()
        for post in posts:
            post.reg_date = post.reg_date.strftime("%Y-%m-%d %H:%M:%S")
            post.resp_date = post.resp_date.strftime("%Y-%m-%d %H:%M:%S")
        return Response(jsonpickle.encode(posts), mimetype='application/json')
    posts = Post.query.order_by("status").all()
    settings = Setting.query.all()
    return render_template('index.html', posts=posts, settings=settings)

@app.route('/ipmgnt')
def ipmgnt():
    posts = Post.query.order_by("status").all()
    return render_template('ipmgnt.html', posts=posts, title=u'IP 관리')

@app.route('/settings')
def settings():
    settings = Setting.query.all()
    return render_template('settings.html', settings=settings, title=u'설정')

@app.route('/set', methods=['POST'])
def set():
    try:
        interval = request.form.get("interval")
        lifetime = request.form.get("lifetime")
        lookup_url = request.form.get('lookup_url')
        mailing = request.form.get('mailing')
        sound = request.form.get('sound')

        setting = Setting.query.filter_by(id=1).first()
        setting.interval = interval
        setting.lifetime = lifetime
        setting.lookup_url = lookup_url
        if mailing == '1': setting.mailing = 1
        else: setting.mailing = 0

        if sound == '1': setting.sound = 1
        else: setting.sound = 0

        db.session.commit()
    except:
        db.session.rollback()
        flash("Oops something went wrong")

    return redirect("/")

@app.route('/add', methods=['POST'])
def add():
    if request.method == 'POST':
        try:
            ip = request.form['ip']
            post = Post(server=ip)
            db.session.add(post)
            db.session.commit()
        except:
            db.session.rollback()
            flash("Oops something went wrong")
    return redirect("/")

@app.route('/delete/<id>', methods=['POST', 'GET'])
def delete(id):
    try:
        post = Post.query.filter_by(id=id).first()
        db.session.delete(post)
        db.session.commit()
    except:
        db.session.rollback()
        flash("Oops something went wrong")
    return redirect("/")

@app.route('/send_mail', methods=['POST'])
def send_mail():
    datas = Post.query.filter_by(status="false")
    contents = j2_env.get_template('mail.html').render(datas=datas)
    sendMail(contents)

    return 'Mail Sent!'

class Post(db.Model):
    __table_name__ = 'post'

    id = db.Column(db.Integer, primary_key=True)
    server = db.Column(db.String(20), unique=True, nullable=False)
    status = db.Column(db.Text)
    reg_date = db.Column(db.DateTime, default=datetime.now())
    resp_date = db.Column(db.DateTime, default=datetime.now())

    def __repr__(self):
        return "<Post('{self.id}', '{self.server}')>"

class Setting(db.Model):
    __table_name__ = "setting"

    id = db.Column(db.Integer, primary_key=True)

    interval = db.Column(db.Integer, nullable=False)
    lifetime = db.Column(db.Integer, nullable=False)
    lookup_url = db.Column(db.Text, nullable=False)
    mailing = db.Column(db.Integer, nullable=False)
    sound = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return "<Setting('{self.id}', '{self.interval}', '{self.lifetime}', '{self.lookup_url}', '{self.mailing}'), '{self.sound}'>"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7780)
