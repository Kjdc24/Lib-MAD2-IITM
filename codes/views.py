from flask import Blueprint, render_template, jsonify ,request, redirect, url_for, flash
from flask_security import roles_required
from codes.models import Section, Book, db

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template('index.html')  # Serve the index.html of Vue.js app

@views.route('/api/sections', methods=['GET'])
def get_sections():
    sections = Section.query.all()
    return jsonify([section.name for section in sections])

@views.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.title for book in books])
