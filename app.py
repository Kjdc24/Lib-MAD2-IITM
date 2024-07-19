from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin
from flask_security.decorators import roles_required, auth_required
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
import datetime

# Configuration
class Config(object):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///dev.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'kjdcnksjdnckjndckjndcjnkdjcnkjdncjkdncjkdncjkn'
    SECURITY_PASSWORD_SALT = 'kjsdnckjsndckjsndckjsndckjsndc'
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config.from_object(DevelopmentConfig)

# Initialize database
db = SQLAlchemy(app)

# Define models
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    password = db.Column(db.String(512), nullable=False)
    email = db.Column(db.String(64), unique=True, nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))

class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    date_created = db.Column(db.Date, nullable=False, default=datetime.date.today)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    author = db.Column(db.String(64), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    section = db.relationship('Section', backref=db.backref('books', lazy=True))
    date_added = db.Column(db.Date, nullable=True)
    content = db.Column(db.Text, nullable=True)

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_approved = db.Column(db.Boolean, nullable=False, default=False)
    date_requested = db.Column(db.Date, nullable=False, default=datetime.date.today)
    date_return = db.Column(db.Date, nullable=True)
    revoked = db.Column(db.Boolean, nullable=False, default=False)
    user = db.relationship('User', backref=db.backref('requests', lazy=True))
    book = db.relationship('Book', backref=db.backref('requests', lazy=True))

# Initialize Flask-Security
datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, datastore)
jwt = JWTManager(app)

# Create admin and user roles, and add default users
with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name='admin', description='Administrator')
    datastore.find_or_create_role(name='user', description='General User')
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(username="admin",email="admin@email.com", password=generate_password_hash("admin"),is_admin=True, roles=['admin'])
    if not datastore.find_user(email="user1@email.com"):
        datastore.create_user(username="user1",email="user1@email.com", password=generate_password_hash("user1"), roles=['user'])
    if not datastore.find_user(email="user2@email.com"):
        datastore.create_user(username="user2",email="user2@email.com", password=generate_password_hash("user2"), roles=['user'])   
    db.session.commit()
    
# Define views
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user-login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Email and password are required'}), 400
    email = data['email']
    password = data['password']
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({'message': 'User not found'}), 404  
    if check_password_hash(user.password, password):
        token = user.get_auth_token()
        roles = user.roles[0].name if user.roles else None
        return jsonify({"token": token, "email": user.email, "roles": roles}), 200  
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'message': 'Username, email, and password are required'}), 400
    username = data['username']
    email = data['email']
    password = data['password']
    # Check if user already exists
    if datastore.find_user(email=email):
        return jsonify({'message': 'User with this email already exists'}), 409
    # Hash the password
    hashed_password = generate_password_hash(password)
    # Create the user
    try:
        user_role = datastore.find_or_create_role(name='user', description='General User')
        datastore.create_user(username=username, email=email, password=hashed_password, roles=[user_role])
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating user: {str(e)}'}), 500

@app.route('/admin', methods=['GET'])
def admin():
    sections = Section.query.all()
    section_data = []
    for section in sections:
        section_info = {
            'id': section.id,
            'name': section.name,
            'date_created': section.date_created,
            'num_books': len(section.books)  # Add the number of books in the section
        }
        section_data.append(section_info)
    return jsonify(section_data)

@app.route('/add-section', methods=['POST'])
def add_section():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({'message': 'Section name is required'}), 400
    name = data['name']
    try:
        section = Section(name=name)
        db.session.add(section)
        db.session.commit()
        return jsonify({'message': 'Section added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding section: {str(e)}'}), 500

@app.route('/edit-section/<int:id>', methods=['POST'])
def edit_section(id):
    data = request.json
    if not data or 'name' not in data:
        return jsonify({'message': 'Section name is required'}), 400
    section = Section.query.get(id)
    if not section:
        return jsonify({'message': 'Section not found'}), 404
    try:
        section.name = data['name']
        db.session.commit()
        return jsonify({'message': 'Section updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating section: {str(e)}'}), 500
    
@app.route('/delete-section/<int:id>', methods=['POST'])
def delete_section(id):
    section = Section.query.get(id)
    if not section:
        return jsonify({'message': 'Section not found'}), 404
    try:
        # Delete all books in the section
        books = Book.query.filter_by(section_id=id).all()
        if books:
            for book in books:
                db.session.delete(book)
        # Delete the section
        db.session.delete(section)
        db.session.commit()
        return jsonify({'message': 'Section deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting section: {str(e)}'}), 500


@app.route('/view-books/<int:id>', methods=['GET'])
def books():
    books = Book.query.filter_by(section_id=id).all()
    book_data = []
    for book in books:
        book_info = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'date_added': book.date_added,
            'content': book.content
        }
        book_data.append(book_info)
    return jsonify(book_data)

if __name__ == "__main__":
    app.run(debug=True,port=8000)
