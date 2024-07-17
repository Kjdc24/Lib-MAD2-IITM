from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore, UserMixin, RoleMixin, hash_password, roles_required, auth_required
from flask_security.utils import verify_password
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
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship('Role', secondary='roles_users', backref=db.backref('users', lazy='dynamic'))

class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), nullable=False)
    author = db.Column(db.String(64), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'), nullable=False)
    section = db.relationship('Section', backref=db.backref('books', lazy=True))
    date_issued = db.Column(db.Date, nullable=True)
    return_date = db.Column(db.Date, nullable=True)
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
        datastore.create_user(email="admin@email.com", password=hash_password("admin"),is_admin=True, roles=['admin'])
    if not datastore.find_user(email="user1@email.com"):
        datastore.create_user(email="user1@email.com", password=hash_password("user1"), roles=['user'])
    if not datastore.find_user(email="user2@email.com"):
        datastore.create_user(email="user2@email.com", password=hash_password("user2"), roles=['user'])   
    db.session.commit()

# Define views
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and verify_password(data['password'], user.password):
        access_token = create_access_token(identity={'email': user.email, 'is_admin': user.is_admin})
        response_data = {'access_token': access_token,'is_admin': user.is_admin}
        return jsonify(response_data), 200
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/admin')
@roles_required('admin')
@auth_required('token')
def admin():
    return "Admin page"


if __name__ == "__main__":
    app.run(debug=True)
