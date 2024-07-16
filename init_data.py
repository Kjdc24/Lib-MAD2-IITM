from main import app
from codes.models import db, User, Role
from flask_security.utils import hash_password

with app.app_context():
    db.create_all()
    role_admin = Role(name="admin", description="Admin role")
    role_user = Role(name="user", description="User role")
    db.session.add(role_admin)
    db.session.add(role_user)
    
    admin = User(
        username="admin",
        password=hash_password("admin"),  # Hash the password
        name="Admin",
        email="admin@email.com",
        fs_uniquifier="admin",
        active=True
    )
    admin.roles.append(role_admin)
    db.session.add(admin)

    try:
        db.session.commit()
        print("Database has been initialized")
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing database: {e}")
