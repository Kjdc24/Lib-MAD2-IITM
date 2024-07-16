from flask import Blueprint, render_template, jsonify ,request, redirect, url_for, flash
from flask_security import roles_required, login_required, current_user
from flask_jwt_extended import create_access_token
from codes.models import Section, Book, db

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('index.html')  # Serve the index.html of Vue.js app

