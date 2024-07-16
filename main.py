from flask import Flask
from codes.models import db, User, Role
from codes.resource import api
from config import DevelopmentConfig
from flask_security import Security, SQLAlchemyUserDatastore

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security = Security(app, user_datastore)
    with app.app_context():
        from codes.views import views
        app.register_blueprint(views)
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)