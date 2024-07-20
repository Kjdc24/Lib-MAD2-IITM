from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import JWTManager
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
    date_added = db.Column(db.Date, nullable=True, default=datetime.date.today)
    content = db.Column(db.Text, nullable=True)

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_requested = db.Column(db.Boolean, nullable=False, default=False)
    is_approved = db.Column(db.Boolean, nullable=False, default=False)
    date_requested = db.Column(db.Date, nullable=False, default=datetime.date.today)
    date_return = db.Column(db.Date, nullable=True)
    user = db.relationship('User', backref=db.backref('requests', lazy=True))
    book = db.relationship('Book', backref=db.backref('requests', lazy=True))

# Initialize Flask-Security
datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, datastore)
jwt = JWTManager(app)

with app.app_context():
    db.create_all()
    # Create roles if they don't exist
    if not Role.query.filter_by(name='admin').first():
        datastore.find_or_create_role(name='admin', description='Administrator')
    if not Role.query.filter_by(name='user').first():
        datastore.find_or_create_role(name='user', description='General User')
    db.session.commit()
    # Create default users if they don't exist
    if not User.query.filter_by(email="admin@email.com").first():
        datastore.create_user(username="admin", email="admin@email.com", password=generate_password_hash("admin"), is_admin=True, roles=['admin'])
    if not User.query.filter_by(email="user1@email.com").first():
        datastore.create_user(username="user1", email="user1@email.com", password=generate_password_hash("user1"), roles=['user'])
    if not User.query.filter_by(email="user2@email.com").first():
        datastore.create_user(username="user2", email="user2@email.com", password=generate_password_hash("user2"), roles=['user'])
    db.session.commit()
    
    # Create default sections if they don't exist
    section1 = Section.query.filter_by(name="Science Fiction").first()
    if not section1:
        section1 = Section(name="Science Fiction")
        db.session.add(section1)
    
    section2 = Section.query.filter_by(name="Fantasy").first()
    if not section2:
        section2 = Section(name="Fantasy")
        db.session.add(section2)  
    db.session.commit()

    # Retrieve sections
    section1 = Section.query.filter_by(name="Science Fiction").first()
    section2 = Section.query.filter_by(name="Fantasy").first()
    # Create default books if they don't exist
    if not Book.query.filter_by(title="Dune").first():
        book1 = Book(
            title="Dune",
            author="Frank Herbert",
            section_id=section1.id,
            content="A science fiction novel about the desert planet Arrakis."
        )
        db.session.add(book1)
    if not Book.query.filter_by(title="The Hobbit").first():
        book2 = Book(
            title="The Hobbit",
            author="J.R.R. Tolkien",
            section_id=section2.id,
            content="A fantasy novel about the adventure of Bilbo Baggins."
        )
        db.session.add(book2)
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
        id = user.id
        return jsonify({"token": token, "email": user.email, "roles": roles, "id": id}), 200  
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
def view_books(id):
    section = Section.query.get(id)
    if not section:
        return jsonify({'message': 'Section not found'}), 404
    books = Book.query.filter_by(section_id=id).all()
    book_data = []
    for book in books:
        book_info = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'date_added': book.date_added,
            'content': book.content,
            'section_name': section.name
        }
        book_data.append(book_info) 
    response = {
        'section_name': section.name,
        'books': book_data
    }
    return jsonify(response)

@app.route('/add-book', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(
        title=data['title'],
        author=data['author'],
        content=data['content'],
        section_id=data['section_id']
    )
    try:
        db.session.add(new_book)
        db.session.commit()
        return jsonify({'message': 'Book added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error adding book: {str(e)}'}), 500

@app.route('/edit-book/<int:id>', methods=['POST'])
def edit_book(id):
    data = request.json
    book = Book.query.get(id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    try:
        book.title = data['title']
        book.author = data['author']
        book.content = data['content']
        db.session.commit()
        # Assuming book.section_id is the foreign key to the section
        section_id = book.section_id 
        return jsonify({'message': 'Book updated successfully', 'section_id': section_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error updating book: {str(e)}'}), 500

@app.route('/delete-book/<int:id>', methods=['POST'])
def delete_book(id):
    book = Book.query.get(id)
    section_id = book.section_id
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    try:
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully', 'section_id': section_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error deleting book: {str(e)}'}), 500

@app.route('/user', methods=['GET'])
def user():
    user_id = request.args.get('userId')  # Get the userId from the query parameters
    if not user_id:
        return jsonify({'message': 'Missing user ID'}), 400
    books = Book.query.all()
    book_data = []
    for book in books:
        requested = Request.query.filter_by(book_id=book.id, user_id=user_id).first()
        book_info = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'section': book.section.name,
            'content': book.content,
            'is_requested': bool(requested)
        }
        book_data.append(book_info) 
    return jsonify(book_data)

@app.route('/user-profile', methods=['GET'])
def user_profile():
    data = request.json
    if not data or 'userId' not in data:
        return jsonify({'message': 'User ID is required'}), 400
    user_id = data['userId']
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    user.username = data['username']
    user.email = data['email']
    user.password = generate_password_hash(data['password'])
    db.session.commit()
    return jsonify({'message': 'User profile updated successfully'}), 200

@app.route('/request-book', methods=['POST'])
def request_book():
    data = request.get_json()
    book_id = data.get('bookId')
    user_id = data.get('userId')
    if not book_id or not user_id:
        return jsonify({'message': 'Missing data'}), 400        
    book = Book.query.get(book_id)
    user = User.query.get(user_id)
    if not book or not user:
        return jsonify({'message': 'Book or user not found'}), 404
    # Check if the user has already requested the book
    existing_request = Request.query.filter_by(book_id=book_id, user_id=user_id, is_requested=True).first()
    if existing_request:
        return jsonify({'message': 'Book already requested'}), 400    
    # Check if the user has reached the request limit
    active_requests = Request.query.filter_by(user_id=user_id, is_requested=True).count()
    if active_requests >= 5:
        return jsonify({'message': 'You can only request a maximum of 5 books'}), 400
    new_request = Request(book_id=book_id, user_id=user_id, is_requested=True)
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Book request submitted successfully'}), 200

@app.route('/all-books', methods=['GET'])
def all_books():
    try:
        books = Book.query.all()
        book_list = [{
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'section': book.section.name,
            'date_added': book.date_added,
            'content': book.content
        } for book in books]
        return jsonify({'books': book_list}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching books: {str(e)}'}), 500

@app.route('/my-books', methods=['GET'])
def my_books():
    user_id = request.args.get('userId')
    if not user_id:
        return jsonify({'message': 'Missing user ID'}), 400    
    requests = Request.query.filter_by(user_id=user_id, is_requested=True).all()
    book_data = []
    for requested in requests:
        book = Book.query.get(requested.book_id)
        book_info = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'section': book.section.name,
            'date_return': requested.date_return if requested.is_approved else None,
            'is_approved': requested.is_approved,
        }
        book_data.append(book_info)
    return jsonify(book_data)

@app.route('/all-request', methods=['GET'])
def all_request():
    requests = Request.query.all()
    request_data = []
    for requested in requests:
        book = Book.query.get(requested.book_id)
        user = User.query.get(requested.user_id)
        request_info = {
            'id': requested.id,
            'book_title': book.title,
            'user_email': user.email,
            'is_approved': requested.is_approved,
            'date_requested': requested.date_requested,
        }
        request_data.append(request_info)
    return jsonify(request_data)

@app.route('/approve-request/<int:request_id>', methods=['POST'])
def approve_request(request_id):
    requested = Request.query.get(request_id)
    if requested:
        requested.is_approved = True
        requested.date_return = datetime.date.today() + datetime.timedelta(days=14)
        db.session.commit()
        return jsonify({'message': 'Request approved'}), 200
    return jsonify({'error': 'Request not found'}), 404

@app.route('/remove-request/<int:request_id>', methods=['POST'])
def remove_request(request_id):
    requested = Request.query.get(request_id)
    if requested:
        db.session.delete(requested)
        db.session.commit()
        return jsonify({'message': 'Request removed'}), 200
    return jsonify({'error': 'Request not found'}), 404

if __name__ == "__main__":
    app.run(debug=True,port=8000)